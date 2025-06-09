const mongoose = require('mongoose');
const Producto = require('../models/producto');
require('dotenv').config();

// Ejemplo de un producto
const productoEjemplo = {
  nombre: 'Casco Integral Ejemplo',
  descripcion: 'Casco integral para máxima protección en moto',
  precio: 189990,
  imagenUrl: 'assets/casco.jpg',
  categoria: 'Cascos',
  destacado: true,
  sku: '111111',
  marca: 'CASCO'
};

async function agregarProducto() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Crear y guardar el producto
    const nuevoProducto = new Producto(productoEjemplo);
    const resultado = await nuevoProducto.save();
    console.log('Producto agregado:', resultado);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

agregarProducto();