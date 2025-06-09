const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  asunto: {
    type: String,
    required: true
  },
  mensaje: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  leido: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Mensaje', mensajeSchema);