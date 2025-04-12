const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const { generarToken } = require('../config/jwt');
const { isAuth } = require('../middlewares/auth');

// Registro de usuario
router.post('/registro', async (req, res) => {
  try {
    const { email, password, nombre } = req.body;
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    
    // Crear nuevo usuario
    const usuario = new Usuario({
      email,
      password,
      nombre,
      // Para el primer usuario, puedes asignarle rol de admin
      rol: await Usuario.countDocuments() === 0 ? 'admin' : 'usuario'
    });
    
    await usuario.save();
    
    // Generar token
    const token = generarToken(usuario);
    
    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      token
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    // Verificar contraseña
    const passwordValida = await usuario.compararPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
    
    // Generar token
    const token = generarToken(usuario);
    
    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario._id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      },
      token
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
});

// Obtener perfil del usuario autenticado
router.get('/perfil', isAuth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
  }
});

module.exports = router;