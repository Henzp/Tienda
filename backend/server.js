const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (para las imágenes)
app.use('/assets', express.static(path.join(__dirname, '../src/assets')));

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/tiendamotos', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas
const productosRoutes = require('./routes/productos');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const usuariosRoutes = require('./routes/usuarios');

app.use('/api/admin/usuarios', usuariosRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});