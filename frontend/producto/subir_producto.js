const btnSubir = document.getElementById('btn-subir');
const opcionesSubir = document.getElementById('opciones-subir');

const btnEliminar = document.getElementById('btn-eliminar');
const opcionesEliminar = document.getElementById('opciones-eliminar');

const btnNuevo = document.getElementById('nuevo');
const btnUsado = document.getElementById('usado');

const formularioContenedor = document.getElementById('formulario-contenedor');
const tituloFormulario = document.getElementById('titulo-formulario');
const estadoProducto = document.getElementById('estado-producto');

const btnAccesorio = document.getElementById('accesorio');

function mostrarMensajeDebajo(elementoPadre, texto, tipo = 'exito') {
  let mensaje = elementoPadre.querySelector('.mensaje');

  if (!mensaje) {
    mensaje = document.createElement('p');
    mensaje.classList.add('mensaje');
    elementoPadre.appendChild(mensaje);
  }

  mensaje.textContent = texto;
  mensaje.classList.remove('exito', 'error');
  mensaje.classList.add(tipo);

  setTimeout(() => {
    mensaje.remove();
  }, 3000);
}

// ===================
// Mostrar opciones
// ===================
btnSubir.addEventListener('click', () => {
  opcionesSubir.classList.toggle('oculto');
  opcionesEliminar.classList.add('oculto');
  formularioContenedor.classList.add('oculto');
});

btnEliminar.addEventListener('click', () => {
  opcionesEliminar.classList.toggle('oculto');
  opcionesSubir.classList.add('oculto');
  formularioContenedor.classList.add('oculto');
});

btnNuevo.addEventListener('click', () => {
  tituloFormulario.textContent = 'Subir Producto NUEVO';
  estadoProducto.value = 'nuevo';
  formularioContenedor.classList.remove('oculto');
});

btnUsado.addEventListener('click', () => {
  tituloFormulario.textContent = 'Subir Producto USADO';
  estadoProducto.value = 'usado';
  formularioContenedor.classList.remove('oculto');
});

btnAccesorio.addEventListener('click', () => {
  tituloFormulario.textContent = 'Subir Accesorio';
  estadoProducto.value = 'accesorio';
  formularioContenedor.classList.remove('oculto');
});

// ===================
// Subir producto
// ===================
document.getElementById("form-producto").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const token = localStorage.getItem('token');
  const mensaje = document.getElementById('mensaje');
  mensaje.classList.remove('mensaje-error', 'oculto');

  if (!token) {
    mensaje.textContent = "Debes iniciar sesión para subir productos.";
    mensaje.classList.add('mensaje-error');
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/productos", {
      method: "POST",
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData,
    });

    const contentType = response.headers.get('content-type');
    let resultado;

    if (contentType && contentType.includes('application/json')) {
      resultado = await response.json();
    } else {
      const texto = await response.text();
      throw new Error('Respuesta no válida del servidor: ' + texto.slice(0, 100));
    }

    if (response.ok) {
      mensaje.textContent = "✅ Producto publicado correctamente.";
      mensaje.classList.remove('mensaje-error', 'oculto');
      form.reset();
      setTimeout(() => {
        mensaje.textContent = '';
        mensaje.classList.add('oculto');
        formularioContenedor.classList.add('oculto');
      }, 3000);
    } else {
      mensaje.textContent = resultado.mensaje || resultado.error || '❌ Error desconocido';
      mensaje.classList.add('mensaje-error');
    }
  } catch (error) {
    mensaje.textContent = '❌ Error de red: ' + error.message;
    mensaje.classList.add('mensaje-error');
  }
});

// ===================
// Cargar productos dueño
// ===================
document.addEventListener('DOMContentLoaded', () => {
  cargarProductosDueno();
});

function cargarProductosDueno() {
  fetch('http://localhost:3000/api/productos')
    .then(res => res.json())
    .then(productos => {
      const contenedor = document.getElementById('lista-productos-dueño');
      contenedor.innerHTML = '';
      productos.forEach(p => {
        contenedor.innerHTML += `
          <div class="producto-card" data-id="${p.id}">
            <img src="${p.imagen_url}" alt="${p.nombre}" width="100">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <p>Precio: $${p.precio}</p>
            <p>Estado: ${p.estado}</p>
            <p>Stock: ${p.stock}</p>
            <button onclick="eliminarProducto(${p.id})">Eliminar</button>
            <button onclick="editarProducto(${p.id})">Editar</button>
          </div>
        `;
      });
    });
}

