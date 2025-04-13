const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const { isAuth, isAdmin } = require('../middlewares/auth');

// Obtener todos los usuarios (solo admin)
router.get('/', isAuth, isAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Obtener un usuario por ID
router.get('/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Actualizar un usuario
router.put('/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const { nombre, email, rol } = req.body;
    
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id, 
      { nombre, email, rol },
      { new: true }
    ).select('-password');
    
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    
    res.json({ mensaje: 'Usuario actualizado', usuario });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// Eliminar un usuario
router.delete('/:id', isAuth, isAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;