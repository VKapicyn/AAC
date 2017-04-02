var mongoose = require('mongoose');
var dbModel = require('../models/db-model');
var db = dbModel.db;
var authModel = require('../models/authModel');


exports.loginPage = function(req, res){
    res.render('login', {user: req.session});
}

exports.createUser = function(req, res){
    let user = {};
    user.username = req.body.username;
    user.password = req.body.password;
    user.email = req.body.email;
    user.alerts = req.body.alerts;
    console.log(req.body);
    user = authModel.createUser(user);
    res.send('Зарегестрирован ' + user.username);
}

exports.createAdmin = function(req, res){
    let admin = {};
    admin.username = req.body.username;
    admin.password = req.body.password;
    console.log(req.body.username, req.body.password);
    admin = authModel.createAdmin(admin);
    res.send('Зарегестрирован ' + admin.username);
}

exports.createPage = function(req, res){
    if(req.session.user)
        res.render('create')
    else
        res.send('Авторизуйтесь как администратор')
}

exports.login = function(req, res, next) {
	if (req.session.user || req.session.admin) return res.redirect('/')
 
	authModel.checkUser(req.body)
		.then(function(user){
			if(user){
				req.session.user = {id: user._id, name: user.username}
				res.redirect('/')
			} 
            else {
                authModel.checkAdmin(req.body)
                    .then(function(admin){
                        if(admin){
                            req.session.admin = {id: admin._id, name: admin.username}
                            res.redirect('/')
                        } 
                        else {
				            return res.send('Не удалось');
                        }
                    })      
			}
		})
		.catch(function(error){
			return res.send('Не удалось авторизоваться ' + eror);
		})
 
};

exports.logout = function (req, res){
    console.log(req.session);
	if (req.session.user) {
		delete req.session.user;
		res.redirect('/')
	}
    else{
        if (req.session.admin){
            delete req.session.admin;
        }
        res.redirect('/')
    }
};