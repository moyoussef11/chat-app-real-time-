const asyncHandler = require('express-async-handler');
const { validateRegister, validateLogin } = require('../utils/validateSchema');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { uploadImgCloudinary } = require('../utils/cloudinary');
const fs = require('fs');

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(400).json({ status: 'Error', msg: error.message });
  }
  const user = await User.findOne({ email });
  if (user) {
    return res
      .status(400)
      .json({ status: 'Error', msg: 'Email already exists' });
  }
  const salt = await bcrypt.genSaltSync(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  await User.create({
    name,
    email,
    password: hashedPassword,
  });
  res.status(201).json({ status: 'success', msg: 'created user successfully' });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateLogin(req.body);
  if (error) {
    return res.status(400).json({ status: 'Error', msg: error.message });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ status: 'Error', msg: 'User not found' });
  }
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    return res.status(400).json({ status: 'Error', msg: 'Invalid Password' });
  }
  const token = await jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '30d' }
  );

  res.cookie('token', token, {
    // httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  res
    .status(200)
    .json({ status: 'success', msg: 'login user successfully', user, token });
});

const logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ status: 'success', msg: 'Logged out successfully' });
};

const updateUser = asyncHandler(async (req, res) => {
  // const { name } = req.body;
  const { id } = req.params;
  const loggedUser = req.user.id;
  if (loggedUser !== id.toString()) {
    return res
      .status(403)
      .json({ status: 'Error', msg: 'not allowed only user itself' });
  }
  
  if (!req.file) {
    return res
      .status(400)
      .json({ status: 'Error', msg: 'profile pic is required' });
  }
  const result = await uploadImgCloudinary(req.file.path);
  const user = await User.findByIdAndUpdate(
    id,
    {
      profilePic: result.secure_url,
    },
    { new: true }
  ).select('-password');

  res
    .status(200)
    .json({ status: 'success', msg: 'updated user successfully', user });
  fs.unlinkSync(req.file.path);
});

module.exports = { register, login, logout, updateUser };
