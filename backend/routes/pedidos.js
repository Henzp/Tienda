const express = require('express');
const router = express.Router();
const Pedido = require('../models/pedido');
const Producto = require('../models/producto');
const auth = require('../middlewares/auth');

// IMPORTANTE: Asegúrate de que el middleware auth esté correctamente implementado
// y devuelva una función middleware válida

// Crear un nuevo pedido (ruta protegida)
router.post('/', auth, async (req, res) => {
  try {
    console.log('Recibiendo pedido:', req.body);
    console.log('Usuario autenticado:', req.usuario);
    
    const { productos, datosEnvio, metodoEnvio, metodoPago, subtotal, total } = req.body;
    
    // Validar datos
    if (!productos || !productos.length || !datosEnvio || !metodoPago) {
      return res.status(400).json({ mensaje: 'Datos incompletos' });
    }
    
    // Crear el nuevo pedido
    const nuevoPedido = new Pedido({
      usuario: req.usuario.id, // ID del usuario autenticado
      productos,
      datosEnvio,
      metodoEnvio,
      metodoPago,
      subtotal,
      total
    });
    
    console.log('Creando pedido:', nuevoPedido);
    
    // Actualizar stock de productos
    for (const item of productos) {
      const producto = await Producto.findById(item.producto);
      if (producto) {
        console.log(`Actualizando stock de ${producto.nombre}: ${producto.stock} -> ${Math.max(0, producto.stock - item.cantidad)}`);
        // Restar la cantidad comprada del stock
        producto.stock = Math.max(0, producto.stock - item.cantidad);
        await producto.save();
      }
    }
    
    // Guardar el pedido
    const pedidoGuardado = await nuevoPedido.save();
    console.log('Pedido guardado exitosamente:', pedidoGuardado);
    
    res.status(201).json({ 
      mensaje: 'Pedido creado exitosamente', 
      pedido: pedidoGuardado 
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);
    res.status(500).json({ 
      mensaje: 'Error al procesar el pedido', 
      error: error.toString() 
    });
  }
});

// Obtener todos los pedidos de un usuario
router.get('/usuario', auth, async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuario.id })
      .sort({ fechaCreacion: -1 }); // Ordenar del más reciente al más antiguo
    
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener pedidos', 
      error: error.toString() 
    });
  }
});

// NUEVA RUTA: Obtener todos los pedidos para admin (coincide con frontend)
router.get('/todos', auth, async (req, res) => {
  try {
    console.log('Usuario intentando acceder a todos los pedidos:', req.usuario);
    
    // Verificar si el usuario es admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver todos los pedidos' });
    }
    
    // Obtener todos los pedidos ordenados por fecha
    const pedidos = await Pedido.find({})
      .sort({ fechaCreacion: -1 })
      .populate('usuario', 'nombre email');
    
    console.log(`Se encontraron ${pedidos.length} pedidos`);
    
    res.json(pedidos);
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener pedidos', 
      error: error.toString() 
    });
  }
});

// Obtener un pedido específico por ID
router.get('/:id', auth, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('usuario', 'nombre email');
    
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    
    // Verificar que el pedido pertenezca al usuario autenticado
    // (a menos que sea un administrador)
    if (pedido.usuario._id.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este pedido' });
    }
    
    res.json(pedido);
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener el pedido', 
      error: error.toString() 
    });
  }
});

// Actualizar el estado de un pedido (solo admins)
router.put('/:id/estado', auth, async (req, res) => {
  try {
    // Verificar si el usuario es admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para actualizar estados de pedidos' });
    }
    
    const { estado } = req.body;
    
    if (!estado) {
      return res.status(400).json({ mensaje: 'El estado es requerido' });
    }
    
    // Validar que el estado sea válido
    const estadosValidos = ['pendiente', 'pagado', 'en_proceso', 'enviado', 'entregado', 'cancelado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado no válido' });
    }
    
    const pedido = await Pedido.findById(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    
    // Actualizar el estado y la fecha de actualización
    pedido.estado = estado;
    pedido.fechaActualizacion = Date.now();
    
    await pedido.save();
    
    res.json({ 
      mensaje: 'Estado del pedido actualizado exitosamente', 
      pedido 
    });
  } catch (error) {
    console.error('Error al actualizar estado de pedido:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar el estado del pedido', 
      error: error.toString() 
    });
  }
});

// Cancelar un pedido (solo el usuario propietario o admin)
router.patch('/:id/cancelar', auth, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    
    // Verificar que el pedido pertenezca al usuario o sea admin
    if (pedido.usuario.toString() !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para cancelar este pedido' });
    }
    
    // Verificar que el pedido esté en un estado que permita cancelación
    const estadosCancelables = ['pendiente', 'pagado'];
    if (!estadosCancelables.includes(pedido.estado)) {
      return res.status(400).json({ 
        mensaje: 'No se puede cancelar un pedido que ya está en proceso, enviado o entregado' 
      });
    }
    
    // Actualizar el estado y la fecha de actualización
    pedido.estado = 'cancelado';
    pedido.fechaActualizacion = Date.now();
    
    // Devolver los productos al stock
    for (const item of pedido.productos) {
      const producto = await Producto.findById(item.producto);
      if (producto) {
        // Sumar la cantidad al stock nuevamente
        producto.stock += item.cantidad;
        await producto.save();
      }
    }
    
    await pedido.save();
    
    res.json({ 
      mensaje: 'Pedido cancelado exitosamente', 
      pedido 
    });
  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    res.status(500).json({ 
      mensaje: 'Error al cancelar el pedido', 
      error: error.toString() 
    });
  }
});

// Obtener todos los pedidos con paginación (solo admins) - Ruta original
router.get('/', auth, async (req, res) => {
  try {
    // Verificar si el usuario es admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver todos los pedidos' });
    }
    
    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Filtros
    const filtros = {};
    
    if (req.query.estado) {
      filtros.estado = req.query.estado;
    }
    
    if (req.query.desde && req.query.hasta) {
      filtros.fechaCreacion = {
        $gte: new Date(req.query.desde),
        $lte: new Date(req.query.hasta)
      };
    }
    
    // Contar total de documentos para la paginación
    const total = await Pedido.countDocuments(filtros);
    
    // Obtener pedidos con paginación
    const pedidos = await Pedido.find(filtros)
      .sort({ fechaCreacion: -1 })
      .skip(skip)
      .limit(limit)
      .populate('usuario', 'nombre email');
    
    res.json({
      pedidos,
      paginacion: {
        total,
        paginas: Math.ceil(total / limit),
        paginaActual: page,
        porPagina: limit
      }
    });
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    res.status(500).json({ 
      mensaje: 'Error al obtener pedidos', 
      error: error.toString() 
    });
  }
});

module.exports = router;