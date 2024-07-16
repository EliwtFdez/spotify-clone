'use strict';

// Importar las dependencias necesarias
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');

var Song = require('../models/song'); 
var Artist = require('../models/artist');
var Album = require('../models/album');

// Función para obtener una canción (solo para prueba)
// Función para obtener una canción por su ID
async function getSong(req, res) {
    try {
        var songId = req.params.id;

        // Buscar la canción y poblar la información del álbum asociado
        var song = await Song.findById(songId).populate({ path: 'album' });

        if (!song) {
            return res.status(404).send({ message: 'La canción no existe !!' });
        }

        return res.status(200).send({ song });
    } catch (err) {
        return res.status(500).send({ message: 'Error en la petición', error: err });
    }
}

// Función para guardar una canción
async function saveSong(req, res) {
    try {
        var params = req.body;

        if (!params.number || !params.name || !params.duration || !params.album) {
            return res.status(400).send({ message: 'Todos los campos son obligatorios' });
        }

        var song = new Song({
            number: params.number,
            name: params.name,
            duration: params.duration,
            file: null,
            album: params.album
        });

        const songStored = await song.save();

        if (!songStored) {
            return res.status(404).send({ message: 'No se ha guardado la canción' });
        }

        return res.status(200).send({ song: songStored });
    } catch (err) {
        return res.status(500).send({ message: 'Error en el servidor', error: err });
    }
}

// Función para obtener una lista de canciones, con la opción de filtrar por álbum
async function getSongs(req, res) {
    var albumId = req.params.album;

    try {
        let find;

        if (!albumId) {
            find = Song.find({}).sort({ number: 1 });
        } else {
            find = Song.find({ album: albumId }).sort({ number: 1 });
        }

        const songs = await find.populate({
            path: 'album',
            populate: {
                path: 'artist',
                model: 'Artist'
            }
        }).exec();

        if (!songs || songs.length === 0) {
            return res.status(404).send({ message: 'No se encontraron canciones' });
        }

        return res.status(200).send({ songs });
    } catch (err) {
        return res.status(500).send({ message: 'Error en la petición', error: err });
    }
}

// Función para actualizar una canción por su ID
async function updateSong(req, res) {
    var songId = req.params.id;
    var update = req.body;

    try {
        const songUpdated = await Song.findByIdAndUpdate(songId, update, { new: true });

        if (!songUpdated) {
            return res.status(404).send({ message: 'No se ha actualizado la canción' });
        }

        return res.status(200).send({ song: songUpdated });
    } catch (err) {
        return res.status(500).send({ message: 'Error en el servidor', error: err });
    }
}

// Función para eliminar una canción por su ID
async function deleteSong(req, res) {
    var songId = req.params.id;

    try {
        const songRemoved = await Song.findByIdAndDelete(songId);

        if (!songRemoved) {
            return res.status(404).send({ message: 'No se ha borrado la canción' });
        }

        return res.status(200).send({ song: songRemoved });
    } catch (err) {
        return res.status(500).send({ message: 'Error en el servidor', error: err });
    }
}

module.exports = {
    getSongs,
    saveSong,
    getSong,
    updateSong,
    deleteSong

};
