'use strict';

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const crypto = require('crypto');

function pruebas(req, res) {
    res.status(200).send({
        Message: 'Probando una acción del controlador'
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    console.log(params);

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';
    
    if (params.password) {
        // Encriptar contraseña
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
    
            if (user.name != null && user.surname != null && user.email != null) {
                // Guardar el usuario   
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: 'Error al guardar el usuario' });
                    } else {
                        if (!userStored) {
                            res.status(500).send({ message: 'Error al guardar el usuario' });
                        } else {
                            // Código adicional para manejar el caso exitoso
                            res.status(200).send({ user: userStored});

                        }
                    }
                });
            }
        });
    }
}
    
function loginUser(req, res) {
    var params = req.body;

    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'Error en la petición' });
        } else {
            if (!user) {
                res.status(404).send({ message: 'El usuario no existe' });
            } else {
                // Comprobar la contraseña
                bcrypt.compare(password, user.password, function(err, check) {
                    // Código adicional para manejar el resultado de la comparación
                    if(check){
                        if(params.gethash){

                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({message: 'User could not login'});
                    }
                });
            }
        }
    });
}


module.exports = {
    pruebas,
    saveUser,
    loginUser
};
