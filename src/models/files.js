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
    fId:
    {
        type:Number
        //require:true
        
    },
    uId:
    {
        type:Number,
        
        require:true
       
    },
    file:
    {
         type:Buffer
        // trim:true
    },
    ftype:
    {
        type:String,
        require:true
    }
    
   

})
userschema.plugin(autoIncrement.plugin, { model: 'files', field: 'fId',startAt:11 })
var org = connection.model('files', userschema)
module.export=files;