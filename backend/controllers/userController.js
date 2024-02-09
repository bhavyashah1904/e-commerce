const asyncHandler = require('../middlewares/asyncHandler');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/createToken');

const createUser = asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    throw new Error('Please fill all the fields');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(password, salt);

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400).send('User with this username already exists!');
  }
  const newUser = new User({ username, password: hashedPass, email });

  try {
    await newUser.save();
    //generate Token
    generateToken(res, newUser._id);

    res
      .status(201)
      .send(
        `User with username : ${newUser.username} and id : ${newUser._id} created`
      );
  } catch (error) {
    res.status(400);
    throw new Error('Invalid User Details');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // if(!email || !password){
  //   throw new Error("Enter all fields")
  // }

  const userExists = await User.findOne({ email });
  if (userExists) {
    const isPasswordValid = await bcrypt.compare(password, userExists.password);
    if (isPasswordValid) {
      generateToken(res, userExists._id);
      res
        .status(201)
        .send(`User with ${userExists.username} username logged in!`);
      return;
    } else {
      throw new Error('Password not valid');
    }
  } else {
    throw new Error(`User with ${email} not found`);
  }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).send('User logged out successfully!');
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const email = req.body.email
    const userExists = await User.findOne({email})
    if(userExists){
      throw new Error("Email already taken!")
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPass = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPass;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found!');
  }
});

// const deleteUserById = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.params.id)
//   await User.deleteOne({_id : user._id});
  // if(user){
  //   if(user.isAdmin){
  //     res.status(400)
  //     throw new Error("Cannot delete admin")
  //   }
  //   await user.remove();
  //   res.send("User Deleted successfully")
  // }else{
  //   res.status(404)
  //   throw new Error("User not found")
  // }
// })

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Cannot delete admin user");
    }

    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found.");
  }
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
};
