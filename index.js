'use strict';

const mongoose = require('mongoose');
const app = require('./app');

// Conexión a la base de datos
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/Spotify-Clone', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Base de datos conectada'))
  .catch(err => console.error(err));

// Puerto del servidor
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Servidor ejecutándose en el puerto ${port}`);
});
