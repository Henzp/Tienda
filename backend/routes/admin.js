const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
// Comentamos temporalmente los middlewares
// const { isAuth, isAdmin } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../src/assets/productos'));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB
  fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  }
});

// Comentamos este middleware que aplica a todas las rutas
// router.use(isAuth, isAdmin);

// Obtener todos los productos (para admin)
router.get('/productos', async (req, res) => {
  try {
    console.log('Accediendo a ruta GET /admin/productos');
    const productos = await Producto.find().sort({ createdAt: -1 });
    console.log('Productos encontrados:', productos.length);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});

// El resto de rutas igual pero sin middleware de autenticación
// ...resto del código sin cambios...

module.exports = router;