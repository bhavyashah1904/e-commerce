// Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
// Higher order function which takes in a function as an argument and returns another function that takes three arguments
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res,  next)).catch((error) => {
    res.status(500).json({ message : error.message});
  })
}

module.exports = asyncHandler;