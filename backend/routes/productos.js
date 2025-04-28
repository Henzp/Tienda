// backend/routes/productos.js (completo con todas las rutas)
const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');
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

// Configuración básica de multer
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

console.log('Cargando rutas de productos...');

// RUTAS GET

// 1. Ruta para obtener productos destacados
router.get('/destacados', async (req, res) => {
  try {
    console.log('Buscando productos destacados...');
    const productos = await Producto.find({ destacado: true });
    console.log(`Se encontraron ${productos.length} productos destacados`);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos destacados', error: error.toString() });
  }
});

// 2. Ruta para obtener todas las categorías
router.get('/categorias/lista', async (req, res) => {
  try {
    console.log('Obteniendo lista de categorías...');
    const categorias = await Producto.distinct('categoria');
    console.log('Categorías encontradas:', categorias);
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// 3. Obtener productos por categoría
router.get('/categoria/:categoria', async (req, res) => {
  try {
    console.log(`Buscando productos con categoría: "${req.params.categoria}"`);
    
    const productos = await Producto.find({
      categoria: { 
        $regex: new RegExp('^' + req.params.categoria + '$', 'i') 
      }
    });
    
    console.log(`Se encontraron ${productos.length} productos en la categoría ${req.params.categoria}`);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// 4. Obtener productos por subcategoría
router.get('/subcategoria/:subcategoria', async (req, res) => {
  try {
    console.log(`Buscando productos con subcategoría: "${req.params.subcategoria}"`);
    
    const productos = await Producto.find({
      subcategoria: { 
        $regex: new RegExp(req.params.subcategoria, 'i') 
      }
    });
    
    console.log(`Se encontraron ${productos.length} productos en la subcategoría ${req.params.subcategoria}`);
    
    if (productos.length === 0) {
      const todasSubcategorias = await Producto.distinct('subcategoria');
      console.log('Subcategorías disponibles:', todasSubcategorias);
    }
    
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos por subcategoría:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// 5. Obtener todas las subcategorías de repuestos
router.get('/subcategorias/repuestos', async (req, res) => {
  try {
    console.log('Obteniendo subcategorías de repuestos...');
    const subcategorias = await Producto.distinct('subcategoria', { 
      categoria: { $regex: /^repuestos$/i } 
    });
    console.log('Subcategorías encontradas:', subcategorias);
    res.json(subcategorias);
  } catch (error) {
    console.error('Error al obtener subcategorías:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// 6. Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    console.log('Obteniendo todos los productos...');
    const productos = await Producto.find();
    console.log(`Total de productos: ${productos.length}`);
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// 7. Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    console.log(`Buscando producto con ID: ${req.params.id}`);
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      console.log(`Producto con ID ${req.params.id} no encontrado`);
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// RUTAS POST, PUT, DELETE (tu código existente)
// ...

module.exports = router;