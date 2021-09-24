var express = require('express');
const helpers = require('../userhelper/helpers');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
     res.redirect('/home')
  }else{
  
    
    res.render('index',{message:req.session.userLoginErr});
    
 
  }
});

router.get('/signup',(req,res)=>{
  if(req.session.user){
    res.redirect("/home")
  }else{
    // console.log(req.session.userSerr)
    res.render("signup",{errormsg:req.session.userSerr})
    
  }
})
router.get("/home",(req,res)=>{
  let user=req.session.user
  console.log(user)
  let cards=[
    {
      pic : "https://a-static.besthdwallpaper.com/dark-dice-wallpaper-800x600-34_17.jpg",
      title : "Personal Website using HTML, CSS, Bootstrap and javascript.",
      content : "This site contains all my personal details and works I've done.It also oncludes my acheivemnets and skill sets."  ,
    },
    {
      pic : "https://cdn.wallpapersafari.com/78/0/WgY0AM.png",
      title : "Design for online shopping platform, Lifestyle Store",
      content : "This is a simple design of an online shopping platform done using HTML,CSS and bootstrap. This was my first step towards familiarizing with these tools." , 
    },
    {
      pic : "https://themobilewallpaper.com/index.php/blog/image/800/600/Dark-Eyes-anime-movie-angry-girl-Ultra-HD-Mobile-Wallpaper-1622819514.jpg",
      title : "Personal Website using HTML, CSS, Bootstrap and javascript.",
      content : "My final year project was a wearable device for the elderly, which is capable of detecting the daily activities and also alerting the caretakers in case of an emergency. This was done using google Activity Recognition API." , 
    }
  
]
 if(req.session.user){
  res.render("home",{cards,user})
 }else{
   res.redirect('/')
 }
})

router.post('/login',(req,res)=>{
  helpers.doLogin(req.body).then((response)=>{
    console.log("haaaaaaaaaaaaaaai")
    console.log(response)
    if(response.status){
      
      req.session.user=response.user
      req.session.user.loggedIn=true
      
      res.redirect("/home" )
    }
    else {

        console.log("kerio??!!")
        req.session.userLoginErr = true
      
      res.redirect("/")
      
    }
  })
});

router.post("/userSignup",(req,res)=>{
  helpers.checkUser(req.body.email).then((response)=>{
    console.log(response.email)
    if(response.email===req.body.email){
      console.log(response.email+"qwiuytretretre")
      req.session.userSerr=true
      res.redirect("signup")
     
    }else if(response==0){
      console.log("heloo")
      helpers.addUsers(req.body).then((result)=>{
        
        req.session.user=req.body
        req.session.user.loggedIn=true
        res.redirect("/home")
      });
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.user=null;
  res.redirect('/');  
})

module.exports = router;
