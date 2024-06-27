'use strict'

var path = require('path');
var fs = require('fs');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

async function getArtist(req, res){
    res.status(200).send({message: 'Metodo getArtist del controller Artist.js'});
    
}


module.exports= {
    getArtist,

}