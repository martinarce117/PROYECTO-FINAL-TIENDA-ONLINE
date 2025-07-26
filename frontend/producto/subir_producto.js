    document.getElementById('form-producto').addEventListener('submit', async function (e) {
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
    });
  