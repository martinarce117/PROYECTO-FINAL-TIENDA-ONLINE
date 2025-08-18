const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.urlencoded({ extended: true })); // Para procesar multipart/form-data sin multer
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'alp_technology'
});

db.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err);
    return;
  }
  console.log('✅ Conectado a la base de datos MySQL');
});

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor funcionando: A.L.P Technology');
});

// Registro de dueño (solo uno)
app.post('/api/registro', async (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT COUNT(*) AS total FROM users', async (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error en la base de datos' });

    if (rows[0].total > 0) {
      return res.status(403).json({ error: 'Ya hay un dueño registrado' });
    }

    const hashed = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed], (err) => {
      if (err) return res.status(500).json({ error: 'Error al registrar' });
      res.json({ mensaje: 'Dueño registrado correctamente' });
    });
  });
});

// Login del dueño
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const user = results[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secreto', { expiresIn: '1h' });
    res.json({ mensaje: 'Login exitoso', token });
  });
});

// Middleware de autenticación
function verificarToken(req, res, next) {
  const auth = req.headers.authorization;
  const token = auth && auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, process.env.JWT_SECRET || 'secreto', (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Ruta para guardar producto (con token y sin imagen por ahora)
app.post("/api/productos", verificarToken, upload.none(), (req, res) => {
  const { nombre, imagen_url, descripcion, precio, stock, estado } = req.body;

   const estadoValido = ['nuevo', 'usado', 'accesorio'];
  if (!estadoValido.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  if (!nombre || !descripcion || !precio || !stock || !estado) {
    return res.status(400).json({ mensaje: "Faltan datos requeridos" });
  }

  const sql = "INSERT INTO productos (nombre, descripcion, precio, imagen_url, estado, stock) VALUES (?, ?, ?, ?, ?, ?)";
  const valores = [nombre, descripcion, precio, imagen_url || null, estado, stock];

  db.query(sql, valores, (err, resultado) => {
    if (err) {
      console.error("Error al insertar:", err);
      return res.status(500).json({ mensaje: "Error al guardar el producto" });
    }

    res.status(200).json({ mensaje: "Producto guardado correctamente" });
  });
});


// ✅ Obtener un producto por su ID (para editar)
app.get('/api/productos/:id', verificarToken, (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el producto' });
    if (result.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });

    res.json(result[0]);
  });
});


// ✅ Modificar producto (ahora también con stock y protegido con token)
app.put('/api/productos/:id', verificarToken, (req, res) => {
  const { id } = req.params;
  const { nombre, precio, descripcion, stock } = req.body;

  if (!nombre || !descripcion || !precio || !stock) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const sql = 'UPDATE productos SET nombre = ?, precio = ?, descripcion = ?, stock = ? WHERE id = ?';
  db.query(sql, [nombre, precio, descripcion, stock, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar' });
    res.sendStatus(200);
  });
});

// Eliminar producto
app.delete('/api/productos/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar' });
    res.sendStatus(200);
  });
});

// Marcar como vendido
app.patch('/api/productos/:id/vendido', (req, res) => {
  const { id } = req.params;
  const sql = 'UPDATE productos SET estado = ? WHERE id = ?';
  db.query(sql, ['Vendido', id], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al marcar como vendido' });
    res.sendStatus(200);
  });
});




app.get('/api/productos', (req, res) => {
  const sql = 'SELECT * FROM productos ORDER BY id DESC';
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al obtener productos' });
    res.json(result);
  });
});


// Guardar pedido
app.post('/api/pedidos', (req, res) => {
  const { nombre, direccion, telefono, email, total, items } = req.body;

  const pedidoQuery = 'INSERT INTO pedidos (nombre_cliente, direccion, telefono, email, total) VALUES (?, ?, ?, ?, ?)';
  db.query(pedidoQuery, [nombre, direccion, telefono, email, total], (err, result) => {
    if (err) return res.status(500).send(err);

    const pedidoId = result.insertId;
    const itemsQuery = 'INSERT INTO pedido_items (pedido_id, producto_id, cantidad) VALUES ?';
    const values = items.map(item => [pedidoId, item.id, item.cantidad]);

    db.query(itemsQuery, [values], (err2) => {
      if (err2) return res.status(500).send(err2);
      res.send({ mensaje: 'Pedido guardado con éxito' });
    });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
