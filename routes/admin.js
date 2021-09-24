var express = require('express');
var router = express.Router();
const helpers = require('../userhelper/helpers');

const adminName="alpha@gmail.com"
const adminpassword="alpha"

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.session.admin){
    res.redirect("/admin/adminhome")
  }else{
    res.render('adminlogin');
  }
});

const p=router.get('/adminhome',(req,res)=>{
  if(req.session.admin){
    helpers.getUsers().then((people)=>{
      res.render("adminhome",{people});
     });
  }else{
    res.redirect("/admin")
  }
    
  
})
router.get('/adu',(req,res)=>{
  res.render("adminadduser",{errormsg:req.session.useraderr})
})

router.get('/GoToadduser',(req,res)=>{
  res.render("adminadduser")
})

router.post('/adminhome',(req,res,next)=>{
   helpers.checkUser(req.body.email).then((response)=>{
    console.log(response.email)
    if(response.email===req.body.email){
      req.session.useraderr=true
      res.redirect("/admin/adu")
     
    }else if(response==0){
      req.session.useraderr=false

      helpers.addUsers(req.body).then((result)=>{
        res.render("adminadduser")
      });
    }
  })
  
})
router.get('/delete/:id',(req,res)=>{
  let uid=req.params.id
  console.log(uid)
  helpers.deleteUser(uid).then((response)=>{
    res.redirect("/admin/adminhome")
  })
})

router.get('/edit/:id',async(req,res)=>{
  let details=await helpers.getUserDetails(req.params.id)
   console.log(details)
   res.render('adminedituser',{details})
  })

router.post('/updateuser/:id',(req,res)=>{
  helpers.updateUsers(req.params.id,req.body).then(()=>{
    res.redirect('/admin/adminhome')
  })
})  
router.post('/adlogin',(req,res)=>{
  if((req.body.email==adminName)&&(req.body.password==adminpassword)){
    req.session.admin=req.body
    req.session.admin.loggedIn=true;
    res.redirect('/admin/adminhome')
  }else{
    res.render('adminlogin',{message:"Invalid id and password"})
  }
})
router.get('/signout',(req,res)=>{
  console.log("signout!!")
  req.session.admin=null;

  res.redirect('/admin')
})
module.exports = router;