// ===================
// Eliminar producto
// ===================
function eliminarProducto(id) {
  if (!confirm("¿Estás seguro de eliminar este producto?")) return;

  fetch(`http://localhost:3000/api/productos/${id}`, { method: 'DELETE' })
    .then(res => {
      if (res.ok) {
        const tarjetaDueno = document.querySelector(`.producto-card[data-id="${id}"]`);
        if (tarjetaDueno) tarjetaDueno.remove();

        const tarjetaCliente = document.querySelector(`.producto-cliente[data-id="${id}"]`);
        if (tarjetaCliente) tarjetaCliente.remove();

        let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        carrito = carrito.filter(p => p.id !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContadorCarrito();

        mostrarMensajeDebajo(document.body, 'Producto eliminado correctamente');
      } else {
        mostrarMensajeDebajo(document.body, 'Error al eliminar el producto', 'error');
      }
    })
    .catch(() => {
      mostrarMensajeDebajo(document.body, 'Error de conexión', 'error');
    });
}

function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const contador = document.getElementById("contador-carrito");
  if (contador) contador.textContent = carrito.length;
}

// ===================
// Editar producto
// ===================
function editarProducto(id) {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Debes iniciar sesión para editar productos.');
    return;
  }

  fetch(`http://localhost:3000/api/productos/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error('No autorizado o error al obtener producto');
      return res.json();
    })
    .then(producto => abrirFormularioEdicion(producto))
    .catch(err => mostrarMensajeDebajo(document.body, 'Error al obtener los datos del producto: ' + err.message, 'error'));
}

function abrirFormularioEdicion(producto) {
   const campos = ["id", "nombre", "precio", "stock", "descripcion", "estado", "tipo"];
  campos.forEach(campo => {
    const input = document.getElementById(`edit-${campo}`);
    if (input && producto[campo] !== undefined) input.value = producto[campo];
  });

  const formEditar = document.getElementById("formulario-editar");
  if (formEditar) formEditar.classList.remove('oculto')
}
document.getElementById('formulario-editar').classList.add('oculto');
// ===================
// Submit edición
// ===================
document.getElementById('form-editar-producto').addEventListener('submit', function (e) {
  e.preventDefault();

  const id = document.getElementById('edit-id').value;
  const nombre = document.getElementById('edit-nombre').value;
  const descripcion = document.getElementById('edit-descripcion').value;
  const precio = document.getElementById('edit-precio').value;
  const stock = document.getElementById('edit-stock').value;
  const mensaje = document.getElementById('mensaje-edicion');

  fetch(`http://localhost:3000/api/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({ nombre, descripcion, precio, stock })
  })
    .then(res => {
      if (res.ok) {
        mensaje.textContent = '✅ Producto actualizado correctamente';
        mensaje.classList.remove('oculto', 'mensaje-error');
        mensaje.classList.add('mensaje-exito');

        cargarProductosDueno();
        if (typeof cargarProductosCliente === "function") cargarProductosCliente();
        actualizarCarritoProducto(id, { nombre, descripcion, precio, stock });

        document.getElementById('formulario-editar').classList.add('oculto');
      } else {
        mensaje.textContent = '❌ Error al actualizar el producto';
        mensaje.classList.remove('oculto', 'mensaje-exito');
        mensaje.classList.add('mensaje-error');
      }

      setTimeout(() => {
        mensaje.textContent = '';
        mensaje.classList.add('oculto');
      }, 3000);
    })
    .catch(() => {
      mensaje.textContent = '⚠️ Error de conexión';
      mensaje.classList.remove('oculto', 'mensaje-exito');
      mensaje.classList.add('mensaje-error');

      setTimeout(() => {
        mensaje.textContent = '';
        mensaje.classList.add('oculto');
      }, 3000);
    });
});

// ===================
// Actualizar carrito
// ===================
function actualizarCarritoProducto(id, productoActualizado) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito = carrito.map(item => item.id === parseInt(id) ? { ...item, ...productoActualizado } : item);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

// ===================
// Marcar vendido
// ===================
function marcarVendido(id) {
  fetch(`http://localhost:3000/api/productos/${id}/vendido`, { method: 'PATCH' })
    .then(res => {
      if (res.ok) {
        mostrarMensajeDebajo(document.body, 'Producto marcado como vendido');
        cargarProductosDueno();
      } else {
        mostrarMensajeDebajo(document.body, 'Error al marcar como vendido', 'error');
      }
    });
}

// ===================
// Mensajes en pantalla
// ===================
function mostrarMensaje(texto, tipo = "exito") {
  const mensaje = document.createElement("div");
  mensaje.className = `mensaje ${tipo}`;
  mensaje.innerText = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 3000);
}
