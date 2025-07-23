const express = require('express');
const router = express.Router();
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

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
    
    // CORREGIDO: Usar el mismo JWT_SECRET que el middleware de auth
    const jwtSecret = process.env.JWT_SECRET || 'secretkey';
    console.log('Generando token de registro con secret:', jwtSecret);
    
    const token = jwt.sign(
      { 
        userId: usuario._id,  // IMPORTANTE: usar 'userId' como en el middleware
        id: usuario._id, 
        email: usuario.email, 
        rol: usuario.rol 
      },
      jwtSecret,
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
    console.log('Intento de login para:', req.body.email);
    const { email, password } = req.body;
    
    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      console.log('Usuario no encontrado:', email);
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    console.log('Usuario encontrado:', usuario.email, 'Rol:', usuario.rol);
    
    // Verificar contraseña - asegúrate de usar bcrypt.compare
    const passwordValida = await bcrypt.compare(password, usuario.password);
    
    if (!passwordValida) {
      console.log('Contraseña incorrecta para:', email);
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }
    
    // CORREGIDO: Usar el mismo JWT_SECRET que el middleware de auth
    const jwtSecret = process.env.JWT_SECRET || 'secretkey';
    console.log('Generando token de login con secret:', jwtSecret);
    
    // Generar token con la misma estructura que espera el middleware
    const token = jwt.sign(
      { 
        userId: usuario._id,  // IMPORTANTE: usar 'userId' como en el middleware
        id: usuario._id, 
        email: usuario.email, 
        rol: usuario.rol 
      },
      jwtSecret,
      { expiresIn: '24h' }
    );
    
    console.log('Token generado exitosamente para:', usuario.email);
    
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