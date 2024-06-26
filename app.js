'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var use_routes = require('./routes/user');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



//Rutas
app.use('/api', use_routes );

module.exports = app;
