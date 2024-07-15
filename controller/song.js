'use strict';

var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res) { res.status(200).send({ message: 'Probando una acción de la mmusic' });}

module.exports = {
    getSong,

};
