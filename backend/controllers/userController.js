const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//create token
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    //create token
    const token = createToken(user._id);
    res.status(200).json({ email, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// signup
const signupUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const newUser = await User.signup(email, password);
    //create token
    const token = createToken(newUser._id);
    res.status(200).json({ email, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
};
