// createAdminTiendamotos.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  try {
    // Conectar a MongoDB - tiendamotos
    await mongoose.connect('mongodb://localhost:27017/tiendamotos', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB - tiendamotos');
    
    // Definir el esquema de usuario
    const usuarioSchema = new mongoose.Schema({
      nombre: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      rol: { type: String, enum: ['admin', 'usuario'], default: 'usuario' },
      fechaCreacion: { type: Date, default: Date.now }
    });
    
    // Verificar si el modelo ya existe para evitar errores
    const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);
    
    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ rol: 'admin' });
    
    if (adminExistente) {
      console.log('Ya existe un administrador:', adminExistente.email);
      mongoose.disconnect();
      return;
    }
    
    // Encriptar la contraseña
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
    console.log('Desconectado de MongoDB');
  } catch (error) {
    console.error('Error al crear administrador:', error);
    mongoose.disconnect();
  }
}

createAdmin();