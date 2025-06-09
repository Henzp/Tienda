// backend/scripts/verificar-productos.js
const mongoose = require('mongoose');
const Producto = require('../models/producto');
require('dotenv').config();

async function verificarProductos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Contar productos por categoría
    const categorias = await Producto.aggregate([
      { $group: { _id: "$categoria", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('Productos por categoría:');
    categorias.forEach(cat => {
      console.log(`- ${cat._id}: ${cat.count} productos`);
    });

    const totalProductos = await Producto.countDocuments();
    console.log(`\nTotal de productos en la base de datos: ${totalProductos}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

verificarProductos();