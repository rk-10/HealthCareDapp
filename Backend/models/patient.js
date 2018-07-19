const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// schema for registered users
let patientSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String},
    date: {type: Date, default: Date.now()}
});

patientSchema.methods.ValidPassword = function(pwd) {
  let pass = crypto.createHmac('sha1', process.env.SECRETKEY).update(pwd).digest('hex');
  return this.password == pass;
}

patientSchema.methods.SetPassword = function(pwd) {
  this.password = crypto.createHmac('sha1', process.env.SECRETKEY).update(pwd).digest('hex');
  // return this.password
}   

patientSchema.methods.generateJWT = () => {
  let _data = {
      username: this.username,
      password: this.password,
      publicaddress: this.publicaddress
  }
  return jwt.sign({
      data: _data
  }, process.env.SECRETKEY, {expiresIn: '1h'})
}

module.exports = mongoose.model('patient', patientSchema);