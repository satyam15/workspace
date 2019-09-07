var express=require("express"); 
var bodyParser=require("body-parser"); 
const path=require('path')
const fs=require('fs')
const user=require('./src/models/users.js')
const sendmail=require('./utilities/accounte.js')

// const multer=require('multer')
// const ejs=require('ejs')
// const req=require('request')
// var storage = multer.diskStorage({
// 	destination: function (req, file, cb) {
// 	  cb(null, './images')
// 	},
// 	filename: function (req, file, cb) {
// 		//console.log(file)
// 	  cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))
// 	}
//   })
// const upload=multer({
// 	storage: storage
// })
var app=express() 
const dirPath=path.join(__dirname,'/src')
app.use(bodyParser.json()); 
app.use(express.static(dirPath)); 
app.use(bodyParser.urlencoded({ 
	extended: true
})); 
// app.post('/upload',upload.single('upload'),(req,res)=>{
// 	const file=req.file
// 	 console.log('file uploaded')
// 	 res.send('uploaded successfully')
// })
app.post('/sign_up', (req,res)=>{
   // const usq=user.find({'uemail':req.body.email})
    //console.log(usq);
    //return res.send('user already exist')
    const uss=new user({
        uname: req.body.name,
            uteam: 0,
            uemail: req.body.email,
            umob: req.body.phone,
            upasswd: req.body.password,
             uorg: '#',
             taskcom: 0,
             tasktodo: '.',
             utype: req.body.utype
    })
      
     uss.save().then(()=>{
        sendmail.sendmail(uss.uemail,uss.uname)
       return res.redirect('login.html')
    }).catch((error)=>{
          return res.send('invalid user detail or internet connection is not there')
    })

})
app.post('/login',async(req,res)=>{
    const usr=user.find({'uemail':req.body.email,'upasswd':req.body.password})
    if(!usr)
    res.send('invalid login credentials')
    else
    return res.redirect('home.html')
})
app.get('/',function(req,res){ 
    res.set({ 
        'Access-control-Allow-Origin': '*'
        }); 
    return res.redirect('signup.html'); 
    }).listen(3000)