'use strict'

var path = require('path');
var fs = require('fs');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
const artist = require('../models/artist');

async function getArtist(req, res)
{
    var artistId = req.params.id;   

    Artist.findById(artistId (err, artist) =>
    {
        if(err)
        {
            res.status(200).send({message: 'Error peticion'});

        }
        else{
            if (!artist) 
            {
                
            }
        }


        

    });

    res.status(200).send({message: 'Metodo getArtist del controller Artist.js'});
    
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


module.exports= {
    getArtist,
    saveArtist,
    
}