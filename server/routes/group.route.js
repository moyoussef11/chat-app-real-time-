const router = require('express').Router();
const {
  createGroup,
  getGroupsUser,
  sendMessageToGroup,
  getGroupMessages,
} = require('../controllers/group.controller');
const auth = require('../middlewares/auth');
const uploadImg = require('../middlewares/uploadImage');

router.post('/', auth, uploadImg.single('avatar'), createGroup);
router.get('/', auth, getGroupsUser);
router.get('/:id/messages', auth, getGroupMessages);
router.post('/:id/send-message', auth, sendMessageToGroup);

module.exports = router;
