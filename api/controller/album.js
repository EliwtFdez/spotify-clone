'use strict'

var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate-v2');


var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
const { resolveSoa } = require('dns');
const album = require('../models/album');

async function getAlbum(req, res) {
    var albumId = req.params.id;

    try {
        const album = await Album.findById(albumId).populate('artist');
        if (!album) {
            return res.status(404).send({ message: 'El álbum no existe' });
        }
        return res.status(200).send({ album });
    } catch (err) {
        return res.status(500).send({ message: 'Error en la petición', error: err });
    }
}    

async function getAlbums(req, res) {
    var artistId = req.params.artist;
    var page = req.query.page ? parseInt(req.query.page) : 1;
    var itemsPerPage = 8;

    try {
        let find;
        if (!artistId) {
            // Sacar todos los álbumes de la base de datos
            find = Album.find({}).sort('title');
        } else {
            // Sacar los álbumes de un artista concreto de la base de datos
            find = Album.find({ artist: artistId }).sort('year');
        }

        const albums = await find.skip((page - 1) * itemsPerPage).limit(itemsPerPage).populate('artist').exec();
        const total = await Album.countDocuments(artistId ? { artist: artistId } : {});

        if (!albums || albums.length === 0) {
            return res.status(404).send({ message: 'No hay álbumes' });
        }

        return res.status(200).send({ 
            totalItems: total,
            albums,
            totalPages: Math.ceil(total / itemsPerPage),
            currentPage: page
        });
    } catch (err) {
        return res.status(500).send({ message: 'Error en la petición', error: err });
    }
}

function saveAlbum(req, res) {
    var album = new Album();
    var params = req.body;

    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save()
        .then(albumStored => {
            if (!albumStored) {
                return res.status(404).send({ message: 'No se ha guardado el album' });
            }
            return res.status(200).send({ album: albumStored });
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error server', error: err });
        });
}

async function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    try {
        const albumUpdated = await Album.findByIdAndUpdate(albumId, update, { new: true });
        if (!albumUpdated) {
            return res.status(404).send({ message: 'El álbum no se ha podido actualizar' });
        }
        return res.status(200).send({ album: albumUpdated });
    } catch (err) {
        return res.status(500).send({ message: 'Error al actualizar el álbum', error: err });
    }
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;
  
    // Eliminar el álbum
    Album.findByIdAndDelete(albumId).then(albumRemoved => {
      if (!albumRemoved) {
        return res.status(404).send({ message: 'El álbum no se ha eliminado' });
      }
  
      // Eliminar las canciones asociadas al álbum
      Song.deleteMany({ album: albumId }).then(songsRemoved => {
        if (songsRemoved.deletedCount === 0) {
          return res.status(404).send({ message: 'No se encontraron canciones para eliminar' });
        }
  
        return res.status(200).send({ message: 'Álbum y canciones eliminados exitosamente', album: albumRemoved });
      }).catch(err => {
        return res.status(500).send({ message: 'Error al eliminar las canciones', error: err });
      });
  
    }).catch(err => {
      return res.status(500).send({ message: 'Error al eliminar el álbum', error: err });
    });
}
    

async function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = 'No subido...';

    if (req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('\\');
        var file_name = file_split[file_split.length - 1];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[ext_split.length - 1];

        if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif') {
            try {
                const albumUpdated = await Album.findByIdAndUpdate(albumId, { image: file_name }, { new: true });
                if (!albumUpdated) {
                    return res.status(404).send({ message: 'No se ha podido actualizar el álbum' });
                }
                return res.status(200).send({ album: albumUpdated });
            } catch (err) {
                return res.status(500).send({ message: 'Error al actualizar el álbum', error: err });
            }
        } else {
            fs.unlink(file_path, (err) => {
                if (err) {
                    return res.status(500).send({ message: 'Extensión no válida y fichero no borrado' });
                }
                return res.status(400).send({ message: 'Extensión no válida' });
            });
        }
    } else {
        return res.status(400).send({ message: 'No se ha subido ninguna imagen' });
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/album/' + imageFile;

    fs.exists(path_file, function(exist) {
        if (exist) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'Image does not exist' });
        }
    });
}
  

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
};
