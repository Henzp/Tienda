const express = require('express');
const router = express.Router();
const Categoria = require('../models/categoria');
// Los middlewares están comentados temporalmente
// const { isAuth, isAdmin } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// Configuración de multer para imágenes
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../../src/assets/categorias'));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Límite de 2MB
  fileFilter: function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  }
});

// Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    console.log('Accediendo a ruta GET /categorias');
    const categorias = await Categoria.find();
    console.log('Categorías encontradas:', categorias.length);
    res.json(categorias);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ mensaje: error.message });
  }
});

// Obtener una categoría por ID
router.get('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id);
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Crear nueva categoría
router.post('/', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, activa } = req.body;
    
    // Verificar si ya existe una categoría con el mismo nombre
    const categoriaExistente = await Categoria.findOne({ nombre });
    if (categoriaExistente) {
      return res.status(400).json({ mensaje: 'Ya existe una categoría con ese nombre' });
    }
    
    // Crear ruta de imagen si se ha subido una
    const imagen = req.file ? `/assets/categorias/${req.file.filename}` : '';
    
    const categoria = new Categoria({
      nombre,
      descripcion,
      activa: activa === 'true',
      imagen
    });
    
    await categoria.save();
    res.status(201).json({ mensaje: 'Categoría creada exitosamente', categoria });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ mensaje: 'Error al crear categoría', error: error.message });
  }
});

// Actualizar categoría existente
router.put('/:id', upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, descripcion, activa } = req.body;
    
    // Verificar si existe otra categoría con el mismo nombre (excepto esta misma)
    const categoriaExistente = await Categoria.findOne({ 
      nombre, 
      _id: { $ne: req.params.id } 
    });
    
    if (categoriaExistente) {
      return res.status(400).json({ mensaje: 'Ya existe otra categoría con ese nombre' });
    }
    
    const categoriaActualizada = {
      nombre,
      descripcion,
      activa: activa === 'true'
    };
    
    // Si se subió una nueva imagen
    if (req.file) {
      categoriaActualizada.imagen = `/assets/categorias/${req.file.filename}`;
    }
    
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      categoriaActualizada,
      { new: true }
    );
    
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    res.json({ mensaje: 'Categoría actualizada exitosamente', categoria });
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    res.status(500).json({ mensaje: 'Error al actualizar categoría', error: error.message });
  }
});

// Eliminar categoría
router.delete('/:id', async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    
    if (!categoria) {
      return res.status(404).json({ mensaje: 'Categoría no encontrada' });
    }
    
    res.json({ mensaje: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    res.status(500).json({ mensaje: 'Error al eliminar categoría', error: error.message });
  }
});

module.exports = router;