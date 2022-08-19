const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  username:{
    type:String,
    require:true,
    unique:true,
  },
  password:{
    type:String,
    require:true,
    unique:true
  },
  code:{
    type:String,
    require:true,
    unique:true,
    },
  admin:{
    type:Boolean,
    require:true,
  }
},{ timestamp: true})

const user = mongoose.model("User",userSchema)
module.exports = user;