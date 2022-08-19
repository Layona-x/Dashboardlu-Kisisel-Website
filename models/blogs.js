const mongoose = require('mongoose')
const Schema = mongoose.Schema

const blogSchema = new Schema({
  title:{
    type:String,
    require:true,
  },
  description:{
    type:String,
    require:true,
  },
  photo:{
    type:String,
    require:true,
  }
},{timestamp:true})

const blog = mongoose.model("Blogs",blogSchema)
module.exports = blog