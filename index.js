// const mongoose = require("mongoose");

const dotenv=require('dotenv').config()
const  session = require('express-session')
const connectDB = require('./server/database/connection')
require("dotenv").config();
connectDB()


const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  }))

app.use(express.static('public'))
app.use(express.static('server'))

app.use((req,res,next)=>{
    res.set('Cache-control','no-store,no-cache');
    next()
})

app.set('view engine', 'ejs');


//for user routes
const userRoute = require('./server/route/userRoute');

app.use('/',userRoute)

app.use('/',require('./server/route/adminRoute'))




 
app.listen(process.env.PORT,()=>{
    console.log(`Server is running at ${process.env.PORT}`);
});