const express=require("express");
const router=express.Router({mergeParams: true}); //mergeParams helps to get params.id otherwise it want get it passed
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// Client-side validation using JOI

const validateReview = ((req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
});



//Reviews (Post Route)
router.post("/", validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listing._id}`);
}));

// Delete Review Route
router.delete("/:reviewId", wrapAsync(async (req, res) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new expressError("Review not found", 404);
    }
    await Listing.findByIdAndUpdate(review.listing, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted!");

    res.redirect(`/listings/${review.listing}`);
}));


module.exports=router;