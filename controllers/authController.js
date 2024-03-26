const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError, BadRequestError } = require('../errors/index');

const register = async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    throw new BadRequestError('Please provide name, email and password');
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new BadRequestError('duplicate email');
  }
  await User.create({ email, password, name });
  res.status(StatusCodes.CREATED).json({ msg: 'User created' });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password');
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthenticatedError('Invalid Credentials');
  }
  const token = jwt.sign({ userId: user._id }, process.env.JWT_TOKEN, {
    expiresIn: '7d',
  });
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

const getUser = async (req, res) => {
  const user = await User.findById(req.userId).select('-password');
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (name === '' || email === '' || password === '') {
    throw new BadRequestError('Please provide name, email and password');
  }

  const user = await User.findByIdAndUpdate(req.userId, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(StatusCodes.OK).json({ user: { name: user.name } });
};

const deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.userId);
  res.status(StatusCodes.OK).json({ msg: 'User deleted' });
};

module.exports = { register, login, getUser, updateUser, deleteUser };
