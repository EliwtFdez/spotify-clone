'use strict';

const bcrypt = require('bcrypt-nodejs');
const User = require('../models/user');
const crypto = require('crypto');

function pruebas(req, res) {
    res.status(200).send({
        Message: 'Probando una acción del controlador'
    });
}

function encryptData(data) {
    const algorithm = 'aes-256-cbc';
    const key = crypto.randomBytes(32);
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
    let encrypted = cipher.update(data);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex'), key: key.toString('hex') };
}

function saveUser(req, res) {
    const params = req.body;

    console.log(params);

    if (!params.password || !params.name || !params.surname || !params.email) {
        return res.status(400).send({ Message: 'Enter all required fields' });
    }

    const encryptedName = encryptData(params.name);
    const encryptedSurname = encryptData(params.surname);
    const encryptedEmail = encryptData(params.email);

    const user = new User({
        name: encryptedName.encryptedData,
        surname: encryptedSurname.encryptedData,
        email: encryptedEmail.encryptedData,
        role: 'ROLE-ADMIN',
        image: 'null'
    });

    if (params.password) {
        bcrypt.hash(params.password, null, null, (err, hash) => {
            if (err) {
                return res.status(500).send({ Message: 'Error encrypting password' });
            }
            user.password = hash;

            user.save()
                .then(userStored => {
                    if (!userStored) {
                        return res.status(404).send({ Message: 'User not registered' });
                    }
                    res.status(200).send({ user: userStored });
                })
                .catch(() => res.status(500).send({ Message: 'Error saving user' }));
        });
    } else {
        res.status(400).send({ Message: 'Enter password' });
    }
}


function loginUser(req,res){
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email.toLowerCase() })
    .then(user => {
        if (!user) {
            return res.status(404).send({ Message: 'User does not exist' });
        }

        bcrypt.compare(password, user.password, (err, check) => {
            if (err) {
                return res.status(500).send({ Message: 'Error checking password' });
            }
            if (check) {
                // Retornar datos del usuario logueado
                return res.status(200).send({ user });
            } else {
                return res.status(400).send({ Message: 'Incorrect password' });
            }
        });
    })
    .catch(err => res.status(500).send({ Message: 'Error in request' }));
}

module.exports = {
    pruebas,
    saveUser,
    loginUser
};
