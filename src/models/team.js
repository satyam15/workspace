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
    teamId:
    {
        type:Number
        
    },
    tname:
    {
        type:String,
        trim:true,
        require:true,
        trim:true
    },
    torg:
    {
         type:String,
         trim:true,
         require:true
        // trim:true
    },
    tsize:
    {
        type:Number
        
    },
    teamember:
    {
        type:Array,
        require:true,
        
    },
    tleader:
    {
        type:String,
        require:true,
        trim:true
        

    },
    orgid:
    {
        type:Number,
        require:true
    },
    tstatus:
    {
        type:NUmber
    }
   

})
userschema.plugin(autoIncrement.plugin, { model: 'team', field: 'teamId',startAt:500 })
var team= connection.model('team', userschema)
module.export=team;