  /*  document.getElementById('form-producto').addEventListener('submit', async function (e) {
      e.preventDefault();

      const token = localStorage.getItem('token');
      const mensaje = document.getElementById('mensaje');
  
      const nombre = document.getElementById('nombre').value;
      const descripcion = document.getElementById('descripcion').value;
      const precio = document.getElementById('precio').value;
      const stock = document.getElementById('stock').value;
      

      if (!token) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Debes estar logueado para subir productos';
        return;
      }

      const formData = new FormData(this);

      try {
        const res = await fetch('http://localhost:3000/api/producto', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}` // No poner Content-Type, fetch lo maneja con FormData
          },
          body: formData
        });

        const data = await res.json();

        if (res.ok) {
          mensaje.style.color = 'green';
          mensaje.textContent = data.mensaje;
          this.reset(); // Limpia el formulario después de enviar
        } else {
          mensaje.style.color = 'red';
          mensaje.textContent = data.error || 'Error al subir producto';
        }
      } catch (err) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error de conexión con el servidor';
      }
    });*/

   /* const btnSubir = document.getElementById(`btn-subir`);
    const opcionesSubir = document.getElementById(`opciones-subir`);

    const btnEliminar = document.getElementById(`btn-eliminar`);
    const opcionesEliminar = document.getElementById(`opciones-eliminar`)
    const btnNuevo = document.getElementById(`nuevo`);
    const btnUsado = document.getElementById(`usado`);
    const formularioContenedor = document.getElementById(`formulario-contenedor`);
    const tituloFormulario = document.getElementById(`titulo-formulario`);
    const estadoProducto = document.getElementById(`estado-producto`);
  
    btnSubir.addEventListener(`click`,() =>{
      opcionesSubir.classList.toggle(`oculto`);
      opcionesEliminar.classList.add(`oculto`);
      formularioContenedor.classList.add(`oculto`);
    });

    btnEliminar.addEventListener(`click`, ()=>{
      opcionesEliminar.classList.toggle(`oculto`);
      opcionesSubir.classList.add(`oculto`);
      formularioContenedor.classList.add(`oculto`);
    });

    btnNuevo.addEventListener(`click`, () =>{
      tituloFormulario.textContent = `Subir Producto Nuevo`;
      estadoProducto.value = `nuevo`;
      formularioContenedor.classList.remove("oculto");
    });

    btnUsado.addEventListener(`click`, () => {
      tituloFormulario.textContent = `Subir Producto Usado`;
      estadoProducto.value = `usado`;
      formularioContenedor.classList.remove("oculto");
    });

    document.getElementById('form-producto').addEventListener('submit', function (e) {
  e.preventDefault();

  const datos = new FormData(this);

  console.log("Subiendo producto:");
  for (let [key, value] of datos.entries()) {
    console.log(`${key}: ${value}`);
  }

  alert("Producto subido correctamente (" + datos.get("estado") + ")");
  this.reset();
  formularioContenedor.classList.add('oculto');
});*/
const btnSubir = document.getElementById('btn-subir');
const opcionesSubir = document.getElementById('opciones-subir');

const btnEliminar = document.getElementById('btn-eliminar');
const opcionesEliminar = document.getElementById('opciones-eliminar');

const btnNuevo = document.getElementById('nuevo');
const btnUsado = document.getElementById('usado');

const formularioContenedor = document.getElementById('formulario-contenedor');
const tituloFormulario = document.getElementById('titulo-formulario');
const estadoProducto = document.getElementById('estado-producto');

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


// Mostrar opciones de Subir
btnSubir.addEventListener('click', () => {
  opcionesSubir.classList.toggle('oculto');
  opcionesEliminar.classList.add('oculto');
  formularioContenedor.classList.add('oculto');
});

// Mostrar opciones de Eliminar
btnEliminar.addEventListener('click', () => {
  opcionesEliminar.classList.toggle('oculto');
  opcionesSubir.classList.add('oculto');
  formularioContenedor.classList.add('oculto');
});

// Mostrar formulario con tipo NUEVO
btnNuevo.addEventListener('click', () => {
  tituloFormulario.textContent = 'Subir Producto NUEVO';
  estadoProducto.value = 'nuevo';
  formularioContenedor.classList.remove('oculto');
});

// Mostrar formulario con tipo USADO
btnUsado.addEventListener('click', () => {
  tituloFormulario.textContent = 'Subir Producto USADO';
  estadoProducto.value = 'usado';
  formularioContenedor.classList.remove('oculto');
});

const btnAccesorio = document.getElementById('accesorio');

btnAccesorio.addEventListener('click', () => {
  tituloFormulario.textContent = 'Subir Accesorio';
  estadoProducto.value = 'accesorio';
  formularioContenedor.classList.remove('oculto');
});

