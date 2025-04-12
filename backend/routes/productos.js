const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');

// IMPORTANTE: Las rutas específicas deben ir ANTES de las rutas con parámetros
// 1. Ruta para obtener productos destacados - DEBE IR PRIMERO
router.get('/destacados', async (req, res) => {
  try {
    console.log('Buscando productos destacados...');
    const productos = await Producto.find({ destacado: true });
    console.log(`Se encontraron ${productos.length} productos destacados`);
    res.json(productos);
  } catch (error) {
    console.error('Error completo al obtener productos destacados:', error);
    res.status(500).json({ mensaje: 'Error al obtener productos destacados', error: error.toString() });
  }
});

// 2. Ruta para obtener todas las categorías - DEBE IR ANTES DE /:id
router.get('/categorias/lista', async (req, res) => {
  try {
    const categorias = await Producto.distinct('categoria');
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// 3. Obtener productos por categoría - DEBE IR ANTES DE /:id
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: req.params.categoria });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// 4. Obtener productos por subcategoría - DEBE IR ANTES DE /:id
router.get('/subcategoria/:subcategoria', async (req, res) => {
  try {
    const productos = await Producto.find({ subcategoria: req.params.subcategoria });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos por subcategoría:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// 5. Obtener todas las subcategorías de repuestos - DEBE IR ANTES DE /:id
router.get('/subcategorias/repuestos', async (req, res) => {
  try {
    const subcategorias = await Producto.distinct('subcategoria', { categoria: 'Repuestos' });
    res.json(subcategorias);
  } catch (error) {
    console.error('Error al obtener subcategorías:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// 6. Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// 7. Obtener un producto por ID - DEBE IR AL FINAL
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    console.error('Error al obtener producto por ID:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;