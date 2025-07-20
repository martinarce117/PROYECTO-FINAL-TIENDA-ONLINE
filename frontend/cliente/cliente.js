async function cargarProductos() {
  const res = await fetch('http://localhost:3000/api/productos');
  const productos = await res.json();

  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = '';

  productos.forEach(p => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${p.name}</h3>
      <img src="${p.imagen}" width="200" />
      <p>${p.description}</p>
      <p><strong>$${p.price}</strong></p>
    `;
    contenedor.appendChild(div);
  });
}

// Ejecutar cuando se cargue la página
window.addEventListener('DOMContentLoaded', cargarProductos);

  // Mostrar carrito en carrito.html
if (document.getElementById('carrito')) {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedor = document.getElementById('carrito');
    let total = 0;
  
    carrito.forEach(p => {
      contenedor.innerHTML += `<p>${p.nombre} x ${p.cantidad} - $${p.precio * p.cantidad}</p>`;
      total += p.precio * p.cantidad;
    });
  
    contenedor.innerHTML += `<h3>Total: $${total.toFixed(2)}</h3>`;
  }
  
  // Enviar pedido al backend
  const form = document.getElementById('form-envio');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const datos = Object.fromEntries(new FormData(form));
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
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
  





 
  
  
  function agregarAlCarrito(id) {
    const prod = productos.find(p => p.id === id);
    carrito.push(prod);
    alert(`${prod.nombre} agregado al carrito`);
  }
  
  function verCarrito() {
    console.log("Productos en el carrito:", carrito);
    alert(`Tenés ${carrito.length} productos en el carrito.`);
  }
  
  mostrarProductos();

  






  const productos = [
  {
    id: 1,
    nombre: "iPhone 13",
    precio: 1200,
    imagen: "https://via.placeholder.com/200x200?text=iPhone+13"
  },
  {
    id: 2,
    nombre: "Samsung Galaxy S23",
    precio: 1100,
    imagen: "https://via.placeholder.com/200x200?text=Galaxy+S23"
  },
  {
    id: 3,
    nombre: "Motorola Edge",
    precio: 800,
    imagen: "https://via.placeholder.com/200x200?text=Motorola+Edge"
  }
];

const carrito = [];

function mostrarProductos() {
  const contenedor = document.getElementById('productos-lista');
  contenedor.innerHTML = '';

  productos.forEach(prod => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <button onclick="agregarAlCarrito(${prod.id})">Agregar al carrito</button>
    `;
    contenedor.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const prod = productos.find(p => p.id === id);
  carrito.push(prod);
  alert(`${prod.nombre} agregado al carrito`);
}

function verCarrito() {
  alert(`Tenés ${carrito.length} producto(s) en el carrito.`);
}

mostrarProductos();
