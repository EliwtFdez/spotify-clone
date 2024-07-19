'use strict';

var express = require ('express');
var UserController = require('../controller/user');
var md_auth = require ('../middleswares/authentication');
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads/users'});
var api = express.Router();


api.get('/DevController', md_auth.ensureAuth, UserController.pruebas);
api.post('/Login', UserController.loginUser);
api.post('/Register', UserController.saveUser);
api.put('/UpdateUser/:id',md_auth.ensureAuth, UserController.updateUser)

api.post('/Upload-images-user/:id', [md_auth.ensureAuth, md_upload] , UserController.uploadImage);
api.get('/Get-image-file/:imageFile', UserController.getImageFile);


module.exports = api;