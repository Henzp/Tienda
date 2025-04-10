// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Importar rutas
const productosRoutes = require('./routes/productos');
// Comentamos o eliminamos la línea que causa el error:
// const usuariosRoutes = require('./routes/usuarios');

// Configurar app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// Usar rutas
app.use('/api/productos', productosRoutes);
// Comentamos esta línea también:
// app.use('/api/usuarios', usuariosRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('API de la tienda de motos funcionando');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});