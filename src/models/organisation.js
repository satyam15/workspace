const express=require('express')
const req=require('request')
const path=require('path')
const fs=require('fs')
//const validator=require('validator')
//const mongoose=require('mongoose')
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    autoIncrement = require('mongoose-auto-increment');
    var connection = mongoose.createConnection("mongodb://127.0.0.1:27017/Server",{
        useNewUrlParser: true,
        useCreateIndex: true, 
    });
 
autoIncrement.initialize(connection);
 

const app=express()
const validator=require('validator')

var userschema= new Schema({
    orgId:
    {
        type:Number
        //require:true
        
    },
    orgname:
    {
        type:String,
        trim:true,
        require:true,
        trim:true
    },
    orgteam:
    {
         type:Array
        // trim:true
    },
    orgemail:
    {
        type:String,
        require:true,
        lowercase:true,
        trim:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            throw new Error('Email is invalid')
        }
    },
    orgmob:
    {
        type:String,
        require:true,
        validate(value)
        {
            if(!validator.isMobilePhone(value))
            throw new Error('mobile is invalid')
        }
    },
    orgpasswd:
    {
        type:String,
        require:true,
        minlength:7,
        trim:true
        

    }
   

})
userschema.plugin(autoIncrement.plugin, { model: 'organisation', field: 'orgId',startAt:1000 })
var org = connection.model('organisation', userschema)
module.export=org;