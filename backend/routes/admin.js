const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
const { isAuth, isAdmin } = require('../middlewares/auth');
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

// Middleware para verificar que es administrador
router.use(isAuth, isAdmin);

// Obtener todos los productos (para admin)
router.get('/productos', async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos', error: error.message });
  }
});

// Crear nuevo producto
router.post('/productos', upload.single('imagen'), async (req, res) => {
  try {
    const { 
      nombre, descripcion, descripcionLarga, precio, 
      categoria, subcategoria, destacado, sku, marca, stock 
    } = req.body;
    
    // Crear ruta relativa para la imagen
    const imagenUrl = req.file ? `/assets/productos/${req.file.filename}` : '';
    
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      descripcionLarga,
      precio: Number(precio),
      imagenUrl,
      categoria,
      subcategoria,
      destacado: destacado === 'true',
      sku,
      marca,
      stock: Number(stock)
    });
    
    await nuevoProducto.save();
    
    res.status(201).json({ 
      mensaje: 'Producto creado exitosamente', 
      producto: nuevoProducto 
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear producto', error: error.message });
  }
});

// Actualizar producto existente
router.put('/productos/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { 
      nombre, descripcion, descripcionLarga, precio, 
      categoria, subcategoria, destacado, sku, marca, stock 
    } = req.body;
    
    const productoActualizado = {
      nombre,
      descripcion,
      descripcionLarga,
      precio: Number(precio),
      categoria,
      subcategoria,
      destacado: destacado === 'true',
      sku,
      marca,
      stock: Number(stock)
    };
    
    // Si se subió una nueva imagen
    if (req.file) {
      productoActualizado.imagenUrl = `/assets/productos/${req.file.filename}`;
    }
    
    const producto = await Producto.findByIdAndUpdate(
      req.params.id, 
      productoActualizado,
      { new: true }
    );
    
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json({ mensaje: 'Producto actualizado exitosamente', producto });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ mensaje: 'Error al actualizar producto', error: error.message });
  }
});

// Eliminar producto
router.delete('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ mensaje: 'Error al eliminar producto', error: error.message });
  }
});

// Subir varias imágenes adicionales para un producto
router.post('/productos/:id/imagenes', upload.array('imagenes', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ mensaje: 'No se subieron imágenes' });
    }
    
    const imagenesAdicionales = req.files.map(file => `/assets/productos/${file.filename}`);
    
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    // Agregar las nuevas imágenes a las existentes
    const nuevasImagenes = [...(producto.imagenesAdicionales || []), ...imagenesAdicionales];
    
    // Actualizar el producto
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      { imagenesAdicionales: nuevasImagenes },
      { new: true }
    );
    
    res.json({
      mensaje: 'Imágenes subidas exitosamente',
      producto: productoActualizado
    });
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    res.status(500).json({ mensaje: 'Error al subir imágenes', error: error.message });
  }
});

module.exports = router;