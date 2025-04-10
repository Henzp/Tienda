const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  descripcionLarga: { type: String },
  precio: { type: Number, required: true },
  imagenUrl: { type: String, required: true },
  imagenesAdicionales: [String],
  categoria: { type: String, required: true },
  subcategoria: { type: String },
  destacado: { type: Boolean, default: false },
  sku: { type: String },
  marca: { type: String }
});

module.exports = mongoose.model('Producto', productoSchema);