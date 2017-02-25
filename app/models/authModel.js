var mongoose = require('mongoose');
var crypto = require('crypto');
var User = require('./userModel').userModel;
var Admin = require('./userModel').adminModel;
var dbModel = require('../models/db-model');
var db = dbModel.db;

 
// User API
 
exports.createUser = function(userData){
	var user = {
		username: userData.username,
		password: userData.password
	}
	return new User(user).save()
}

exports.createAdmin = function(adminData){
    var admin = {
        username: adminData.username,
        password: adminData.password
    }
    return new Admin(admin).save()
}
 
exports.getUser = function(id) {
	return User.findOne(id)
}
 
exports.getAdmin = function(id) {
    return Admin.findOne(id)
}

exports.checkUser = function(userData) {
	return User
		.findOne({username: userData.username})
		.then(function(doc){
            if(doc!=null){
                if ( doc.password == userData.password ){
                    console.log("User password is ok");
                    return Promise.resolve(doc)
                } else {
                    return Promise.reject("Error wrong")
                }
            }
            else
                return doc;
		})
}

exports.checkAdmin = function(adminData) {
    	return Admin
		.findOne({username: adminData.username})
		.then(function(doc){
            if(doc!=null){
                if ( doc.password == adminData.password ){
                    console.log("User password is ok");
                    return Promise.resolve(doc)
                } else {
                    return Promise.reject("Error wrong")
                }
            }
            else
                return doc;
		})
}