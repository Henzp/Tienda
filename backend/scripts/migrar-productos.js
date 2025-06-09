const mongoose = require('mongoose');
const Producto = require('../models/producto');
const productosData = require('./productos-data');
require('dotenv').config();

async function migrarProductos() {
  try {
    // Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    // Verificar si ya hay productos en la base de datos
    const productosExistentes = await Producto.countDocuments();
    if (productosExistentes > 0) {
      console.log(`Ya existen ${productosExistentes} productos en la base de datos.`);
      const confirmar = await pregunta('¿Deseas borrar los productos existentes y cargar los nuevos? (s/n): ');
      
      if (confirmar.toLowerCase() !== 's') {
        console.log('Operación cancelada.');
        return;
      }
      
      // Eliminar productos existentes
      await Producto.deleteMany({});
      console.log('Productos existentes eliminados.');
    }

    // Insertar todos los productos
    const resultado = await Producto.insertMany(productosData);
    console.log(`Se han agregado ${resultado.length} productos a la base de datos.`);
    
    // Mostrar un resumen por categoría
    const categorias = [...new Set(productosData.map(p => p.categoria))];
    for (const categoria of categorias) {
      const count = productosData.filter(p => p.categoria === categoria).length;
      console.log(`- ${categoria}: ${count} productos`);
    }

  } catch (error) {
    console.error('Error al migrar productos:', error);
  } finally {
    mongoose.disconnect();
    console.log('Desconectado de MongoDB');
    process.exit(0);
  }
}

// Función auxiliar para solicitar confirmación
function pregunta(texto) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    readline.question(texto, respuesta => {
      readline.close();
      resolve(respuesta);
    });
  });
}

// Ejecutar la migración
migrarProductos();