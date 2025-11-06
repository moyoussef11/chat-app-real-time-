const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { uploadImgCloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const Message = require('../models/Message');
const { getReceiverSocketId, io } = require('../utils/socket');

const getUsersSideBar = asyncHandler(async (req, res) => {
  const userLogged = req.user.id;
  const users = await User.find({ _id: { $ne: userLogged } }).select(
    '-password'
  );

  res.status(200).json({
    status: 'success',
    msg: 'get users successfully',
    users,
  });
});

const sendMessage = asyncHandler(async (req, res) => {
  const { id: userSenderId } = req.user;
  const { id: userReceiverId } = req.params;
  const { text } = req.body;
  const receiverUser = await User.findById(userReceiverId);
  if (!receiverUser) {
    return res.status(404).json({ status: 'Error', msg: 'User not found' });
  }
  let imgUrl = '';
  if (req.file) {
    const result = await uploadImgCloudinary(req.file.path);
    imgUrl = result.secure_url;
  }
  const message = await Message.create({
    senderId: userSenderId,
    receiverId: userReceiverId,
    text,
    image: imgUrl,
  });

  const receiverSocketId = getReceiverSocketId(userReceiverId);
  if (receiverSocketId) {
    io.to(receiverSocketId).emit('newMessage', message);
  }

  res.status(200).json({
    status: 'success',
    msg: 'message send successfully',
    message,
  });
  if (req.file) return fs.unlinkSync(req.file.path);
});

const getMessages = asyncHandler(async (req, res) => {
  const { id: userSenderId } = req.user;
  const { id: selectedUser } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: userSenderId, receiverId: selectedUser },
      { senderId: selectedUser, receiverId: userSenderId },
    ],
  }).populate('senderId receiverId');

  res.status(200).json({
    status: 'success',
    msg: 'Get Messages successfully',
    messages,
  });
});

module.exports = { getUsersSideBar, sendMessage, getMessages };
