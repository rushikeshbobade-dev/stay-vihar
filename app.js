const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session=require("express-session");
const flash=require('connect-flash');

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

mongoose.connect('mongodb://127.0.0.1:27017/stayVihar').then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log("Error connecting to MongoDB", err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

const sessionOptions={  
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    }
}

app.get("/", (req, res) => {
    console.log("working");
    res.redirect("/listings");
    // res.send("Click here to see all listings");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


app.all("/*any", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.render("listings/error.ejs", { error: err });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});