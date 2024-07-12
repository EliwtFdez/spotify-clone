'used strict';

var mongoose = require('mongoose');
const artist = require('./artist');
var Schema = mongoose.Schema;

var AlbumSchema = Schema({
    title: String,
    description: String,
    year: Number,
    image: String,
    artist: {type: Schema.ObjectId, ref : 'Artist'}
});

module.exports = mongoose.model('Artist' , AlbumSchema);

