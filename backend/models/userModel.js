const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

//static signup method
userSchema.statics.signup = async function (email, password) {
  //validation
  //checks if email and password are filled in
  if (!email || !password) {
    throw Error("Email and password are required");
  }
  //checks if email is valid using validator package
  if (!validator.isEmail(email)) {
    throw Error("Email is invalid");
  }
  //if password is strong enough using the validator
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  //if email already exists
  const user = await this.findOne({ email });
  if (user) {
    throw Error("User already exists");
  }
  //hash the password
  //generate salt
  const salt = await bcrypt.genSalt(12);
  //hash the password
  const hashedPassword = await bcrypt.hash(password, salt);
  //create a new user
  const userNew = await this.create({ email, password: hashedPassword });
  return userNew;
};

//static login method
userSchema.statics.login = async function (email, password) {
  //validation
  //checks if email and password are filled in
  if (!email || !password) {
    throw Error("Email and password are required");
  }
  //checks if email is valid using validator package
  if (!validator.isEmail(email)) {
    throw Error("Email is invalid");
  }
  //find the user
  const user = await this.findOne({ email });
  if (!user) {
    throw Error("User does not exist");
  }
  //compare the password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw Error("Password is incorrect");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
