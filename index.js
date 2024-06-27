'use strict';

const mongoose = require('mongoose');
const app = require('./app');

// Conexión a la base de datos
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Spotify-Clone')
  .then(() => console.log('Base de datos conectada'))
  .catch(err => console.error(err));

// app.use('/api', require('./rutas'));

// Puerto del servidor
const port = process.env['PORT'] || 4000;    
    app.listen(port, () => {
    console.log(`Servidor ejecutándose en el puerto ${port}`);
});
