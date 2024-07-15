'use strict';

var express = require ('express');
var SongController = require('../controller/song');

var api = express.Router();
var md_auth = require('../middleswares/authentication');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/song'});

api.get('/song', md_auth.ensureAuth, AlbumController.getAlbum);



module.exports = api;