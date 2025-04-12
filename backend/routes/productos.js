const express = require('express');
const router = express.Router();
const Producto = require('../models/producto');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Obtener productos por categoría
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const productos = await Producto.find({ categoria: req.params.categoria });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Obtener productos por subcategoría
router.get('/subcategoria/:subcategoria', async (req, res) => {
  try {
    const productos = await Producto.find({ subcategoria: req.params.subcategoria });
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

router.get('/destacados', async (req, res) => {
  try {
    const productos = await Producto.find({ destacado: true });
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos destacados:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// Obtener todas las categorías
router.get('/categorias/lista', async (req, res) => {
  try {
    const categorias = await Producto.distinct('categoria');
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Obtener todas las subcategorías de repuestos
router.get('/subcategorias/repuestos', async (req, res) => {
  try {
    const subcategorias = await Producto.distinct('subcategoria', { categoria: 'Repuestos' });
    res.json(subcategorias);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;