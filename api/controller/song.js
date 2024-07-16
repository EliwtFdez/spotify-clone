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

// Función para subir un archivo a una canción
async function uploadFile(req, res) 
{
    var songId = req.params.id;
    var file_name = 'No update ...';
    
    if (req.files) 
    {
        var files_path = req.files.file.path;
        var file_split = files_path.split('\\');
        file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        console.log(Song, file_split);    

        if (file_ext === 'mp3' || file_ext === 'obb' || file_ext === 'opus') 
        {
            Song.findByIdAndUpdate(songId, { file: file_name }, { new: true })
                .then(songUpdated => 
                {
                    if (!songUpdated) 
                    {
                        res.status(404).send({ message: 'Unable to update song' });

                    } 
                    else 
                    {
                        res.status(200).send({ song: songUpdated });

                    }
                })
                .catch(err => 
                {
                    res.status(500).send({ message: 'Error updating song', error: err });

                });
        } 
        else 
        {
            res.status(400).send({ message: 'Invalid extension .. ' });

        }
    } 
    else 
    {
        res.status(400).send({ message: 'You have not uploaded an file' });

    }
}

// Función para obtener un archivo de canción
function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' + songFile;
    fs.exists(path_file, (exists) => {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'No existe el archivo de audio...' });
        }
    });
}


module.exports = {
    getSongs,
    saveSong,
    getSong,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile

};
