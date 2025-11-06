const router = require('express').Router();
const {
  register,
  login,
  logout,
  updateUser,
} = require('../controllers/auth.controller');
const auth = require('../middlewares/auth');
const uploadImg = require('../middlewares/uploadImage');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.put(
  '/update-profile/:id',
  auth,
  uploadImg.single('profilePic'),
  updateUser
);

module.exports = router;
