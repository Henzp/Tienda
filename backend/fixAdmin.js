// E:\Proyecto\tienda\backend\fixAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/usuario');

async function fixAdmin() {
  try {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/tienda');
    console.log('Conectado a MongoDB');
    
    // Eliminar todos los usuarios admin existentes
    await Usuario.deleteMany({ rol: 'admin' });
    console.log('Administrador anterior eliminado');
    
    // Usar una contraseña simple: "123456"
    const passwordPlano = "123456";
    
    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(passwordPlano, salt);
    
    // Crear nuevo admin
    const admin = new Usuario({
      nombre: 'Admin',
      email: 'admin@ejemplo.com',
      password: passwordHash,
      rol: 'admin'
    });
    
    await admin.save();
    
    console.log('Administrador restablecido con éxito:');
    console.log('Email: admin@ejemplo.com');
    console.log('Contraseña: 123456');
    
    // Verificar que la contraseña funcione
    const verificar = await bcrypt.compare(passwordPlano, admin.password);
    console.log('Verificación de contraseña:', verificar);
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    mongoose.disconnect();
  }
}

fixAdmin();