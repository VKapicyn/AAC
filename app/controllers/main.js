var editModel = require('../models/editModel').editModel;
var stats = require('../models/editModel').stats;

exports.mainPage = function(req, res){
    let vneseni = 0,  ne_vneseni = 0, rassmotrenie = 0;
    if(req.session.user || req.session.admin){
        if(req.session.admin)
            editModel.find().then(function(result){
                for(let i=0; i<result.length; i++){
                    switch(result[i].status){
                        case 0:
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
                res.render('main', {
                    session: req.session,
                    edit: result, 
                    vneseni: vneseni,
                    ne_vneseni: ne_vneseni,
                    rassmotrenie: rassmotrenie
                })
            });
        else
            editModel.find({recipient: req.session.user.name}).then(function(result){
                for(let i=0; i<result.length; i++){
                    switch(result[i].status){
                        case 0:
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
                res.render('main', {
                    session: req.session,
                    edit: result, 
                    vneseni: vneseni,
                    ne_vneseni: ne_vneseni,
                    rassmotrenie: rassmotrenie
                })
            });
    }
    else
        res.redirect('/login')
}

