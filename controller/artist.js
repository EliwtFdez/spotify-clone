'use strict'

var path = require('path');
var fs = require('fs');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

async function getArtist(req, res){
    res.status(200).send({message: 'Metodo getArtist del controller Artist.js'});
    
}

async function saveArtist(req, res){
    var artist = new Artist();
    
    var params = req.body;  //contiene datos en pares clave/valor enviados desde el cuerpo de la solicitud
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) =>{
        if(err)
        {
            res.status(200).send({message: 'Error al guardar artista'});
        }
        else
        {
            
        }

    });

}


module.exports= {
    getArtist,

}