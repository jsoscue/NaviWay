document.getElementById('route-form').addEventListener('submit', function(event) {
    // Previene el comportamiento por defecto del formulario (recargar la página)
    event.preventDefault();

    // Obtiene los valores de los campos de inicio y destino del formulario
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;

    // Redirige al usuario a la página del mapa con los parámetros de inicio y destino en la URL
    window.location.href = `../map.html?start=${start}&end=${end}`;
});
