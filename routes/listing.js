const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const expressError=require("../utils/ExpressError.js");
const { listingSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");


// Client-side validation using JOI

const validateListing = ((req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    } else {
        next();
    }
});



// INDEX ROUTE
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

// New route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// SHOW ROUTE (Read Operation)
router.get("/:id", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate("reviews");

    if(!listing){ 
        req.flash("error","Listing You Requested Does not Exist!");
        return res.redirect('/listings');
    }
    res.render("listings/show.ejs", { listing });
}));

// CREATE OPERATION (new and create route)
router.post("/", validateListing, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
}));

// UPDATE OPERATION (edit and update route)
router.get("/:id/edit", wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing){ 
        req.flash("error","Listing You Requested Does not Exist!");
        return res.redirect('/listings');
    }
    res.render("listings/edit.ejs", { listing });
}));

router.put("/:id", wrapAsync(async (req, res) => {
    if (!req.body.listing) {
        throw new ExpressError(400, "Invalid Listing Data");
    }
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success","Listing Upadated !");

    res.redirect(`/listings`);
}));

// DESTROY OPERATION (delete route)
router.delete("/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
}));


module.exports=router;