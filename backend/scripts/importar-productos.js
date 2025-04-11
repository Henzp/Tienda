const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Producto = require('../models/producto');
require('dotenv').config();

async function importarProductos() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB');

    // Leer el archivo JSON
    const filePath = path.join(__dirname, 'productos.json');
    const productosData = fs.readFileSync(filePath, 'utf8');
    const productos = JSON.parse(productosData);

    // Insertar los productos en la base de datos
    await Producto.insertMany(productos);
    console.log('Productos importados exitosamente');

  } catch (error) {
    console.error('Error al importar productos:', error);
  } finally {
    // Desconectar de MongoDB
    mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

importarProductos();
