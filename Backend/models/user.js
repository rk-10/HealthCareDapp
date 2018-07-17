const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passport = require('passport');
const localStrategy = require('passport-local');
const crypto = require('crypto');
require('dotenv').config();

// schema for registered users
let patientSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String},
    publicaddress: {type: String, unique: true, required: true},
    date: {type: Date, default: Date.now()}
});

patientSchema.methods.ValidPassword = (pwd) => {
  return this.password == pwd;
}

patientSchema.methods.SetPassword = (pwd) => {
  this.password = crypto.createHmac('sha1', process.env.SECRETKEY).update(pwd).digest('hex');
}   

module.exports = mongoose.model('patient', patientSchema);