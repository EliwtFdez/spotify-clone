'used strict';

var mongoose = require('mongoose');
var album = require('./album');
var Schema = mongoose.Schema;

var SongSchema = Schema({
    number: Number,
    name: String,
    duration: String,
    file: String,
    
    album: {type: Schema.ObjectId, ref : 'Album'}
});

module.exports = mongoose.model('Song' , SongSchema);

