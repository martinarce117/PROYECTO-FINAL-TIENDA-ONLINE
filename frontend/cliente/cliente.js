const carrito = JSON.parse(localStorage.getItem('carrito')) || [];


function mostrarMensajeCarrito(texto, tipo = 'exito') {
  const mensaje = document.getElementById('mensaje-carrito');
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  mensaje.classList.remove('oculto');

  setTimeout(() => {
    mensaje.classList.add('oculto');
  }, 3000);
}


// Mostrar productos del backend
function mostrarCatalogo() {
  fetch('http://localhost:3000/api/productos')
    .then(res => res.json())
    .then(productos => {
      const catalogo = document.getElementById('catalogo-productos');
      catalogo.innerHTML = '';

      productos.forEach(p => {
        const div = document.createElement('div');
        div.classList.add('producto-cliente');
         div.setAttribute('data-id', p.id);
         div.setAttribute(`data-estado`, p.estado);
        div.innerHTML = `
          <img class="producto-imagen" src="${p.imagen_url}" alt="${p.nombre}">
          <div class="producto-detalles">
            <h3 class="producto-titulo">${p.nombre}</h3>
            <p class="producto-precio">$${p.precio}</p>
            <button class="producto-agregar">Agregar</button>
          </div>
        `;
        div.addEventListener('click', () => mostrarDetalles(p));
        const botonAgregar = div.querySelector(`.producto-agregar`);
        botonAgregar.addEventListener("click", (e) =>{
          e.stopPropagation();
          agregarAlCarrito(p.id, p.nombre, p.precio, p.imagen_url)
        });

        catalogo.appendChild(div);

      });

      activarFiltros();
    })
    .catch(err => {
      console.error('Error al cargar productos:', err);
    });
    function mostrarDetalles(producto) {
  document.getElementById('modal-nombre').textContent = producto.nombre;
  document.getElementById('modal-imagen').src = producto.imagen_url;
  document.getElementById('modal-descripcion').textContent = "Descripción: " + producto.descripcion;
  document.getElementById('modal-estado').textContent = "Estado: " + producto.estado;
  document.getElementById('modal-stock').textContent = "Stock: " + producto.stock + " unidades";
  document.getElementById('modal-precio').textContent = "Precio: $" + producto.precio;

  document.getElementById('modal-producto').classList.remove('oculto');
}

document.getElementById('modal-cerrar').addEventListener('click', () => {
  document.getElementById('modal-producto').classList.add('oculto');
});


    function activarFiltros() {
  const botones = document.querySelectorAll('.button-categoria');
  const titulo = document.getElementById(`titulo-principal`);


  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      const categoria = boton.dataset.categoria;

      // Activar botón
      botones.forEach(b => b.classList.remove('active'));
      boton.classList.add('active');

       if (categoria === 'todos') {
  titulo.textContent = 'Todos los Productos';
  document.getElementById('catalogo-productos').classList.remove('oculto');
  document.getElementById('seccion-sobre-nosotros').classList.add('oculto');
} else if (categoria === 'nuevo') {
  titulo.textContent = 'Productos Nuevos';
  document.getElementById('catalogo-productos').classList.remove('oculto');
  document.getElementById('seccion-sobre-nosotros').classList.add('oculto');
} else if (categoria === 'usado') {
  titulo.textContent = 'Productos Usados';
  document.getElementById('catalogo-productos').classList.remove('oculto');
  document.getElementById('seccion-sobre-nosotros').classList.add('oculto');
} else if (categoria === 'accesorio') {
  titulo.textContent = 'Accesorios';
  document.getElementById('catalogo-productos').classList.remove('oculto');
  document.getElementById('seccion-sobre-nosotros').classList.add('oculto');
} else if (categoria === 'sobre') {
  titulo.textContent = '';
  document.getElementById('catalogo-productos').classList.add('oculto');
  document.getElementById('seccion-sobre-nosotros').classList.remove('oculto');
}


      // Filtrar productos
      const productos = document.querySelectorAll('.producto-cliente');
      productos.forEach(p => {
        const estado = p.getAttribute('data-estado');
        if (categoria === 'todos' || estado === categoria) {
          p.style.display = 'block';
        } else {
          p.style.display = 'none';
        }
      });
    });
  });
}
}

function filtrarProductos(categoria) {
  const productos = document.querySelectorAll('.producto-cliente');

  productos.forEach(p => {
    const estado = p.getAttribute('data-estado');

    if (categoria === 'todos' || estado === categoria) {
      p.style.display = 'block';
    } else {
      p.style.display = 'none';
    }
  });
}

const botonesCategorias = document.querySelectorAll('.button-categoria');

botonesCategorias.forEach(btn => {
  btn.addEventListener('click', () => {
    const categoria = btn.dataset.categoria;

    // Cambiar estilos de activo
    botonesCategorias.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    filtrarProductos(categoria);
  });
});

function actualizarContadorCarrito() {
  const numerico = document.querySelector('.numerico');
  const totalProductos = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  numerico.textContent = totalProductos;
}


// Agregar al carrito
function agregarAlCarrito(id, nombre, precio, imagen) {
  const url = `http://localhost:3000/frontend/subir_producto.html?id=${id}`;

  const index = carrito.findIndex(p => p.id === id);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio, imagen, url, cantidad: 1 });
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarContadorCarrito();
  mostrarMensajeCarrito(`${nombre} agregado al carrito`, 'exito');
}

// Mostrar carrito (solo si estás en carrito.html)
if (document.getElementById('carrito')) {
  const contenedor = document.getElementById('carrito');
  let total = 0;

  carrito.forEach(p => {
    contenedor.innerHTML += `<p>${p.nombre} x ${p.cantidad} - $${p.precio * p.cantidad}</p>`;
     if (prod.url) {
    mensaje += `🖼️ Imagen: ${prod.imagen}\n`;
    mensaje += `🔗 Producto: ${prod.url}\n`;
  }
    total += p.precio * p.cantidad;
  });

  contenedor.innerHTML += `<h3>Total: $${total.toFixed(2)}</h3>`;
}

// Enviar pedido
const form = document.getElementById('form-envio');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = Object.fromEntries(new FormData(form));
    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

    const pedido = {
      ...datos,
      total,
      items: carrito
    };

    const res = await fetch('http://localhost:3000/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pedido)
    });

    if (res.ok) {
      alert('✅ Pedido realizado con éxito');
      localStorage.removeItem('carrito');
      window.location.href = 'index.html';
    } else {
      alert('❌ Error al realizar el pedido');
    }
  });
}





// Ejecutar al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  mostrarCatalogo();
  actualizarContadorCarrito(); // ← muestra el número al iniciar
});
