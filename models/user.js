const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose").default;

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
});

// Adds username, hash, salt, and authentication helpers.
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

module.exports = User;
