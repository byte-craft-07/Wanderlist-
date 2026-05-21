const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const Review = require("./models/reviews.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const methodOverride = require("method-override");
engine = require('ejs-mate');
const ExpressError=require("./utils/ExpressError.js");
const asyncWrape=require("./utils/asyncWrape.js");
const listingsRouter=require("./routes/listing.js");
const reviewsRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlist";
const path=require("path");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


app.set("views",path.join(__dirname,"views"));//require=ing for ejs1
app.set("view engine","ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', engine);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
  secret: process.env.SESSION_SECRET || "dev-session-secret",
  resave:false,
   saveUninitialized:true,
   cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly:true,
   },
} ;

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

main()
  .then(() => {
    console.log("Connected to db");
  })
  .catch((err) => {
    console.log(err);
  });
  //build connections with mongo
  async function main() {
  await mongoose.connect(MONGO_URL);
}


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
      let errMsg=error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    
    }else{
      next();
    }
};

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  next();
});

// app.get("/demouser",async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta - student",
//   });
//   let registeredUser= await User.register(fakeUser,"hello world");
//   res.send(registeredUser);
// });

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter)





app.get("/", (req, res) => {
  try{
      res.render("listings/front.ejs");
  }catch(err){
    next(err);
  }
  
});

app.get("/create", (req, res) => {
  res.redirect("/listings/create");
});
// index route
// app.get("/listings",asyncWrape(async(req,res)=>{
//    const alllistings= await Listing.find();
//         res.render("listings/home",{alllistings});
    
//     })
//   );
// // show route
//     app.get("/listings/:id",asyncWrape(async(req,res,next)=>{
//         let {id}=req.params;
//         if (!mongoose.isValidObjectId(id)) {
//           return next(new ExpressError(404,"Invalid listing id"));
//         }
//         const listing =await Listing.findById(id).populate("reviews");
//         if (!listing) {
//           return next(new ExpressError(404,"Listing not found"));
//         }
//         res.render("listings/show",{ listing });
//     }));

      
//      app.post("/listings",asyncWrape(async(req,res)=>{
//           if(!req.body.listing){
//             throw new ExpressError(404,"send valid data for listing");
//           };
//          const  newlisting =Listing(req.body.listing);
//        await newlisting.save();
//         res.redirect("/listings"); 
//      }));
//      //Edit route
//      app.get("/listings/:id/edit",validateListing, asyncWrape(async (req, res,next) => {
//       const { id } = req.params;
//       if (!mongoose.isValidObjectId(id)) {
//         return next(new ExpressError(404,"Invalid listing id"));
//       }
//       const listing = await Listing.findById(id);
//       if (!listing) {
//         return next(new ExpressError(404,"Listing not found"));
//       }
//       res.render("listings/edit.ejs", { listing });
//      }));

//      ///update
//      app.put("/listings/:id",asyncWrape(async(req,res,next)=>{
//        if(!req.body.listing){
//             throw new ExpressError(404,"send valid data for listing");
//           };
//       let {id}=req.params;
//       await Listing.findByIdAndUpdate(id,{...req.body.listing});
//       res.redirect("/listings");
//      }));

//      //delete route

//      app.delete("/listings/:id",asyncWrape(async(req,res)=>{
//          let{id}=req.params;
//       let deletedListing = await Listing.findByIdAndDelete(id);
//       console.log(deletedListing);
//       res.redirect("/listings");
//      }));

//      //reviews routes
//  app.post("/listings/:id/reviews",validateReview,(async(req,res,next)=>{
//     let { id } = req.params;
//     if (!mongoose.isValidObjectId(id)) {
//       return next(new ExpressError(404,"Invalid listing id"));
//     }
//     const listing = await Listing.findById(id);
//     if (!listing) {
//       return next(new ExpressError(404,"Listing not found"));
//     }
//     if (!req.body.review) {
//       throw new ExpressError(400,"send valid data for review");
//     }
//     const newReview = new Review(req.body.review);
//     await newReview.save();
//     listing.reviews.push(newReview._id);
//     await listing.save();
//     res.redirect(`/listings/${listing._id}`);


//  }));

//  //delete review route
// app.delete("/listings/:id/reviews/:reviewId",
//   asyncWrape(async(req,res)=>{
//     let {id,reviewId}=req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listings/${id}`);
//   })
// );

//***************** */


// app.get("/listings", async (req, res) => {
//   const samplelisting = new Listing({
//     title: "My favorite house",
//     description: "so beautiful",
//     price: 2000,
//     image: {
//       filename: "listingimage",
//       url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9FjQAmUwLA0YQcOi2bR2ksjq8oKvH9uHu9g&s",
//     },
//     location: "new delhi",
//     country: "india",
//   });

//   await samplelisting.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });
app.all("/{*splat}",(req,res,next)=>{
  next(new ExpressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
  console.log("Error type:", err.name);
   next(err);
   
});
app.use((err,req,res,next)=>{
   let {status=500,message="Some occure error"}=err;
   res.status(status).send(message);
 });
app.listen(8080, () => {
  console.log("connection successful");
});
