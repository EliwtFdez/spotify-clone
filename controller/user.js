'use strict';

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
var jwt = require('../services/jwt')

function pruebas(req, res) {
    res.status(200).send({ message: 'Probando una acción del controlador' });
}

async function saveUser(req, res) {
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

    bcrypt.hash(params.password, null, null, async function (err, hash) {
        if (err) {
            return res.status(500).send({ message: 'Error encrypting password' });
        }
        user.password = hash;

        try {
            const userStored = await user.save();
            if (!userStored) {
                return res.status(404).send({ message: 'User not registered' });
            }
            res.status(200).send({ user: userStored });
        } catch (error) {
            res.status(500).send({ message: 'Error saving user' });
        }
    });
}

async function loginUser(req, res) {
    const params = req.body;
    const email = params.email ? params.email.toLowerCase() : '';
    const password = params.password;

    if (!email || !password) {
        return res.status(400).send({ message: 'Enter all required fields' });
    }

    try {
        console.log(`Found user with email: ${email}`);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User no found');
            return res.status(404).send({ message: 'User does not exist' });
        }

        console.log('Usuario encontrado:', user);
    
        bcrypt.compare(password, user.password, function (err, check) { 
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
    
    } catch (error) {
        console.log('Error en la solicitud:', error);
        return res.status(500).send({ message: 'Error in request' });
    }
}

async function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    try {
        const userUpdated = await User.findByIdAndUpdate(userId, update, { new: true });
        if (!userUpdated) {
            return res.status(404).send({ message: 'Unable to update user' });
        }
        return res.status(200).send({ user: userUpdated });
    } catch (err) {
        return res.status(500).send({ message: 'Error updating the user' });
    }
}

async function uploadImages(req, res){
    
}

module.exports = {
    pruebas,
    saveUser,
    loginUser,
    updateUser
};
