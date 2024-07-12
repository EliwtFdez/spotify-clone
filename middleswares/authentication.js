'use strict';

var jwt = require('jwt-simple');
var moment = require('moment');
var secret = 'clave_top_Secret_UwU?';

exports.ensureAuth = function (req, res, next) 
{
    if (!req.headers.authorization) 
    {
        return res.status(403).send({ message: 'The request does not have the authorization header' });

    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    if (token.startsWith('Bearer '))    
    {
        token = token.slice(7, token.length).trim();
    }

    if (!token) 
    {
        return res.status(403).send({ message: 'No token supplied' });
    }

    try
    {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix())
        {
            return res.status(401).send({ message: 'Token expired' });

        }

    } 
    catch (ex) 
    {
      // console.log(ex);
        return res.status(404).send({ message: 'Invalid token' });
    }

    req.user = payload;
    next();
};
