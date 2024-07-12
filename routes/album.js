'use strict';

var express = require ('express');
var AlbumController = require('../controller/album');

var api = express.Router();
var md_auth = require('../middleswares/authentication');

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/album'});

api.get('/Albums/:artist?', md_auth.ensureAuth, AlbumController.getAlbums); // Ruta para obtener álbumes de cierto artista

api.get('/Album/:id', md_auth.ensureAuth, AlbumController.getAlbum);
api.post('/Album', md_auth.ensureAuth, AlbumController.saveAlbum);

api.put('/album/:id', md_auth.ensureAuth, AlbumController.updateAlbum); // Ruta para actualizar álbum
api.delete('/Album/:id', md_auth.ensureAuth, AlbumController.deleteAlbum); // Ruta para eliminar álbum
api.post('/Upload-Image-Album/:id', [md_auth.ensureAuth, md_upload], AlbumController.uploadImage); // Ruta para subir imagen del álbum
api.get('/Get-Image-Album/:imageFile', AlbumController.getImageFile);



module.exports = api;