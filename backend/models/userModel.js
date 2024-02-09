//Model for user, how a user shoukd look like

const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username : {
    type : String,
    required : true,
  },
  password : {
    type : String,
    required : true,
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  isAdmin : {
    type : Boolean,
    required : true,
    default : false
  }
}, {timestamps : true})

//Now lets create a model based on this schema

const User = mongoose.model("User", userSchema)

module.exports = User;