/* Tanımlamalar  */
const axios = require("axios");
const express = require("express")
const mongoose = require('mongoose')
const https = require('https')
const app = express()
const ejs = require('ejs')
const bodyParser = require("body-parser");
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
let port = 3000;
app.use(bodyParser.json()).use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const dbURL = process.env.db;
mongoose
  .connect("mongodb+srv://anya:orhan2357@cluster0.1p07r.mongodb.net/anyadev?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    app.listen(port, () => {
      console.log("mongoDB Bağlantı kuruldu");
    });
  })
  .catch((err) => console.log(err));
app.use(cookieParser())
app.use(morgan('dev'))
app.use("/uploads", express.static("public/data"));
app.set('view engine','ejs')
let data1 = require('./config.json')
const config = {
  account: {
    discord: data1.id
  },
  api: {
    lanyardBase: "https://api.lanyard.rest"
  },
};
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/data");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".png");
  },
});
const upload = multer({ storage: storage });
app.post("/stats", upload.single("uploaded_file"), function (req, res) {
  console.log(req.file, req.body);
}); 

const User = require('./models/users.js')
const Animes = require('./models/animes.js')
const Blogs = require('./models/blogs.js')
/* Server Connections */
app.get('/',async function(req,res){
  const lanyard = await axios.get(
      `${config.api.lanyardBase}/v1/users/${config.account.discord}`
    );
res.render("home",{user:lanyard.data})
})

app.get('/admin/signin',async function(req,res){
  let userId = req.cookies.id

  if(userId != null){
  User.findById(userId).then((result)=>{
    let admin = result.admin
    if(admin == false){
    return  res.render(`${__dirname}/views/errors/admin-error.ejs`)
     }else{
      return res.render(`${__dirname}/views/admin/login.ejs`)
       }
    })
  }else{
    res.render(`${__dirname}/views/admin/signin.ejs`)
    }
})

app.post('/admin/signin',async function(req,res){
  var user = new User({
    username:req.body.isim,
    code:req.body.verificationcode,
    admin: false,
    password:req.body.pass,
  })
  user.save()

   .then((UserResult)=>{

   res.cookie('id', UserResult._id)

   res.redirect('/admin/signin')
  })
  })
app.get('/admin/login',async function(req,res){
  res.render(`${__dirname}/views/admin/login.ejs`)
})
app.post('/admin/login',async function(req,res){
  let isim = req.body.isim
  let pass = req.body.pass
  User.findOne({ username: isim ,password:pass}).then((result)=>{
    let admin = result.admin
    if(admin == true){
    res.cookie('id',result._id)
    let name = result.username
res.render(`${__dirname}/views/admin/dashboard.ejs`,{isim:name})
}
   if(admin == false){
    res.send('Site üzerinde admin yetkiniz bulunmuyor')
     }
})
})
app.get('/admin/anime-ekle',async function(req,res){
  let userId = req.cookies.id
  User.findById(userId).then((result)=>{
    let admin = result.admin
    if(admin == false){
      return res.render(`${__dirname}/views/errors/admin-errors.ejs`)
    }
    if(admin == true){
      return res.render(`${__dirname}/views/admin/anime-ekle.ejs`)
    }
  })
})

app.post('/admin/anime-ekle',upload.single("uploaded_file") ,async function(req,res){
 var anime = new Animes({
   title:req.body.title,
   description:req.body.description,
   link:req.body.link,
   photo:req.file.filename
})
 anime.save().then((result)=>{
   res.redirect('/admin/anime-ekle')
})
})

app.get('/anime',(req,res)=>{
  let id = req.params.id
  Animes.find(id).sort().then((result)=>{
  res.render('anime',{animes:result})
})
})

app.get('/admin/blogs-ekle',async function(req,res){
    let userId = req.cookies.id
    User.findById(userId).then((result)=>{
      let admin = result.admin
      if(admin == false){
        res.render(`${__dirname}/views/errors/admin-errors.js`)
      }
      if(admin == true){
        res.render(`${__dirname}/views/admin/blogs-ekle.ejs`)
      }
 })
 })

app.post('/admin/blogs-ekle',upload.single("uploaded_file"),async function(req,res){
  var blog = new Blogs({
    title:req.body.title,
    photo:req.file.filename,
    description:req.body.description
}) 
  blog.save().then((resend)=>{
    res.redirect('/admin/blogs-ekle')              
})
})

app.get('/blogs',async function(req,res){
  let id = req.params.id
  Blogs.find(id).sort().then((result)=>{
    res.render('blogs',{blogs:result})
})
})

app.get('/logout',async function(req,res){
  res.redirect('/')
})