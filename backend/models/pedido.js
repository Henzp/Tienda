// models/pedido.js
const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  productos: [{
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: true
    },
    nombre: String,
    precio: Number,
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    imagenUrl: String
  }],
  datosEnvio: {
    nombre: {
      type: String,
      required: true
    },
    apellido: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    telefono: {
      type: String,
      required: true
    },
    direccion: {
      type: String,
      required: true
    },
    ciudad: {
      type: String,
      required: true
    },
    codigoPostal: {
      type: String,
      required: true
    },
    provincia: String,
    pais: {
      type: String,
      default: 'Chile'
    },
    instrucciones: String
  },
  metodoPago: {
    type: String,
    enum: ['tarjeta', 'transferencia', 'contrarembolso'],
    required: true
  },
  metodoEnvio: {
    tipo: {
      type: String,
      enum: ['estandar', 'express'],
      default: 'estandar'
    },
    costo: {
      type: Number,
      default: 0
    }
  },
  estado: {
    type: String,
    enum: ['pendiente', 'pagado', 'en_proceso', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  },
  numeroPedido: {
    type: String,
    unique: true
  }
});

// Middleware para generar un número de pedido único antes de guardar
pedidoSchema.pre('save', async function(next) {
  if (!this.numeroPedido) {
    // Generar número de pedido con formato: 'MMYY-XXXXX' (mes, año, contador)
    const fecha = new Date();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear().toString().slice(-2);
    const prefix = `${mes}${año}-`;
    
    // Encontrar el último pedido para incrementar el contador
    const ultimoPedido = await this.constructor.findOne({
      numeroPedido: { $regex: '^' + prefix }
    }).sort({ numeroPedido: -1 });
    
    let contador = 1;
    if (ultimoPedido && ultimoPedido.numeroPedido) {
      const ultimoContador = parseInt(ultimoPedido.numeroPedido.split('-')[1]);
      if (!isNaN(ultimoContador)) {
        contador = ultimoContador + 1;
      }
    }
    
    this.numeroPedido = `${prefix}${contador.toString().padStart(5, '0')}`;
  }
  next();
});

const Pedido = mongoose.model('Pedido', pedidoSchema);

module.exports = Pedido;