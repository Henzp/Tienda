// backend/middlewares/auth.js
const { verificarToken } = require('../config/jwt');

// Verificar si el usuario está autenticado
const isAuth = (req, res, next) => {
  try {
    console.log('Headers de autenticación:', req.headers.authorization);
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'No hay token de autenticación' });
    }
    
    const token = authHeader.split(' ')[1];
    console.log('Token extraído:', token ? token.substring(0, 20) + '...' : 'No token');
    
    const decoded = verificarToken(token);
    console.log('Resultado de verificación:', decoded ? 'Token válido' : 'Token inválido');
    
    if (!decoded) {
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
    
    req.usuario = decoded;
    console.log('Usuario autenticado:', req.usuario.email, 'Rol:', req.usuario.rol);
    next();
  } catch (error) {
    console.error('Error en middleware isAuth:', error);
    return res.status(401).json({ mensaje: 'Error de autenticación' });
  }
};

// Verificar si el usuario es admin
const isAdmin = (req, res, next) => {
  console.log('Verificando si es admin. Usuario:', req.usuario);
  
  if (req.usuario && req.usuario.rol === 'admin') {
    console.log('Usuario es admin. Acceso permitido.');
    next();
  } else {
    console.log('Usuario no es admin. Acceso denegado.');
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
  }
};

module.exports = { isAuth, isAdmin };