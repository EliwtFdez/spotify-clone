'use strict';

var jwt = require('jwt-simple');
var moment = require ('moment');
var secret = 'clave_top_Secret_UwU?';

exports.ensureAuth = function(req, res, next){
    if (!req.header.authorization) 
    {
        return res.status(403).send({menssage: 'The peticion no have header'});
        
    }
    var token = req.authorization.replace(/['"]+/g,'')
  
    try 
    {
        var payload = jwt.decode(token,secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({menssage: 'Token expired'});

        }

    } 
    catch (ex)
    {
        console.log(ex);
        return res.status(404).send({menssage: 'Invalide Token'});
    }

    req.user = payload;
    next();

};