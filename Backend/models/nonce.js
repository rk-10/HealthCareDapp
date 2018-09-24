let mongoose = require('mongoose');
let Schema = mongoose.Schema;

//schema for configuration
const nonceValueSchema = Schema({
    key: {type: String, required: true},
    value: {type: Number,required:true}
});

module.exports = mongoose.model('nonceValue', nonceValueSchema);