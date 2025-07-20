 document.getElementById('form-registro').addEventListener('submit', async function (e) {
      e.preventDefault();

      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const mensaje = document.getElementById('mensaje');

      try {
        const res = await fetch('http://localhost:3000/api/registro', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
          mensaje.style.color = 'green';
          mensaje.textContent = data.mensaje;
        } else {
          mensaje.style.color = 'red';
          mensaje.textContent = data.error || 'Error al registrar';
        }
      } catch (err) {
        mensaje.style.color = 'red';
        mensaje.textContent = 'Error de conexión con el servidor';
      }
    });
