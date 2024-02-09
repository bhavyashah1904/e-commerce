const express = require('express');
const router = express.Router();
const {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} = require('../controllers/userController');
const {
  authenticate,
  authorizeAdmin,
} = require('../middlewares/authMiddleware');

router
  .route('/')
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);
router.route('/auth').post(loginUser);
router.post('/logout', logoutCurrentUser);
router
  .route('/profile')
  .get(authenticate, getUserProfile)
  .put(authenticate, updateUserProfile);

// router.route('/:id').delete(authenticate, authorizeAdmin, deleteUserById);
router
  .route("/:id")
  .delete(authenticate, authorizeAdmin, deleteUserById)
  .get(authenticate, authorizeAdmin, getUserById)
  .put(authenticate, authorizeAdmin, updateUserById);
  
  module.exports = router;