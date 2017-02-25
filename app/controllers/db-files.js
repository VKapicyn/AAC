var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId; 
var dbModel = require('../models/db-model');
var editModel = require('../models/editModel').editModel;
var gfs = require('../models/db-model').gfs;
var db = dbModel.db;


exports.getFile = function (req, res){
  if (req.session.admin||req.session.user){
       var readstream = gfs.createReadStream({filename: req.params.filename});
       readstream.on('error', function(err){
        res.send('No image found with that title');
       });
       readstream.pipe(res);
  }
  else
   res.send('Недостаточно прав');
};

exports.getComment = function(req, res){
  if (req.session.admin||req.session.user){
      editModel.findOne({_id:req.params.id}).then(function(result){
        for(let i = 0; i < result.logs.length; i++){
          if(result.logs[i]._id == req.params.subid)
            res.send(result.logs[i].subject);
        }
      })
  }
  else
    res.send('Недостаточно прав');
}