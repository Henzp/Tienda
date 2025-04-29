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
// Añade esto después de tus rutas GET existentes, antes de module.exports = router;

// RUTA POST - Crear un nuevo producto
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    console.log('Intentando crear un nuevo producto...');
    console.log('Datos recibidos:', req.body);
    
    let imagenUrl = '';
    if (req.file) {
      // Construir la URL relativa de la imagen
      imagenUrl = `/assets/productos/${req.file.filename}`;
      console.log('Imagen guardada:', imagenUrl);
    }
    
    const productoData = {
      ...req.body,
      imagenUrl: imagenUrl,
      precio: Number(req.body.precio),
      stock: Number(req.body.stock),
      destacado: req.body.destacado === 'true'
    };
    
    const nuevoProducto = new Producto(productoData);
    await nuevoProducto.save();
    
    console.log('Producto creado exitosamente:', nuevoProducto._id);
    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      producto: nuevoProducto
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ 
      mensaje: 'Error al crear el producto', 
      error: error.toString() 
    });
  }
});

// RUTA PUT - Actualizar un producto existente
router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    console.log(`Intentando actualizar el producto con ID: ${req.params.id}`);
    console.log('Datos recibidos:', req.body);
    
    // Buscar el producto existente
    const productoExistente = await Producto.findById(req.params.id);
    if (!productoExistente) {
      console.log(`Producto con ID ${req.params.id} no encontrado`);
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    // Preparar datos para actualizar
    const productoData = { ...req.body };
    
    // Convertir tipos
    if (productoData.precio) productoData.precio = Number(productoData.precio);
    if (productoData.stock) productoData.stock = Number(productoData.stock);
    if (productoData.destacado !== undefined) {
      productoData.destacado = productoData.destacado === 'true' || productoData.destacado === true;
    }
    
    // Actualizar imagen solo si se envió una nueva
    if (req.file) {
      // Construir la URL relativa de la imagen
      productoData.imagenUrl = `/assets/productos/${req.file.filename}`;
      console.log('Nueva imagen guardada:', productoData.imagenUrl);
    }
    
    // Actualizar el producto
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      productoData,
      { new: true } // Devolver el documento actualizado
    );
    
    console.log('Producto actualizado exitosamente');
    res.json({
      mensaje: 'Producto actualizado exitosamente',
      producto: productoActualizado
    });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ 
      mensaje: 'Error al actualizar el producto', 
      error: error.toString() 
    });
  }
});

// RUTA DELETE - Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Intentando eliminar el producto con ID: ${req.params.id}`);
    
    const resultado = await Producto.findByIdAndDelete(req.params.id);
    if (!resultado) {
      console.log(`Producto con ID ${req.params.id} no encontrado`);
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    
    console.log('Producto eliminado exitosamente');
    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ 
      mensaje: 'Error al eliminar el producto', 
      error: error.toString() 
    });
  }
});
module.exports = router;