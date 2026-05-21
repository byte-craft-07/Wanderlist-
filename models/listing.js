const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./reviews.js")

const DEFAULT_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9FjQAmUwLA0YQcOi2bR2ksjq8oKvH9uHu9g&s";

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default: DEFAULT_IMAGE,
      set: (v) => (v === "" ? DEFAULT_IMAGE : v),
    },
  },

  price: {
    type: Number,
    required: true,
  },

  location: {
    type: String,
  },

  country: {
    type: String,
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref: "Reviews",
    }
  ]
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
   await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
})
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
