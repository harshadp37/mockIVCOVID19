const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dbconfig = require('./db');
const path = require('path');
const PORT = process.env.PORT || 3000;

const app = express();

/* MONGODB CONNECTION */
mongoose.connect(dbconfig.url + dbconfig.database, dbconfig.options, (err)=>{
    if(err) throw err;
    console.log("Connected to Database : " + dbconfig.database);
})

/* MIDDLEWARES */
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'assests')));
/* INDEX ROUTES */
app.use('/', require('./routes/index'));

/* START SERVER */
app.listen(PORT, function(){
    console.log("Server is Running on PORT : " + PORT)
})