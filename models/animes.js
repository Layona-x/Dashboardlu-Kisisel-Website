const mongoose = require('mongoose')
const Schema = mongoose.Schema

const animeSchema = new Schema({
  photo:{
    type:String,
    require:true,
  },
  title:{
    type:String,
    require:true,
  },
  description:{
    type:String,
    require:true,
  },
  link:{
    type:String,
    require:true,
  }
},{timestamp:true})

const anime = mongoose.model("Anime",animeSchema)
module.exports = anime;