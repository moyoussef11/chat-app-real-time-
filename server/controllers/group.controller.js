const asyncHandler = require('express-async-handler');
const { uploadImgCloudinary } = require('../utils/cloudinary');
const fs = require('fs');
const Group = require('../models/Group');
const GroupMessage = require('../models/GroupMessage');
const { io } = require('../utils/socket');

const createGroup = asyncHandler(async (req, res) => {
  let { name, description, members } = req.body;
  let imgUrl;
  //   console.log(req.user.id);
  if (req.file) {
    const result = await uploadImgCloudinary(req.file.path);
    imgUrl = result.secure_url;
  }
  if (typeof members === 'string') {
    members = JSON.parse(members);
  }

  const group = await Group.create({
    name,
    description,
    owner: req.user.id,
    members: [req.user.id, ...members],
    avatar: imgUrl,
  });

  res
    .status(201)
    .json({ status: 'success', msg: 'created Group successfully', group });
  if (req.file) fs.unlinkSync(req.file.path);
});

const getGroupsUser = asyncHandler(async (req, res) => {
  const groups = await Group.find({ members: req.user.id }).populate('members');
  res
    .status(200)
    .json({ status: 'success', msg: 'get Groups successfully', groups });
});

const sendMessageToGroup = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const groupId = req.params.id;
  const group = await Group.findById(groupId);

  if (!group.members.includes(req.user.id)) {
    return res.status(403).json({ message: 'Not in this group' });
  }

  const message = await GroupMessage.create({
    group: req.params.id,
    sender: req.user.id,
    text,
  });
  io.to(groupId).emit('newMessageToGroup', message);

  res.status(201).json({
    status: 'success',
    msg: 'send message Group successfully',
    message,
  });
});

const getGroupMessages = asyncHandler(async (req, res) => {
  const messages = await GroupMessage.find({ group: req.params.id }).populate(
    'sender'
  );
  res
    .status(200)
    .json({ status: 'success', msg: 'get Groups successfully', messages });
});

module.exports = {
  createGroup,
  getGroupsUser,
  sendMessageToGroup,
  getGroupMessages,
};
