const createError = require('http-errors');
const express = require('express');
let mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
let morgan = require('morgan');
const _ = require('lodash');
// let debug = require('debug')('Frontend:server');

require('dotenv').config();

var app = require('express')();

app.use(express.json({ extended: true}));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :date[clf]'));

mongoose.Promise = global.Promise;
//Mongoose Setup
// =============================================================================
let checkAndConnectDb = () => {
    // Connect To Database
    mongoose.connect(process.env.DB, function (err) {
        if (err) {
            console.log('Database connect error: ' + err);
        }
    });

    // On Connection
    mongoose.connection.on('connected', () => {
        console.log('Database connected');
    });

    // On Error
    mongoose.connection.on('error', (err) => {
        console.log('Database check connection error: ' + err);
    });

};
checkAndConnectDb();


// ROUTES FOR OUR API
// =============================================================================
// create our router
const router = express.Router();

// middleware to be used for all requests
router.use((req, res, next) => {

    // Checks if the mongoose connection readyState is either 1 (connected) or 2 (connecting)
    function isConnected(mdb) {
        return _.indexOf(
            [1],
            _.get(mdb, 'connection.readyState', null)
        ) !== -1
    }

    if (!isConnected(mongoose))
        checkAndConnectDb();

    next();
});

// importing and using the different routers
let routers = require('./routes/index');
router.use(routers);

app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    //Catch json error
    res.status(400).json({success: false, msg: "There seems to be an error", error: err.message});
});

// START THE SERVER
// =============================================================================
app.listen(process.env.PORT, (err) => {
    if (err)
    console.log(err);
console.log('Server running at port:' + process.env.PORT);
});