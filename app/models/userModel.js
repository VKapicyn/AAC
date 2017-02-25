var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    username : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});

var userModel = mongoose.model('user2', userSchema);
module.exports.userModel = userModel;

var adminSchema = new mongoose.Schema({
    username : {
        type: String,
        unique: true,
        required: true
    },
    password : {
        type: String,
        required: true
    }
});

var adminModel = mongoose.model('admin2', adminSchema);
module.exports.adminModel = adminModel;