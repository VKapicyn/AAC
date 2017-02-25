var editModel = require('../models/editModel').editModel;
var userModel = require('../models/userModel').userModel;
var fs = require('../models/db-model').fs;
var gfs = require('../models/db-model').gfs;

exports.editPage = function(req, res){
    if (req.session.admin)
        editModel.find().then(function(result){
            let vneseni=0,  ne_vneseni=0, rassmotrenie=0;
            for(let i=0; i<result.length; i++){
                switch(result[i].status){
                    case 0 :
                        rassmotrenie++;
                    break;
                    case 1:
                        vneseni++;
                    break;
                    case 2:
                        ne_vneseni++;
                    break;
                }
            }
            userModel.find({}).then(function(result){
                res.render('add_edit', {
                    session: req.session,
                    users: result,
                    vneseni: vneseni,
                    ne_vneseni: ne_vneseni,
                    rassmotrenie: rassmotrenie
                });
            });
        });
    else
        res.send('Авторизуйтесь как администратор');
}

exports.editAdd = function(req, res){
    if (req.session.admin){
        var edit = new editModel;
        edit.sender = req.session.admin.name;
        edit.recipient = req.body.recipient;
        edit.add_date = new Date();
        edit.source_company = req.body.source_company;
        edit.page = req.body.page;
        edit.comment = req.body.comment;
        edit.status = 0;
            let firstComment = {};
            firstComment.author = req.session.admin.name;
            firstComment.message = req.body.chat;
            firstComment.date = new Date();
        edit.chat.push(firstComment);
        
        //edit.screen
        if(req.file){
            var writestream = gfs.createWriteStream({
                filename: req.file.filename
            });

            fs.createReadStream(req.file.path)
                .on('end', function(){fs.unlink(req.file.path, function(err){console.log('success')})})
                .on('err', function(){ console.log('Error uploading image')})
                .pipe(writestream);
            
            writestream.on('close', function (file){
                console.log(file.filename + ' Written To DB');
            });

            edit.screen = '/'+req.file.filename;
        }
        edit.save();
        res.redirect('/')
    }
    else
        res.send('Авторизуйтесь как администратор');
}