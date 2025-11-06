const router = require('express').Router();
const {
  getUsersSideBar,
  sendMessage,
  getMessages,
} = require('../controllers/message.controller');
const auth = require('../middlewares/auth');
const uploadImg = require('../middlewares/uploadImage');

router.get('/users', auth, getUsersSideBar);
router.get('/:id', auth, getMessages);
router.post('/send-message/:id', auth, uploadImg.single('image'), sendMessage);

module.exports = router;
