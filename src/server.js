var express=require("express"); 
var bodyParser=require("body-parser"); 
const path=require('path')
const fs=require('fs')
const user=require('./src/models/users.js')
const team=require('./src/models/team.js')
var us;
const sendmail=require('./utilities/accounte.js')


var app=express() 
//app.set('view engine','ejs');
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
             utype: req.body.utype
    })
      
     uss.save().then(()=>{
        sendmail.sendmail(uss.uemail,uss.uname)
       return res.redirect('login')
    }).catch((error)=>{
          return res.send('invalid user detail or internet connection is not there')
    })

})


app.post('/loginreq',(req,res)=>{
    
       // db.close();
    const ussr=user.findOne({'uemail':req.body.email,'upasswd':req.body.password}).toArray;
    //console.log(usr.bodyParser.uname);
    console.log(ussr)
    if(!ussr)
    res.send('invalid login credentials')
    else
    {
     //req.session.email=req.body.email
    console.log(ussr)
    return res.redirect('home.html')
    }
})


app.get('/',function(req,res){ 
    res.set({ 
        'Access-control-Allow-Origin': '*'
        }); 
    return res.redirect('signup.html'); 
    }).listen(3000)

//  Making a temporary home

app.get('/home',function(req,res)
{
return res.render("home.html");
});

// creating a team

app.post('/create_team',(req,res)=>
{
    // const usr=user.find({'uemail':req.session})

    // console.log(usr);
    const tm=new team({

        tname: req.body.teamname,
        torg: req.body.organisationname,
        tleader: req.body.leaderid,
        orgid: req.body.organisationid,
        teamember:[req.body.leaderid],
      
    })
// There is a problem in this section
        tm.save().then(()=>{
            team.findByIdAndUpdate(req.body.leaderid,
                {$push: {teamember: req.body.leaderid}},
                {safe: true, upsert: true},
                function(err, doc) {
                    if(err){
                    console.log(err);
                    }else{
                    //do stuff
                    }
                }
            );
        
        

        //     console.log('shgdhsdfhj');
        //    var fn=team.findOneAndUpdate({tname:req.body.teamname},{$push:{teamember:req.body.leaderid}});
         
        //    //fn.save();
        //     console.log('dhggjgddj');
            return res.redirect('request');
        }).catch((error)=>{
              return res.send('invalid user detail or internet connection is not there');
        })
   
      
});

// This is handle requests
app.post('/request',(req,res)=>
{
   
    return alert("Request Send Sucessfuly")
});
   
//This is a temperary code      
app.get('/secret',(req,res)=>
{
return res.render('secret')
});