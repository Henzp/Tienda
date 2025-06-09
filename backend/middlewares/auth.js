const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
require('dotenv').config();

// Middleware de autenticación
const auth = async (req, res, next) => {
    try {
        // Verificar si existe el header Authorization
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            console.log('Auth fallida: No se proporcionó token');
            return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
        }
        
        // Obtener el token del header (formato: "Bearer TOKEN")
        const token = authHeader.replace('Bearer ', '');
        if (!token) {
            console.log('Auth fallida: Token vacío');
            return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
        }
        
        try {
            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
            console.log('Token verificado para el usuario ID:', decoded.userId);
            
            // Buscar al usuario por ID
            const usuario = await Usuario.findById(decoded.userId);
            if (!usuario) {
                console.log('Auth fallida: Usuario no encontrado, ID:', decoded.userId);
                return res.status(401).json({ mensaje: 'Token inválido: usuario no encontrado.' });
            }
            
            // Añadir información del usuario al request
            req.token = token;
            req.usuario = {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol || 'usuario'
            };
            
            next();
        } catch (tokenError) {
            console.log('Auth fallida: Error al verificar token:', tokenError.message);
            return res.status(401).json({ mensaje: 'Token inválido o expirado.' });
        }
    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor.' });
    }
};

module.exports = auth;