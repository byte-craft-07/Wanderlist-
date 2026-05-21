const express=require("express");
const mongoose = require("mongoose");
const asyncWrape=require("../utils/asyncWrape.js");
 const {reviewSchema}=require("../schema.js");
 const ExpressError=require("../utils/ExpressError.js");
 const Listing = require("../models/listing");
 const Review = require("../models/reviews.js");
const router =express.Router({ mergeParams: true });



const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    
    }else{
      next();
    }
};
//reviews routes
     router.post("/",validateReview,asyncWrape(async(req,res,next)=>{
        let { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
          return next(new ExpressError(404,"Invalid listing id"));
        }
        const listing = await Listing.findById(id);
        if (!listing) {
          return next(new ExpressError(404,"Listing not found"));
        }
        if (!req.body.review) {
          throw new ExpressError(400,"send valid data for review");
        }
        const newReview = new Review(req.body.review);
        await newReview.save();
        listing.reviews.push(newReview._id);
        await listing.save();
        req.flash("success","Reviews created ");
        res.redirect(`/listings/${listing._id}`);
    
    
     }));
    
     //delete review route
   router.delete("/:reviewId",
      asyncWrape(async(req,res)=>{
        let {id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","reviews Deleted ");
        res.redirect(`/listings/${id}`);
      })
    );
    module.exports= router;