document.getElementById("form-producto").addEventListener("submit", async function (e) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const token = localStorage.getItem('token');
  const mensaje = document.getElementById(`mensaje`);
  mensaje.classList.remove(`mensaje-error`, `oculto`)

  if (!token) {
    mensaje.textContent = "Debes iniciar seccion para subir productos. ";
    mensaje.classList.add(`mensaje-error`);
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/productos", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`
      },
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
      mensaje.textContent = `Producto Publicado correctamente. `;
      mensaje.classList.remove(`mensaje-error`, `oculto`);
      mensaje.classList.remove(`mensaje-exito`);
    
       form.reset();
       // Ocultar mensaje después de unos segundos
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
    console.error('Error de red:', error);
    mensaje.textContent = '❌ Error de red: ' + error.message;
    mensaje.classList.add('mensaje-error');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  cargarProductosDueno(); // Cargar productos apenas abre la página
});


function cargarProductosDueno() {
  fetch('http://localhost:3000/api/productos')
    .then(res => res.json())
    .then(productos => {
      const contenedor = document.getElementById('lista-productos-dueño');
      contenedor.innerHTML = ''; // Limpiar
      productos.forEach(p => {
        contenedor.innerHTML += `
          <div class="producto-card" data-id="${p.id}">
            <img src="${p.imagen_url}" alt="${p.nombre}" width="100">
            <h3>${p.nombre}</h3>
            <p>${p.descripcion}</p>
            <p>Precio: $${p.precio}</p>
            <p>Estado: ${p.estado}</p>
            <P>Stock: ${p.stock}</p>
            <button onclick="eliminarProducto(${p.id})">Eliminar</button>
             <button onclick="editarProducto(${p.id})">Editar</button>
            
          </div>
        `;
      });
    });
}
/*<button onclick="marcarVendido(${p.id})">Marcar como vendido</button>*/

function eliminarProducto(id) {
  if (!confirm(`¿Estas seguro de eliminar este producto?`)) return;

  fetch(`http://localhost:3000/api/productos/${id}`, {
    method: 'DELETE'
  })
.then(res =>{
   if (res.ok) {
      // Eliminar del DOM en panel del dueño
      const tarjetaDueno = document.querySelector(`.producto-card[data-id="${id}"]`);
      if (tarjetaDueno) tarjetaDueno.remove();

      // Eliminar del DOM en panel del cliente
      const tarjetaCliente = document.querySelector(`.producto-cliente[data-id="${id}"]`);
      if (tarjetaCliente) tarjetaCliente.remove();

      // Mostrar mensaje si querés
      mostrarMensajeDebajo(document.body, 'Producto eliminado correctamente');
    } else {
      mostrarMensajeDebajo(document.body, 'Error al eliminar el producto', 'error');
    }
  })
  .catch(() => {
    mostrarMensajeDebajo(document.body, 'Error de conexión', 'error');
  });
}

function editarProducto(id) {
  const token = localStorage.getItem('token');

  if (!token) {
    alert('Debes iniciar sesión para editar productos.');
    return;
  }

  fetch(`http://localhost:3000/api/productos/${id}`, {
    
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(res => {
      if (!res.ok) throw new Error('No autorizado o error al obtener producto');
      return res.json();
    })
    .then(producto => {
      // Mostrar el formulario de edición
      document.getElementById('formulario-editar').classList.remove('oculto');

      // Rellenar los campos con la info del producto
      document.getElementById('edit-id').value = producto.id;
      document.getElementById('edit-nombre').value = producto.nombre;
      document.getElementById('edit-descripcion').value = producto.descripcion;
      document.getElementById('edit-precio').value = producto.precio;
      document.getElementById('edit-stock').value = producto.stock;
    })
    .catch(err => {
      mostrarMensajeDebajo(document.body, 'Error al obtener los datos del producto: ' + err.message,`Error`);
    });
}




function marcarVendido(id) {
  fetch(`http://localhost:3000/api/productos/${id}/vendido`, {
    method: 'PATCH'
  })
  .then(res => {
    if (res.ok) {
      mostrarMensajeDebajo(tarjeta, 'Producto marcado como vendido');
      cargarProductosDueno();
    }else {
      mostrarMensajeDebajo(tarjeta, 'Error al marcar como vendido', 'error');
    }
  });
}

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
        mensaje.textContent = 'Producto actualizado correctamente';
        mensaje.classList.remove('oculto', 'mensaje-error');
        mensaje.classList.add('mensaje-exito');

        cargarProductosDueno(); // Recargar lista
        document.getElementById('formulario-editar').classList.add('oculto');
      } else {
        mensaje.textContent = 'Error al actualizar el producto';
        mensaje.classList.remove('oculto', 'mensaje-exito');
        mensaje.classList.add('mensaje-error');
      }

      // Ocultar mensaje luego de 3 segundos
      setTimeout(() => {
        mensaje.textContent = '';
        mensaje.classList.add('oculto');
      }, 3000);
    })
    .catch(() => {
      mensaje.textContent = 'Error de conexión';
      mensaje.classList.remove('oculto', 'mensaje-exito');
      mensaje.classList.add('mensaje-error');

      setTimeout(() => {
        mensaje.textContent = '';
        mensaje.classList.add('oculto');
      }, 3000);
    });
});
