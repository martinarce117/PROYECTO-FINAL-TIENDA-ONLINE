const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234', // tu clave de MySQL si tenés
  database: 'alp_technolgy' // o el nombre real de tu base de datos
});
module.exports = connection;
