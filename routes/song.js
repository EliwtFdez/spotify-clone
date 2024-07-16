'use strict';

// Importar las dependencias necesarias
var express = require('express');
var SongController = require('../controller/song');
var api = express.Router();
var md_auth = require('../middleswares/authentication');    

var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/song' });

// Rutas para manejar canciones
api.get('/Song/:id', md_auth.ensureAuth, SongController.getSong);// obtiene las canciones
api.post('/Song', md_auth.ensureAuth, SongController.saveSong); // guarda las canciones con album de referencia
api.get('/Songs/:album?', md_auth.ensureAuth, SongController.getSongs); // Nueva ruta para obtener las canciones
api.put('/Song/:id', md_auth.ensureAuth, SongController.updateSong); // Nueva ruta para actualizar la canción
api.delete('/song/:id', md_auth.ensureAuth, SongController.deleteSong); // Nueva ruta para eliminar la canción



// Exportar el módulo de rutas
module.exports = api;
