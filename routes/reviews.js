const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require("../Utilities/catchAsync.js");
const ExpressError = require("../Utilities/ExpressError.js");
const Campground = require("../models/campground.js");
const Review = require('../models/review.js');
const reviews = require('../controllers/reviews.js')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware.js');


router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router