const express=require("express");
const mongoose = require("mongoose");
 const asyncWrape=require("../utils/asyncWrape.js");
 const {listingSchema}=require("../schema.js");
 const ExpressError=require("../utils/ExpressError.js");
 const Listing = require("../models/listing");
const router =express.Router();


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    
    }else{
      next();
    }
};


router.get("/",asyncWrape(async(req,res)=>{
   const alllistings= await Listing.find();
        res.render("listings/home",{alllistings});
    
    })
  );
// create route
    router.get("/create",(req,res)=>{
        if(!req.isAuthenticated()){
          req.flash("error","You must be logged in to create listing");
          return res.redirect("/listings");
        }
        res.render("listings/index.ejs");
     });
// show route
    router.get("/:id",asyncWrape(async(req,res,next)=>{
        let {id}=req.params;
        if (!mongoose.isValidObjectId(id)) {
          return next(new ExpressError(404,"Invalid listing id"));
        }
        const listing =await Listing.findById(id).populate("reviews");
        if (!listing) {
          req.flash("error","This listing not exist");
          // return next(new ExpressError(404,"Listing not found"));
          res.redirect("/listings");
        }
        res.render("listings/show",{ listing });
    }));
    router.post("/",asyncWrape(async(req,res)=>{
              if(!req.body.listing){
                throw new ExpressError(404,"send valid data for listing");
              };
             const  newlisting =Listing(req.body.listing);
           await newlisting.save();
           req.flash("success","New listing has created");
            res.redirect("/listings"); 
         }));
         //Edit route
        router.get("/:id/edit", asyncWrape(async (req, res,next) => {
          const { id } = req.params;
          if (!mongoose.isValidObjectId(id)) {
            return next(new ExpressError(404,"Invalid listing id"));
          }
          const listing = await Listing.findById(id);
          if (!listing) {
            return next(new ExpressError(404,"Listing not found"));
          }
        
          res.render("listings/edit.ejs", { listing });
         }));
    
         ///update
         router.put("/:id",asyncWrape(async(req,res,next)=>{
           if(!req.body.listing){
                throw new ExpressError(404,"send valid data for listing");
              };
          let {id}=req.params;
          await Listing.findByIdAndUpdate(id,{...req.body.listing});
          req.flash("success","This listing has updated ");
          res.redirect("/listings");
         }));
    
         //delete route
    
         router.delete("/:id",asyncWrape(async(req,res)=>{
             let{id}=req.params;
          let deletedListing = await Listing.findByIdAndDelete(id);
          console.log(deletedListing);
          req.flash("success","This listing has deleted ");
          res.redirect("/listings");
         }));
    
         
    
    module.exports= router;
