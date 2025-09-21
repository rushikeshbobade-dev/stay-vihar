const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema }= require("./schema.js");
const Review=require("./models/review.js");

mongoose.connect('mongodb://127.0.0.1:27017/stayVihar').then(()=>{
    console.log("Connected to MongoDB");
}).catch(err=>{
    console.log("Error connecting to MongoDB", err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

app.get("/",(req,res)=>{
    console.log("working");
    res.send("Click here to see all listings");
})


//client side validation using JOI

const validateListing=((req,res,next)=>{
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    }else{
        next();
    }
});

const validateReview=((req,res,next)=>{
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, msg);
    }else{
        next();
    }
});


//INDEX ROUTE

app.get("/listings",wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    // console.log("Fetched listings:", listings);
    res.render("listings/index.ejs",{allListings});
})
);  

//New route

app.get("/listings/new",(req,res)=>{  //New Route(create route)  we have declared it before read because it was getting /new as id so avoid this conflict we have added that
    res.render("listings/new.ejs");
});

//SHOW ROUTE (Read Operation)

app.get("/listings/:id",wrapAsync(async (req, res) => {
    
    // let {id}=req.params;
    // const listing=await Listing.findById(id);  OR WE CAN DO AS FOLLOW ALSO
    const listing = await Listing.findById(req.params.id).populate("reviews");
        res.render("listings/show.ejs", { listing });
    })
);


//CREATE OPERATION(new and create route)

app.post("/listings",validateListing,wrapAsync(async(req,res,next)=>{
    //let {title, description, image, price, location, country} = req.body;
    //const listing=req.body.listing; // Assuming the form data is sent as an object with a key 'listing'      OR DO AS FOLLOWS
    
// if(!req.body.listing){
//     throw new ExpressError(400,"Invalid Listing Data");
// }  //more optimal approach that it is below 

 // Validate the incoming data against the schema
    //const { error } = listingSchema.validate(req.body);
    //console.log(error);
    
    // if (error) {
    //     // If validation fails, throw an error with details
    //     //const msg = error.details.map(el => el.message).join(',');
    //     throw new ExpressError(400, error.message);
    // }


const newListing=new Listing(req.body.listing); // Create a new Listing instance with the data from the form
await newListing.save();
res.redirect("/listings");
        
        
        //    .then(() => {
            //     //    console.log("New listing created:", newListing);
            //        res.redirect("/listings");
            //    })
            //    .catch(err => {
//        console.error("Error creating listing:", err);
//        res.status(500).send("Internal Server Error");
//    });

})
);


//UPDATE OPERATION(edit and update route)

app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
    // let { id } = req.params; // Destructure id from req.params
    // const listing= await Listing.findById(id); // Find the listing by id   OR DO AS FOLLOWS
    
    const listing= await Listing.findById(req.params.id);
    res.render("listings/edit.ejs",{listing});
    
})
);


app.put("/listings/:id", wrapAsync(async (req, res) => {

if(!req.body.listing){
    throw new ExpressError(400,"Invalid Listing Data");
}

    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings`);
})
);


//DESTROY OPERATION (delete route)

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})
);


//Reviews (Post Route)

app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`)
    })
);


//Delete Review Route

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));









app.all("/*any",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.render("listings/error.ejs",{error:err});
    // console.error("Error occurred:", err);
   // res.status(statusCode).send(message);
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});


// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"Test Listing",
//         description:"This is a test listing",
//         image:"",
//         price:100,
//         location:"Test Location",
//         country:"Test Country"
//     });

//     await sampleListing.save();
//     console.log("Listing created:", sampleListing);
// });