document.getElementById('route-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const start = document.getElementById('start').value;
    const end = document.getElementById('end').value;
    window.location.href = `../map.html?start=${start}&end=${end}`;
});