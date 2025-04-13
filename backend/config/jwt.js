// backend/config/jwt.js
const jwt = require('jsonwebtoken');

// Usa una clave secreta segura en producción (idealmente desde una variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_para_desarrollo';

// Generar token
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario._id,
      email: usuario.email,
      rol: usuario.rol 
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
};

// Verificar token
const verificarToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('Error al verificar token:', error);
    return null;
  }
};

module.exports = { generarToken, verificarToken };