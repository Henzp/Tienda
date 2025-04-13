// E:\Proyecto\tienda\backend\routes\auth.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Ruta para registro de usuario
router.post('/registro', async (req, res) => {
  try {
    console.log('Intentando registrar usuario:', req.body);
    const { nombre, email, password } = req.body;
    
    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    
    // Determinar si es el primer usuario (para asignarle rol admin)
    const count = await Usuario.countDocuments();
    const rol = count === 0 ? 'admin' : 'usuario';
    
    // Crear nuevo usuario
    const usuario = new Usuario({
      nombre,
      email,
      password, // Se encriptará en el middleware pre-save
      rol
    });
    
    await usuario.save();
    
    // Generar token JWT
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      'clave_secreta_jwt', // Deberías usar una variable de entorno para esto
      { expiresIn: '24h' }
    );
    
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

// Ruta para login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    // Verificar contraseña - asegúrate de usar bcrypt.compare
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
    
    // Generar token
    const token = jwt.sign(
      { id: usuario._id, email: usuario.email, rol: usuario.rol },
      'clave_secreta_jwt',
      { expiresIn: '24h' }
    );
    
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

module.exports = router;