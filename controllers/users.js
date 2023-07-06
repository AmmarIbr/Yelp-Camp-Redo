const User = require('../models/user')
const passport = require('passport')

module.exports.renderRegister = (req, res) => {
    res.render('users/register.ejs')
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email: email, username: username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (error) => {
            if (error) return next()
            req.flash('success', 'welcome to yelpcamp')
            res.redirect('/campgrounds')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login.ejs')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Weclome back')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}
module.exports.logout = (req, res) => {
    req.logout(() => {
        req.flash('success', 'Goodbye!')
        return res.redirect('/campgrounds')
    })
}