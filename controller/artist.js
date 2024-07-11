'use strict'

var path = require('path');
var fs = require('fs');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getArtist(req, res) {
    var artistId = req.params.id;

    Artist.findById(artistId).exec()
        .then(artist => {
            if (!artist) {
                res.status(404).send({ message: 'El artista no existe' });
            } else {
                res.status(200).send({ artist });
            }
        })
        .catch(err => {
            res.status(500).send({ message: 'Error en la petición' });
        });
}

async function getArtists(req, res) {
    try {
        var page = req.params.page ? parseInt(req.params.page) : 1;
        var itemsPerPage = 4;

        const artists = await Artist.find()
            .sort('name')
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        if (!artists || artists.length === 0) {
            return res.status(404).send({ message: 'No hay artistas' });
        }

        const count = await Artist.countDocuments();
        return res.status(200).send({
            pages: Math.ceil(count / itemsPerPage),
            artists: artists
        });
    } catch (err) {
        return res.status(500).send({ message: 'Error en la petición' });
    }
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, { new: true }).exec()
        .then(artistUpdated => {
            if (!artistUpdated) {
                return res.status(404).send({ message: 'El artista no se ha podido actualizar' });
            }
            res.status(200).send({ artist: artistUpdated });
        })
        .catch(err => {
            res.status(500).send({ message: 'Error al actualizar el artista', error: err });
        });
}

function saveArtist(req, res) {
    var artist = new Artist();
    var params = req.body;  // contiene datos en pares clave/valor enviados desde el cuerpo de la solicitud

    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save()
        .then(artistStored => {
            if (!artistStored) 
            {
                return res.status(404).send({ message: 'The artist has not been saved' });
            }
            res.status(200).send({ Artist: artistStored });
        })
        .catch(err => 
        {
            res.status(500).send({ message: 'Error saving artist', error: err });
        });
}

function deleteArtist(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndDelete(artistId).then(artistRemoved => {
        if (!artistRemoved) {
            return res.status(404).send({ message: 'El artista no se ha eliminado' });
        }

        // Eliminar los álbumes asociados al artista
        Album.deleteMany({ artist: artistId }).then(albumsRemoved => {
            if (albumsRemoved.deletedCount === 0) {
                return res.status(404).send({ message: 'No se encontraron álbumes para eliminar' });
            }

            // Eliminar las canciones asociadas a los álbumes
            Song.deleteMany({ album: { $in: albumsRemoved.map(album => album._id) } }).then(songsRemoved => {
                if (songsRemoved.deletedCount === 0) {
                    return res.status(404).send({ message: 'No se encontraron canciones para eliminar' });
                }

                return res.status(200).send({ message: 'Artista, álbumes y canciones eliminados exitosamente', artist: artistRemoved });
            }).catch(err => {
                return res.status(500).send({ message: 'Error al eliminar las canciones', error: err });
            });
        }).catch(err => {
            return res.status(500).send({ message: 'Error al eliminar los álbumes', error: err });
        });
    }).catch(err => {
        return res.status(500).send({ message: 'Error al eliminar el artista', error: err });
    });
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = 'No recibido..';

    if (req.files && req.files.image) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\'); // Use '\\' for Windows path
        file_name = file_split[file_split.length - 1];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[ext_split.length - 1];

        console.log(file_name, file_split);

        if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif') {
            Artist.findByIdAndUpdate(artistId, { image: file_name }, { new: true })
                .then(artistUpdated => {
                    if (!artistUpdated) {
                        return res.status(404).send({ message: 'Unable to update artist' });
                    } else {
                        return res.status(200).send({ artist: artistUpdated });
                    }
                })
                .catch(err => {
                    return res.status(500).send({ message: 'Error updating artist', error: err });
                });
        } else {
            return res.status(400).send({ message: 'Invalid file extension' });
        }
    } else {
        return res.status(400).send({ message: 'No image uploaded' });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/artists/' + imageFile;

    fs.exists(path_file, function(exist) {
        if (exist) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'Image does not exist' });
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist,
    uploadImage,
    getImageFile
};
