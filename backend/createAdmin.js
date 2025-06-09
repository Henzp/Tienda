// E:\Proyecto\tienda\backend\createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Usuario = require('./models/usuario');

async function crearAdmin() {
  try {
    // Conectar a MongoDB
    await mongoose.connect('mongodb://localhost:27017/tiendamotos', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Conectado a MongoDB');
    
    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ rol: 'admin' });
    
    if (adminExistente) {
      console.log('Ya existe un administrador:', adminExistente.email);
      mongoose.disconnect();
      return;
    }
    
    // Encriptar la contraseña manualmente
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('admin123', salt);
    
    // Crear el usuario admin
    const admin = new Usuario({
      nombre: 'Administrador',
      email: 'admin@ejemplo.com',
      password: passwordHash,
      rol: 'admin'
    });
    
    await admin.save();
    
    console.log('Administrador creado exitosamente:');
    console.log('Email: admin@ejemplo.com');
    console.log('Contraseña: admin123');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error al crear administrador:', error);
    mongoose.disconnect();
  }
}

crearAdmin();