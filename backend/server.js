const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// DEBUG TEMPORAL - agrega estas líneas para diagnosticar
console.log('=== VERIFICANDO VARIABLES .ENV ===');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'CARGADA' : 'NO ENCONTRADA');
console.log('MONGODB_URI valor completo:', process.env.MONGODB_URI);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'CARGADO' : 'NO ENCONTRADO');
console.log('PORT:', process.env.PORT);
console.log('Current working directory:', process.cwd());
console.log('===================================');

const app = express();

// Middleware - CORS mejorado para Railway + Cloudflare
app.use(cors({
    origin: [
        'http://localhost:4200',
        'https://*.pages.dev',
        'https://tu-dominio.pages.dev'  // Cambiar después
    ],
    credentials: true
}));

app.use(express.json());

// Ruta básica para Railway health check
app.get('/', (req, res) => {
    res.json({ mensaje: 'Backend funcionando en Railway!' });
});

// Servir archivos estáticos (para las imágenes)
app.use('/assets', express.static(path.join(__dirname, '../src/assets')));

// Conexión a MongoDB Atlas
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://tiendamotos:pass123456@motomoto.ymvclyi.mongodb.net/tiendamotos?retryWrites=true&w=majority&appName=motomoto';

console.log('Intentando conectar con URI:', mongoUri.substring(0, 50) + '...');

mongoose.connect(mongoUri)
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const usuariosRoutes = require('./routes/usuarios');
const categoriasRoutes = require('./routes/categorias');
const pedidosRoutes = require('./routes/pedidos');
const contactoRoutes = require('./routes/contacto');

app.use('/api/admin/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/admin/productos', productosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/categorias', categoriasRoutes);
app.use('/api/pedidos', pedidosRoutes);
app.use('/api/contacto', contactoRoutes);

// Añadir una ruta específica para categorías (esto es temporal para diagnosticar)
app.get('/api/productos/categoria/:categoria', async (req, res) => {
    try {
      console.log(`[RUTA DIRECTA] Buscando productos con categoría: "${req.params.categoria}"`);
      
      const Producto = require('./models/producto');
      const productos = await Producto.find({
        categoria: req.params.categoria
      });
      
      console.log(`[RUTA DIRECTA] Se encontraron ${productos.length} productos`);
      res.json(productos);
    } catch (error) {
      console.error('[RUTA DIRECTA] Error:', error);
      res.status(500).json({ mensaje: error.message });
    }
});

// Puerto del servidor (Railway maneja el puerto automáticamente)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});