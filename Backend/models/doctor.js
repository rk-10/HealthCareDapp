const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// schema for registered users
let doctorSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String},
    date: {type: Date, default: Date.now()}
});

doctorSchema.methods.ValidPassword = function(pwd) {
    let pass = crypto.createHmac('sha1', process.env.SECRETKEY).update(pwd).digest('hex');
    return this.password == pass;
}

doctorSchema.methods.SetPassword = function(pwd)  {
    this.password = crypto.createHmac('sha1', process.env.SECRETKEY).update(pwd).digest('hex');
}   

doctorSchema.methods.generateJWT = () => {
    let _data = {
        _id: this._id,
        username: this.username,
    }
    return jwt.sign({
        data: _data
    }, process.env.SECRETKEY, {expiresIn: '1h'})
}

module.exports = mongoose.model('doctor', doctorSchema);