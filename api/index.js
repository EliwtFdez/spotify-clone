'use strict';

const mongoose = require('mongoose');
const app = require('./app');

// Conexión a la base de datos
mongoose.Promise = global.Promise;

const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Spotify-Clone';

mongoose.connect(dbURI)
  .then(() => console.log('Base de datos conectada'))
  .catch(err => console.error('Error conectando a la base de datos:', err));

mongoose.connection.on('error', err => {
  console.error(`Error de conexión a MongoDB: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Desconectado de MongoDB. Intentando reconectar...');
  mongoose.connect(dbURI)
    .then(() => console.log('Re-conectado a la base de datos'))
    .catch(err => console.error('Error reconectando a la base de datos:', err));
});

// Puerto del servidor
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
  console.log(dbURI);
});
