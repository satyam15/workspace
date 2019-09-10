var express=require("express"); 

var bodyParser=require("body-parser"); 
const path=require('path')
const ejs=require('ejs')
const fs=require('fs')
const user=require('./src/models/users.js')
const team=require('./src/models/team.js')
var us;
const sendmail=require('./utilities/accounte.js')
var ussr;
var app=express() 
app.set('view engine','ejs');
const dirPath=path.join(__dirname,'/src')
app.use(bodyParser.json()); 
app.use(express.static(dirPath)); 

app.use(bodyParser.urlencoded({ 
	extended: true
})); 

//Here is session code

app.use(require("express-session")
({
secret:"This is workspace for you",
resave:false,
saveUninitialized:false

}
));


app.post('/sign_up', (req,res)=>{
   
    const uss=new user({
        uname: req.body.name,
            uteam: 0,
            uemail: req.body.email,
            umob: req.body.phone,
            upasswd: req.body.password,
             uorg: '#',
             taskcom: 0,
             tasktodo: '.',
             utype: "user"
    })
      
     uss.save().then(()=>{
        sendmail.sendmail(uss.uemail,uss.uname)
       return res.redirect('login.html')
    }).catch((error)=>{
          return res.send('invalid user detail or internet connection is not there')
    })

})


app.post('/loginreq',(req,res)=>{
    
      
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


app.get('/',function(req,res){ 
    res.set({ 
        'Access-control-Allow-Origin': '*'
        }); 
    return res.render('login'); 
    }).listen(3000)

//  Making a temporary home

// app.get('/home',function(req,res)
// {
// return res.render("home.html");
// });

// creating a team

app.post('/create_team',(req,res)=>
{
    // const usr=user.find({'uemail':req.session})

    // console.log(usr);
    if(req.session.obj.uteam!=0)
    {
        console.log("TEam already created")
        return res.redirect('home')

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
                })
                
            
            
            return res.render('request');
        }).catch((error)=>{
              return res.send('invalid user detail or internet connection is not there');
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
    return res.redirect('home')
});
   
//This is a temperary code      
app.get('/notifications',(req,res)=>
{

var request=req.session.obj.ureq[0];
user.findOne({'userId':request}).exec(function (err,usr) {
             
    
    return res.render('notifications',{req:usr.uname})
            })

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
        
        })
        
                })
          res.render('home')   
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

//This is to show pages
app.get('/homepage',function(req,res)
{
    res.render('home')
})

app.get('/requestpage',function(req,res)
{
    res.render('request')
})