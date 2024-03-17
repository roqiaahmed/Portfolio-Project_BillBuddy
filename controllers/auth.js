const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res
      .status(400)
      .json({ msg: "Please provide name, email and password" });
  }
  try {
    const user = await User.create({ email, password, name });
    res.status(201).json({ msg: "User created" });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please provide email and password" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "unouth" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(404).json({ msg: "password not match" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
      expiresIn: "7d",
    });
    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.status(200).json({ user });
};

const updateUser = async (req, res) => {
  const { name, email, password } = req.body;
  if (name === "" || email === "" || password === "") {
    return res
      .status(400)
      .json({ msg: "Please provide name, email and password" });
  }
  const user = await User.findByIdAndUpdate(req.userId, req.body, {
    new: true,
  });
  res.status(200).json({ user });
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.userId);
  res.status(200).json({ msg: "User deleted" });
};

module.exports = { register, login, getUser, updateUser, deleteUser };
