//For authentication and authorization
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
require('dotenv').config();
//This is a middleware
const authenticate = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  //Verify the token
  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      //get everything except the password
      req.user = await User.findById(decodedToken.userId).select('-password');
      next();
    } catch (error) {
      res.status(401);
      console.log(error.message);
      throw new Error('Not authenticated, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authenticated, no token');
  }
});

//Check if user is Admin

const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send('Not authorized as an admin');
  }
};

module.exports = { authenticate, authorizeAdmin };
