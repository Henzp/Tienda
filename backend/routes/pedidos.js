const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedido');
const Producto = require('../models/producto');
const { isAuth } = require('../middlewares/auth');

// Crear un nuevo pedido
router.post('/', isAuth, async (req, res) => {
  try {
    console.log('Creando nuevo pedido para usuario:', req.usuario.email);
    const { productos, datosEnvio, metodoPago, metodoEnvio } = req.body;
    
    // Validar que hay productos
    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: 'El pedido debe contener al menos un producto' });
    }
    
    // Verificar el stock de cada producto
    for (const item of productos) {
      const producto = await Producto.findById(item.producto);
      
      if (!producto) {
        return res.status(404).json({ 
          mensaje: `Producto con ID ${item.producto} no encontrado` 
        });
      }
      
      if (producto.stock < item.cantidad) {
        return res.status(400).json({ 
          mensaje: `Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}` 
        });
      }
    }
    
    // Calcular subtotal y total
    let subtotal = 0;
    productos.forEach(item => {
      subtotal += item.precio * item.cantidad;
    });
    
    const costoEnvio = metodoEnvio?.costo || 0;
    const total = subtotal + costoEnvio;
    
    // Crear el pedido - adaptado para tu sistema de autenticación
    const nuevoPedido = new Pedido({
      usuario: req.usuario._id, // Asegúrate de que req.usuario tenga _id
      productos,
      datosEnvio,
      metodoPago,
      metodoEnvio: {
        tipo: metodoEnvio?.tipo || 'estandar',
        costo: costoEnvio
      },
      subtotal,
      total
    });
    
    // Guardar el pedido
    const pedidoGuardado = await nuevoPedido.save();
    
    // Actualizar stock de productos
    for (const item of productos) {
      await Producto.findByIdAndUpdate(item.producto, {
        $inc: { stock: -item.cantidad }
      });
    }
    
    console.log('Pedido creado exitosamente:', pedidoGuardado.numeroPedido);
    res.status(201).json({
      mensaje: 'Pedido creado exitosamente',
      pedido: pedidoGuardado
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ mensaje: 'Error al crear pedido', error: error.message });
  }
});

// Obtener todos los pedidos del usuario
router.get('/mis-pedidos', isAuth, async (req, res) => {
  try {
    console.log('Obteniendo pedidos para usuario:', req.usuario.email);
    const pedidos = await Pedido.find({ usuario: req.usuario._id })
      .sort({ fechaCreacion: -1 });
    
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ mensaje: 'Error al obtener pedidos', error: error.message });
  }
});

// Obtener un pedido específico del usuario
router.get('/mis-pedidos/:id', isAuth, async (req, res) => {
  try {
    console.log('Obteniendo pedido específico:', req.params.id);
    const pedido = await Pedido.findOne({
      _id: req.params.id,
      usuario: req.usuario._id
    }).populate('productos.producto');
    
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    
    res.json(pedido);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ mensaje: 'Error al obtener pedido', error: error.message });
  }
});

module.exports = router;