var express=require("express"); 
var bodyParser=require("body-parser"); 
const path=require('path')
const fs=require('fs')
const user=require('./models/users.js')
const http=require('http')
const sendmail=require('./utilities/accounte.js')
const socketio=require('socket.io')
const open=require('open')
const Filter=require('bad-words')
const team=require('./models/team.js')
const hbs=require('hbs')
const { generateMessage, generateLocationMessage } = require('./utilities/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utilities/users')
const list_files=require('./utilities/fetchfile.js')
var tusr;
const multer=require('multer')
const ejs=require('ejs')
const req=require('request')
var flash = require('connect-flash');
var session = require('express-session')



var app=express() 
app.set('view engine','ejs');
const dirPath=path.join(__dirname,'../public')
app.use(bodyParser.json()); 
app.use(express.static(dirPath)); 
app.use(bodyParser.urlencoded({ 
	extended: true
})); 

    //app.use(express.cookieParser());
    //app.use(express.session({ cookie: { maxAge: 60000 }}));
    app.use(flash());

const server = http.createServer(app)
const io = socketio(server)


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var str=req.session.obj.uteam.toString()
        var str2=req.session.obj.userId.toString()
        str='/fileSystem/'+str;
        var pt=path.join(__dirname,str)
      cb(null,pt)
    },
    filename: function (req, file, cb) {
        var str=req.session.obj.uteam.toString()
        var str2=req.session.obj.userId.toString()
      cb(null, str + '-' + str2+'-'+Date.now()+path.extname(file.originalname))
    }
  })
   
  var upload = multer({ storage: storage })

  //Mani code

  app.use(require("express-session")
({
secret:"This is workspace for you",
resave:false,
saveUninitialized:false

}
));

app.get('/logout',(req,res)=>{
    res.redirect('login.html');
})

app.post('/uploadfile',upload.single('uploads'),(req,res)=>{
	const file=req.file
	 console.log('file uploaded')
	 res.send('uploaded successfully')
})
app.post('/sign_up', (req,res)=>{      //signup code server side
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
        sendmail.gmailsender(uss.uemail,uss.uname)
       return res.redirect('login.html')
    }).catch((error)=>{
          return res.send('invalid user detail or internet connection is not there')
    })

})
app.post('/loginreq',(req,res)=>{   //login code
    
      
    user.findOne({'uemail':req.body.email,'upasswd':req.body.password}).exec(function (err, person) {
        
        
         if (person==null) 
         {
            console.log(err)
        }
         else
         {
             req.session.obj =person
             console.log(req.session.obj)
            
  
         
         return res.render('home',{username:req.session.obj.uname})
 
         }  
     });
     //console.log(usr.bodyParser.uname);
    // console.log(ussr)
   
     
    
 })
 
app.get('/chat',(req,res)=>{    //chat handle
    
res.redirect('index.html')

console.log('reached here')

console.log('reached here')

console.log('reached here')
io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    

    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})




})







// creating a team

app.post('/create_folder',async(req,res)=>{    // creating file system of team


    // team.findOne({'tname':req.body.teamname,'tleader':req.body.leaderid}).exec(function(err,teamm){
               
               
    //     var tid=teamm.teamId;
        //var dir=path.join(__dirname,`/fileSystem/${tid}/`)
     //    fs.mkdirSync(dir).exec(function(error,re){
     //        if(error)
     //        console.log('some error occured')
     //        else
     //        console.log('directory created successfully')
     //    });
     //const dir=path.join(__dirname,'..')
     fs.mkdirSync(`./fileSystem/${req.body.teamId}/${req.body.fname}`, {recursive: true}, err => {
         console.log('some error occured')
     })
         // console.log(teamm);
         // teamm.teamember.push(77)
         // console.log(teamm);
         // teamm.save()
         return res.redirect('home.html')
         
    // })

})

