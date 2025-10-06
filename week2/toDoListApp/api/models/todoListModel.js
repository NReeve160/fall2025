'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    name: {
        type: String,
        required: 'Name'
    },
    Created_date: {
        type: Date,
        default: Date.now
    },
    Status: {
        Type: [{
            type: String,
            enum: ['pending', 'ongoing', 'completed']
        }],
    default: [pending]
    }
});

module.exports = mongoose.model('Tasks', TaskSchema);