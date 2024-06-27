'úse strict';

var express = require ('express');
var UserController = require('../controller/user');
var md_auth = require ('../middleswares/authentication');
var multipart = require('connect-multiparty');

var api = express.Router();
var md_upload = multipart({ uploadDir: './uploads/users'});


api.get('/DevController', md_auth.ensureAuth, UserController.pruebas);
api.get('/Login', UserController.loginUser);
api.get('/Register', UserController.saveUser);
api.put('/UpdateUser/:id',md_auth.ensureAuth, UserController.updateUser)

module.exports = api;