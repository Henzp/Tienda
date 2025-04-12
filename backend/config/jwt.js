const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'tu_clave_secreta_para_desarrollo';

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
    return null;
  }
};

module.exports = { generarToken, verificarToken };