const mongoose = require('mongoose')
const passport = require('passport')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email Required!'],
        unique: true
    },
})

userSchema.plugin(passportLocalMongoose)

const User = mongoose.model('User', userSchema)
module.exports = User