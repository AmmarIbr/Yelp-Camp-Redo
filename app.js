if (process.env.NODE_ENV !== "produciton") {
  require('dotenv').config()
}


const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const app = express();
const ExpressError = require("./Utilities/ExpressError.js");
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user.js')
const MongoDBStore = require("connect-mongo")(session);
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp" 
const secret = process.env.SECRET || 'thisshouldbeabettersecret'
const port = process.env.PORT || 3000
//process.env.DB_URL

//"mongodb://127.0.0.1:27017/yelp-camp"

const campgroundRoutes = require('./routes/campgrounds.js')
const reviewRoutes = require('./routes/reviews.js')
const userRoutes = require('./routes/users.js')

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

app.engine("ejs", ejsMate);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")))



const store = new MongoDBStore({
  url: dbUrl,
  secret,
  touchAfter: 24 * 3600
})

store.on("error", function(e) {
  console.log("session Store Error:", e)
})

const sessionConfig = {
  store,
  secret,
  resave: false, //to remove deprecation warning
  saveUninitialized: true, //to remove deprecation warning
  cookie: {
    httpOnly: true,
    expires: Date.now() + 604800000,
    maxAge: 604800000
  },

}
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})


app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.get('/', (req, res) => {
  res.render('home')
});

app.listen(port, () => {
  console.log(`Serving on port ${port}`);
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something Went Horribly Wrong";
  res.status(statusCode).render("error.ejs", { err });
  res.send("OH BOY, SOMETHING WENT WRONG");
});
