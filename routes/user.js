'úse strict';

var express = require ('express');
var UserController = require('../controller/user');

var api = express.Router();

api.get('/DevController', UserController.pruebas);
api.get('/Login', UserController.loginUser);
api.get('/Register', UserController.saveUser);

module.exports = api;