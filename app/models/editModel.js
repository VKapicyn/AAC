var mongoose = require('mongoose');

var editSchema = new mongoose.Schema({
    sender: String,
    recipient: String,
    add_date: mongoose.Schema.Types.Date,
    source_company: String,
    page: String,
    comment: String,
    screen: String,
    accept_date: mongoose.Schema.Types.Date,
    status: Number, // На рассмотрении, внесена, не внесена 0, 1, 2 - соответственно
    chat: [{
        author: String,
        message: String,
        screen: String,
        date: mongoose.Schema.Types.Date
    }],
    logs: [{
        author: String,
        subject: String,
        message: String,
        date: mongoose.Schema.Types.Date
    }]
});

var editModel = mongoose.model('edit', editSchema);
module.exports.editModel = editModel;

