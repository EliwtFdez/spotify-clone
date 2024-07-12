'used strict';

var mongoose = require('mongoose');
const album = require('./album');
var Schema = mongoose.Schema;

var SongSchema = Schema({
    Number: Number,
    name: String,
    duration: String,
    file: String,
    
    album: {type: Schema.ObjectId, ref : 'Album'}
});

module.exports = mongoose.model('Song' , SongSchema);

