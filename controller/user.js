'use strict';

var jwt = require('../services/jwt');

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const { request } = require('express');
const user = require('../models/user');
const fs = require('fs');
const path = require('path'); 


function pruebas(req, res) { res.status(200).send({ message: 'Probando una acción del controlador' });}

function saveUser(req, res) {
    const params = req.body;

    if (!params.password || !params.name || !params.surname || !params.email) {
        return res.status(400).send({ message: 'Enter all required fields' });
    }

    const user = new User({
        name: params.name,
        surname: params.surname,
        email: params.email.toLowerCase(),
        role: 'ROLE_USER',
        image: 'null'
    });

    bcrypt.hash(params.password, null, null, (err, hash) => {
        if (err) {
            return res.status(500).send({ message: 'Error encrypting password' });
        }
        user.password = hash;

        user.save()
            .then(userStored => {
                if (!userStored) {
                    return res.status(404).send({ message: 'User not registered' });
                }
                res.status(200).send({ user: userStored });
            })
            .catch(error => {
                res.status(500).send({ message: 'Error saving user', error });
            });
    });
}
function loginUser(req, res) {
    const params = req.body;
    const email = params.email ? params.email.toLowerCase() : '';
    const password = params.password;

    if (!email || !password) {
        return res.status(400).send({ message: 'Enter all required fields' });
    }

    console.log(`Found user with email: ${email}`);
    User.findOne({ email })
        .then(user => {
            if (!user) {
                console.log('User not found');
                return res.status(404).send({ message: 'User does not exist' });
            }

            console.log('Usuario encontrado:', user);
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    // Devolver los datos del usuario logueado
                    if (params.gethash) {
                        // Devolver un token de JWT
                        res.status(200).send({
                            token: jwt.createToken(user)
                        });
                    } else {
                        res.status(200).send({ user });
                    }
                } else {
                    res.status(404).send({ message: 'El usuario no ha podido loguearse' });
                }
            });
        })
        .catch(error => {
            console.log('Error en la solicitud:', error);
            return res.status(500).send({ message: 'Error in request' });
        });
}

function updateUser(req, res) { // se agrego los .then y .catch como lo indican las nuevas
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, { new: true })
        .then(userUpdated => {
            if (!userUpdated) {
                return res.status(404).send({ message: 'Unable to update user' });
            }
            return res.status(200).send({ user: userUpdated });
        })
        .catch(err => {
            return res.status(500).send({ message: 'Error updating the user', error: err });
        });
}

async function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = 'No image ...';
    
    if (req.files) {
        var files_path = req.files.images.path;
        var file_split = files_path.split('\\');
        file_name = file_split[2];

        var ext_split = file_name.split('\.');
        var file_ext = ext_split[1];

        console.log(user, file_split);    

        if (file_ext === 'png' || file_ext === 'jpg' || file_ext === 'gif') {
            User.findByIdAndUpdate(userId, { image: file_name }, { new: true })
                .then(userUpdated => {
                    if (!userUpdated) {
                        res.status(404).send({ message: 'Unable to update user' });

                    } else {
                        res.status(200).send({ user: userUpdated });

                    }
                })
                .catch(err => {
                    res.status(500).send({ message: 'Error updating user', error: err });

                });
        } else {
            res.status(400).send({ message: 'Invalid extension' });

        }
    } else {
        res.status(400).send({ message: 'You have not uploaded an image' });

    }
}


function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function(exist) {
        if (exist) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({ message: 'Image does not exist' });
        }
    });
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
};
