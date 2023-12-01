const mongoose = require("mongoose");
const Campground = require("../models/campground.js");
const cities = require("./cities.js");
const { places, descriptors } = require("./seedHelpers.js");
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp"
//process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp"
console.log(dbUrl)

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected!");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async function () {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 50) + 10;
    const camp = new Campground({
      author: '655807d67a03c9cdb4d8ab41',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url: "https://res.cloudinary.com/dbzrrl9ak/image/upload/v1701139674/YelpCamp/qra7nf3fuff60j7ipagd.jpg",
          filename : `campground ${i}`,
        },
        {
          url: "https://res.cloudinary.com/dbzrrl9ak/image/upload/v1701141618/scott-goodwill-y8Ngwq34_Ak-unsplash_yvtwmy.jpg",
          filename: `campground ${i}.1`
        }
      ],
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude
        ],
      },
      description:
        "Welcome to our campground, the perfect destination for outdoor enthusiasts and nature lovers! Our campground offers a serene and picturesque setting, surrounded by lush forests and breathtaking views. Whether you're a seasoned camper or new to the camping experience, our campground provides a range of amenities to ensure a comfortable stay. From spacious campsites equipped with fire pits and picnic tables to clean restroom facilities and hot showers, we've got you covered. Explore the nearby hiking trails, go fishing in the nearby lake, or simply relax by the campfire and enjoy the tranquility of nature. Book your stay at our campground and create unforgettable memories in the great outdoors.",
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  db.close();
});
