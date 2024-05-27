const { Client } = require('pg');

// Configuración de la conexión
const client = new Client({
  host: 'localhost', // Cambia esto si tu base de datos no está en localhost
  port: 5432,        // Puerto por defecto de PostgreSQL
  user: 'postgres',      // Tu usuario de PostgreSQL
  password: 'password',  // Tu contraseña de PostgreSQL
  database: 'libreria'    // Nombre de la base de datos
});

// Función para probar la conexión
async function testConnection() {
  try {
    await client.connect(); // Intentar conectar
    console.log('Conexión exitosa a PostgreSQL');
    const res = await client.query('SELECT NOW()'); // Ejecutar una consulta simple
    console.log('Hora actual en la base de datos:', res.rows[0]);
  } catch (err) {
    console.error('Error al conectar a PostgreSQL:', err);
  } finally {
    await client.end(); // Cerrar la conexión
  }
}

// Ejecutar la prueba de conexión
testConnection();
