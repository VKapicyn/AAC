var editModel = require('../models/editModel').editModel;
var stats = require('../models/editModel').stats;

exports.getSearch = function(req, res){
    let sort = req.params.sort;
    let status = req.params.status;
    let source = req.params.source;
    let pages = req.params.page;
    let amount = req.params.amount;

    let query = editModel.find();

    if(source!='null')
        query.where({source_company: {$regex: source, $options:'i'}});
    
    switch(status){
        case 'vneseni' : query.where({status: 1});
            break;
        case 'ne_vneseni' : query.where({status: 2});
            break;
        case 'rassmotrenie' : query.where({status: 0});
            break;
        case 'all' : query.where();
            break;
    }

    switch(sort){
        case 'pages' : query.sort({page : 'asc'});
            break;
        case 'source' : query.sort({source_company: 'asc'});
            break;
        case 'date' : query.sort({add_date: 'asc'});
            break;
    }

    query.exec(function(err, result){
        let new_result =[];
        if (result!=undefined){
            let start = amount * pages - amount;
            let finish = amount * pages - 1;
            for(let i=start; ((i<result.length) && (i<=finish)); i++){
                new_result.push(result[i]);
            }
            let size = {'key':'size', 'size':result.length};
            new_result.push(size);
            res.json(new_result);
        }
    });

    console.log('ok');
}