var editModel = require('../models/editModel').editModel;
var userModel = require('../models/userModel').userModel;
var fs = require('../models/db-model').fs;
var gfs = require('../models/db-model').gfs;




exports.editRender = function(req, res){
    if (req.session.admin||req.session.user){
        editModel.findOne({_id:req.params._id}).then(function(result){
            userModel.find({}).then(function(users){
                res.render('edit',{
                    session: req.session,
                    result: result,
                    users: users
                });
            });
        })
    }
}

exports.editChat = function(req, res){
    if (req.session.admin||req.session.user){
        editModel.findOne({_id:req.params.id}).then(function(result){
            let chat = {};
            if(req.session.admin)
                chat.author = req.session.admin.name;
            if(req.session.user)
                chat.author = req.session.user.name;
            chat.message = req.body.message;
            chat.date = new Date();

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

                logger('Скриншот', result.screen, req, '/'+req.file.filename);
                chat.screen = '/'+req.file.filename;
            }
            else
                chat.screen = 'none';

            result.chat.push(chat);
            result.save();
            res.redirect('/edit/'+result._id);
        })
    }
}

exports.editRecipient = function(req, res){
    if (req.session.admin||req.session.user){
        editModel.findOne({_id:req.params.id}).then(function(result){
            logger('Получатель', result.recipient, req, req.body.recipient);
            result.recipient = req.body.recipient;
            result.save();
        })
        res.redirect('/edit/'+req.params.id);
    }
}

exports.editSourceCompany = function(req, res){
    if (req.session.admin||req.session.user){
        editModel.findOne({_id:req.params.id}).then(function(result){
            logger('Источник', result.source_company, req, req.body.source_company);
            result.source_company = req.body.source_company;
            result.save();
        })
        res.redirect('/edit/'+req.params.id);
    }
}

exports.editPage = function(req, res){
    if (req.session.admin||req.session.user){
        editModel.findOne({_id:req.params.id}).then(function(result){
            logger('Страницы', result.page, req, req.body.page);
            result.page = req.body.page;
            result.save();
        })
        res.redirect('/edit/'+req.params.id);
    }  
}

exports.editComment = function(req, res){
    if (req.session.admin||req.session.user){
        editModel.findOne({_id:req.params.id}).then(function(result){
            logger('Комментарий', result.comment, req, req.body.comment);
            result.comment = req.body.comment;
            result.save();
        })
        res.redirect('/edit/'+req.params.id);
    } 
}

exports.editScreen = function(req, res){
    if (req.session.admin||req.session.user){
        editModel.findOne({_id:req.params.id}).then(function(result){
            //console.log(req.body, req.file)
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

                logger('Скриншот', result.screen, req, '/'+req.file.filename);
                result.screen = '/'+req.file.filename;
                result.save();
            }
        })
        res.redirect('/edit/'+req.params.id);
    }   
}

exports.editStatus = function(req, res){
    if (req.session.admin||req.session.user){
        editModel.findOne({_id:req.params.id}).then(function(result){
            logger('Статус', num_name(result.status), req, req.body.status);
            result.status = name_num(req.body.status);
            result.accept_date = new Date();
            result.save();
        })
        res.redirect('/edit/'+req.params.id);
    } 
}

function logger(theme, subject, req, _subject){
    editModel.findOne({_id:req.params.id}).then(function(result){
        let last; 
            if(req.session.admin)
                last = req.session.admin.name;
            if(req.session.user)
                last = req.session.user.name;
        let log = {};
        log.author = last;
        log.subject = subject;
        log.date = new Date();
        if(theme!='Комментарий' && theme!='Скриншот')
            log.message = theme + ': ' + subject+' => '+ _subject + ', Изменил: ' + log.author + ', Дата: ' + log.date;
        else
            log.message = theme;// + ' - ' + '<a href="'+ +'">смотреть</a>, Изменил: ' + log.author + ', Дата: ' + log.date;
        result.logs.push(log);
        result.save();
    });
}

function num_name(num){
    switch(num){
        case 0:
            name = 'На рассмотрении';
        break;
        case 1:
            name = 'Внесена';
        break;
        case 2:
            name = 'Не внесена';
        break;
    }
    return name;
}

function name_num(name){
    switch(name){
        case 'На рассмотрении':
            num = 0;
        break;
        case 'Внесена':
            num = 1;
        break;
        case 'Не внесена':
            num = 2;
        break;
    }
    return num;
}