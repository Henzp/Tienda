const { verificarToken } = require('../config/jwt');

// Verificar si el usuario está autenticado
const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ mensaje: 'No hay token de autenticación' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verificarToken(token);
    
    if (!decoded) {
      return res.status(401).json({ mensaje: 'Token inválido o expirado' });
    }
    
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Error de autenticación' });
  }
};

// Verificar si el usuario es admin
const isAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador' });
  }
};

module.exports = { isAuth, isAdmin };