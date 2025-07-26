    document.getElementById('form-login').addEventListener('submit', async function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const mensaje = document.getElementById('mensaje');

      try {
        const res = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
          mensaje.style.color = 'green';
          mensaje.textContent = data.mensaje;
          localStorage.setItem('token', data.token); // Guardamos el token
          window.location.href = '../producto/subir_producto.html'; // Redirige al panel para subir productos
        } else {
          mensaje.style.color = 'red';
          mensaje.textContent = data.error || 'Error al iniciar sesión';
        }
      } catch (err) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error de conexión con el servidor';
      }
    });
  