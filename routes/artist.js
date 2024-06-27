'use strict';

var express = require ('express');
var ArtistController = require('../controller/artist');

var api = express.Router();
var md_auth = require('../middleswares/authentication');


api.get('/Artist', md_auth.ensureAuth, ArtistController.getArtist);

module.exports = api;