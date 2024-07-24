'use strict';

var express = require ('express');
var ArtistController = require('../controller/artist');

var api = express.Router();
var md_auth = require('../middleswares/authentication');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/artists'});




api.get('/Artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.get('/Artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);

api.put('/Artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.post('/Artist', md_auth.ensureAuth, ArtistController.saveArtist);

api.delete('/Artist/:id', md_auth.ensureAuth, ArtistController.deleteArtist);

api.post('/upload_image_artist/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/Get-Image-Artist/:imageFile', ArtistController.getImageFile);



module.exports = api;