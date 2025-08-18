function renderizarCarrito(carrito) {
  const contenedor = document.getElementById('contenedor-carrito');
  const carritoVacio = document.querySelector('.carrito-vacio');
  const acciones = document.querySelector('.carrito-acciones');
  const total = document.getElementById('total');

  if (carrito.length === 0) {
    carritoVacio.classList.remove('disabled');
    contenedor.classList.add('disabled');
    acciones.classList.add('disabled');
    return;
  }

  carritoVacio.classList.add('disabled');
  contenedor.classList.remove('disabled');
  acciones.classList.remove('disabled');

  contenedor.innerHTML = '';
  let totalPrecio = 0;

  carrito.forEach(prod => {
    const subtotal = prod.precio * prod.cantidad;
    totalPrecio += subtotal;

    const div = document.createElement('div');
    div.classList.add('carrito-producto');
    div.innerHTML = `
      <img class="carrito-producto-imagen" src="${prod.imagen}" alt="${prod.nombre}">
      <div class="carrito-producto-titulo">
        <small>Título</small>
        <h3>${prod.nombre}</h3>
      </div>
      <div class="carrito-producto-cantidad">
        <small>Cantidad</small>
        <p>${prod.cantidad}</p>
      </div>
      <div class="carrito-producto-precio">
        <small>Precio</small>
        <p>$${prod.precio}</p>
      </div>
      <div class="carrito-producto-subtotal">
        <small>Subtotal</small>
        <p>$${subtotal}</p>
      </div>
      <button class="carrito-producto-eliminar" data-id="${prod.id}"><i class="bi bi-trash3"></i></button>
    `;
    contenedor.appendChild(div);
  });

  total.textContent = `$${totalPrecio}`;

  // Botones eliminar
  const botonesEliminar = document.querySelectorAll('.carrito-producto-eliminar');
  botonesEliminar.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      const nuevoCarrito = carrito.filter(p => p.id !== id);
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      renderizarCarrito(nuevoCarrito);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  renderizarCarrito(carrito);
  const btnComprar = document.querySelector('.carrito-acciones-comprar');
btnComprar.addEventListener('click', () => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  if (carrito.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  let mensaje = '¡Hola! Quiero hacer un pedido:\n\n';
  let total = 0;

  carrito.forEach((prod, index) => {
    mensaje += `${index + 1}. ${prod.nombre} x${prod.cantidad} - $${prod.precio * prod.cantidad}\n`;
    if (prod.url) {
      mensaje += `🔗 ${prod.url}\n`;
    }
    total += prod.precio * prod.cantidad;
  });

  mensaje += `\nTotal: $${total}`;

  const numero = '5493482416055'; // ← reemplazá con tu número real
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');

  localStorage.removeItem('carrito');
  location.reload();
});
document.querySelector('.carrito-acciones-comprar').addEventListener('click', () => {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }
  
  // Número de WhatsApp (usa formato internacional, sin + ni espacios)
  const numeroWhatsApp = '5493482416055'; // Cambialo por tu número real
  
  // URL base de los productos (cambia según tu sitio)
  const urlBaseProducto = 'http://localhost:3000/frontend/subir_producto.html?id=';

  // Construir el mensaje con cada producto, cantidad y enlace
  let mensaje = 'Hola, quiero comprar estos productos:\n\n';

  carrito.forEach(p => {
    const enlaceProducto = urlBaseProducto + p.id;
    mensaje += `- ${p.nombre} x${p.cantidad} - $${p.precio * p.cantidad}\n  ${enlaceProducto}\n\n`;
  });

  mensaje += 'Gracias!';

  // Codificar el mensaje para URL
  const mensajeCodificado = encodeURIComponent(mensaje);

  // URL para enviar WhatsApp
  const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensajeCodificado}`;

  // Abrir WhatsApp en nueva pestaña
  window.open(urlWhatsApp, '_blank');
});

  // Evento para botón "Vaciar carrito"
const btnVaciar = document.querySelector('.carrito-acciones-vaciar');
btnVaciar.addEventListener('click', () => {
  if (confirm('¿Estás seguro de que querés vaciar el carrito?')) {
    localStorage.removeItem('carrito');
    renderizarCarrito([]); // ← Vacía visualmente el carrito también
  }
});

});