app.get('/listfiles',(req,res)=>{ //listing all files uploaded
      
        var vr=new list_files('./fileSystem')
        console.log(vr.files2);
        console.log(vr.subdir2);
       return res.render('filesys',{obj:vr})
  
})


// app.get('/',function(req,res){ 
//     res.set({ 
//         'Access-control-Allow-Origin': '*'
//         }); 
//     return res.redirect('signup.html'); 
//     }).listen(3000)


//Mani's Code

app.post('/create_team',(req,res)=>
{
    
    if(req.session.obj.uteam!=0)
    {
        console.log("TEam already created")
        return res.render('home')

    }
    const tm=new team({

        tname: req.body.teamname,
        torg: req.body.organisationname,
        orgid: req.body.organisationid,
       
      
    })

        tm.save().then(()=>{
            
          
                          
                team.findOne({'tname':req.body.teamname}).exec(function (err,teem) {
                   console.log(req.session.obj.userId)
                   teem.tleader=req.session.obj.userId
                   teem.teamember.push(req.session.obj.userId)
                   console.log(teem);
                    teem.save();
                    req.session.obj.uteam=teem.teamId
                    user.findOne({'userId':req.session.obj.userId}).exec(function (err,usr) {
                
                       usr.uteam=teem.teamId
                         usr.save();
                          
                     })

               var tid=teem.teamId;
            fs.mkdirSync(`./fileSystem/${tid}`, {recursive: true}, err => {
                console.log('some error occured')
            
                })
                
            
            
            return res.render('request');
        }).catch((error)=>{
              return res.send('invalid user detail or internet connection is not there');
        })
   
    })
});

app.get('/CreateTeamPage',function(req,res)
{
    res.render('CreateTeam')
})
// This is handle requests
app.post('/request',(req,res)=>
{

    user.findOne({'userId':req.body.userid}).exec(function (err,usr) {
             
        usr.ureq.push(req.session.obj.userId)
        console.log(usr)  
        usr.save() 
                })
    return res.render('home')
});
   
//This is a temperary code      
app.get('/notifications',(req,res)=>
{

var request=req.session.obj.ureq[0];
if(request)
{
user.findOne({'userId':request}).exec(function (err,usr) {
             
    
    return res.render('notifications',{req:usr.uname})
            })
        }
        else
        {
            req.flash('success_msg', 'You have no new request!!');
           return res.render('home',{username:req.session.obj.uname}); 
        }

});

//This is submit button
app.post('/accept',(req,res)=>
{
    req.session.obj.ureq;
    console.log(req.session.obj)
    user.findOne({'userId':req.session.obj.ureq[0]}).exec(function (err,usr) {
             
        team.findOne({'teamId':usr.uteam}).exec(function (err,teem) {
             
            teem.teamember.push(req.session.obj.userId)
            console.log(teem)
            teem.save()
            user.findOne({'userId':req.session.obj.userId}).exec(function (err,usr) {
             usr.uteam=teem.teamId
             usr.ureq.pop()
             usr.save()
    
                
            })
        })
        
                })
          res.render('home',{username:req.session.obj.uname})   
})
//This is decine button
app.post('/decline',(req,res)=>
{
    user.findOne({'userId':req.session.obj.userId}).exec(function (err,usr) {
             
    usr.ureq.pop()
    usr.save()
    res.render('home')
                })


   
})
app.get('/login',(req,res)=>{
    return res.redirect('login.html')
})

//This is to show pages
app.get('/homepage',function(req,res)
{
    res.render('home',{username:req.session.obj.uname})
})

app.get('/requestpage',function(req,res)
{
    res.render('request')
})




const port=3000
server.listen(port, () => {
    open( 'http://127.0.0.1:3000/signup.html', function (err) {
        if ( err ) throw err;    
      });
});


// app.get('/',function(req,res){ 
//     res.set({ 
//         'Access-control-Allow-Origin': '*'
//         }); 
//     return res.render('login'); 
//     }).listen(3000)
