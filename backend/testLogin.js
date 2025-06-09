// E:\Proyecto\tienda\backend\testLogin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/usuario');

async function testLogin() {
  try {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/tienda');
    
    const email = 'admin@ejemplo.com';
    const password = 'admin123';
    
    console.log('Buscando usuario con email:', email);
    
    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      console.log('Usuario no encontrado');
      mongoose.disconnect();
      return;
    }
    
    console.log('Usuario encontrado:', usuario.nombre);
    console.log('Rol:', usuario.rol);
    console.log('Hash de contraseña almacenado:', usuario.password);
    
    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);
    console.log('¿Contraseña válida?', passwordValida);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

testLogin();