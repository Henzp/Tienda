const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    unique: true
  },
  descripcion: { 
    type: String 
  },
  activa: {
    type: Boolean,
    default: true
  },
  imagen: {
    type: String
  },
  fechaCreacion: { 
    type: Date, 
    default: Date.now 
  }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

module.exports = Categoria;