const jwt = require("jsonwebtoken")

const generateToken = (res, userId) => {
  const token = jwt.sign({userId}, process.env.JWT_SECRET_KEY, { expiresIn : "30d"});

  //Set the JWT as an HTTP-ONLY Cookie 
  //so anytime we create an uswer we want to pass that cookie as an header

  res.cookie("jwt", token, {
    httpOnly : true,
    secure : process.env.NODE_ENV,
    sameSite : true,
    maxAge : 30*24*60*60*1000
  })

  return token 
}

module.exports = generateToken