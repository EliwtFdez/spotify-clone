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

async function saveUser(req, res) {
    const user = new User();
    const params = req.body;

    console.log(params);

    if (!params.password || !params.name || !params.surname || !params.email) {
        return res.status(400).send({ message: 'Enter all required fields' });
    }

    const encryptedName = encryptData(params.name);
    const encryptedSurname = encryptData(params.surname);
    const encryptedEmail = encryptData(params.email);

    user.name = encryptedName.encryptedData;
    user.surname = encryptedSurname.encryptedData;
    user.email = encryptedEmail.encryptedData;
    user.role = 'ROLE_ADMIN';
    user.image = 'null';

    if (params.password) {
        bcrypt.hash(params.password, null, null, async function(err, hash) {
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
    } else {
        res.status(400).send({ message: 'Enter password' });
    }
}

async function loginUser(req, res) {
    const params = req.body;

    const email = params.email;
    const password = params.password;

    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).send({ message: 'User does not exist' });
        }

        bcrypt.compare(password, user.password, function(err, check) {
            if (err) {
                return res.status(500).send({ message: 'Error checking password' });
            }
            if (check) {
                if (params.gethash) {
                    // Add code for token generation here if needed
                } else {
                    res.status(200).send({ user });
                }
            } else {
                res.status(400).send({ message: 'Incorrect password' });
            }
        });
    } catch (error) {
        res.status(500).send({ message: 'Error in request' });
    }
}

module.exports = {
    pruebas,
    saveUser,
    loginUser
};
