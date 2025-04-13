// moveAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function moveAdmin() {
  let sourceConn, destConn;
  
  try {
    // Conectar a la base de datos fuente (tienda)
    sourceConn = await mongoose.createConnection('mongodb://localhost:27017/tienda');
    console.log('Conectado a la base de datos fuente (tienda)');
    
    // Conectar a la base de datos destino (tiendamotos)
    destConn = await mongoose.createConnection('mongodb://localhost:27017/tiendamotos');
    console.log('Conectado a la base de datos destino (tiendamotos)');
    
    // Definir esquema para ambas conexiones
    const usuarioSchema = new mongoose.Schema({
      nombre: String,
      email: String,
      password: String,
      rol: String,
      fechaCreacion: { type: Date, default: Date.now }
    });
    
    // Crear modelos para ambas conexiones
    const UsuarioSource = sourceConn.model('Usuario', usuarioSchema);
    const UsuarioDestino = destConn.model('Usuario', usuarioSchema);
    
    // Buscar el administrador en la fuente
    const admin = await UsuarioSource.findOne({ rol: 'admin' });
    
    if (!admin) {
      console.log('No se encontró ningún administrador en la base de datos fuente');
      return;
    }
    
    console.log('Administrador encontrado:', admin.email);
    
    // Verificar si ya existe en destino
    const existingAdmin = await UsuarioDestino.findOne({ email: admin.email });
    
    if (existingAdmin) {
      console.log('Ya existe un usuario con este email en la base de datos destino');
      return;
    }
    
    // Crear nuevo administrador en destino
    const newAdmin = new UsuarioDestino({
      nombre: admin.nombre,
      email: admin.email,
      password: admin.password, // Ya está hasheado
      rol: admin.rol,
      fechaCreacion: admin.fechaCreacion || new Date()
    });
    
    // Guardar en la base de datos destino
    await newAdmin.save();
    
    console.log('Administrador trasladado exitosamente a tiendamotos');
    console.log('Credenciales:');
    console.log('Email:', admin.email);
    console.log('Contraseña: La misma que tenía antes (no se puede ver porque está hasheada)');
    
  } catch (error) {
    console.error('Error al trasladar administrador:', error);
  } finally {
    // Cerrar conexiones
    if (sourceConn) await sourceConn.close();
    if (destConn) await destConn.close();
    console.log('Conexiones cerradas');
  }
}

moveAdmin();