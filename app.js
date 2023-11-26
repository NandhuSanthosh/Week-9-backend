require("dotenv").config();

const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')

const userRoutes = require('./Routes/UserRoutes.js');
const adminRoutes = require('./Routes/AdminRoutes.js');
const { handleError } = require("./Controllers/ErrorController.js");

const app = express();

app.use( cors({
    origin: "http://localhost:3000", 
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser());



app.use('/', userRoutes)
app.use('/admin', adminRoutes)
// app.use('/admin', adminRoutes)

app.all( '*', (req, res, next) => next({ status: 404, message: "Not found"}))
app.use(handleError)
          





app.get("/", (req, res) => {
    res.send({data: "ok"})
})



mongoose.connect(process.env.DB_URI)
.then( res => {
    console.log( "Connection to db established");
})
.catch( err => {
    console.log("Db error", err.message)
})

app.listen(5500, ()=> {
    console.log("Server up")
})