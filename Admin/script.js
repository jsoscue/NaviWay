import { saveLocationData } from '../Firebase/realtime.js';  // Asegúrate de que la ruta del archivo sea correcta
let map, marker, trafficLayer, directionsService, directionsRenderer;
let routePoints = [];
let routeIndex = 0;
let speed = 0;
let stops = 0;
let seatBelt = true;
let stopDuration = 0;
let hardBrakes = 0;
let routeDeviations = 0;
let kmTraveled = 0;
let placas = "ABC123";  // Ejemplo de placas
let orden = "001";  // Ejemplo de número de orden
let routeName = "";  // Nombre de la ruta
let isReturning = false;  // Indica si el bus está en el camino de regreso

// Función llamada por la API de Google Maps
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.6280, lng: -74.1000 },
        zoom: 14,
    });

    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);  // Activa la capa de tráfico

    marker = new google.maps.Marker({
        position: { lat: 4.7061, lng: -74.2306 },  // Coordenadas de Mosquera
        map: map,
        icon: {
            url: "https://img.icons8.com/color/48/bus.png",
            scaledSize: new google.maps.Size(40, 40),
        },
        title: "Bus en Movimiento",
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const infoWindow = new google.maps.InfoWindow();

    marker.addListener("click", () => {
        const infoContent = `
            <div class="info-window">
                <h3>Datos del Vehículo</h3>
                <p><b>Placas:</b> ${placas}</p>
                <p><b>Número de Orden:</b> ${orden}</p>
                <p><b>Velocidad:</b> ${speed} km/h</p>
                <p><b>Paradas realizadas:</b> ${stops}</p>
                <p><b>Cinturón puesto:</b> ${seatBelt ? "Sí" : "No"}</p>
                <p><b>Duración última parada:</b> ${stopDuration} minutos</p>
                <p><b>Alertas por frenadas bruscas:</b> ${hardBrakes}</p>
                <p><b>Alertas por desvíos de ruta:</b> ${routeDeviations}</p>
                <p><b>Número de km recorridos en el día:</b> ${kmTraveled} km</p>
                <p><b>Ruta:</b> ${routeName}</p>
            </div>
        `;
        infoWindow.setContent(infoContent);
        infoWindow.open(map, marker);
    });

    // Verificar si hay una ruta en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const start = urlParams.get('start');
    const end = urlParams.get('end');
    routeName = urlParams.get('routeName') || "Sin nombre";
    if (start && end) {
        calculateAndDisplayRoute(start, end);
    }
}

// Calcula y muestra la ruta
function calculateAndDisplayRoute(start, end) {
    directionsService.route(
        {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);
                routePoints = response.routes[0].overview_path;
                startSimulation();
            } else {
                console.error("Error al obtener la ruta:", status);
            }
        }
    );
}

// Simula el movimiento del bus
function startSimulation() {
    setInterval(() => {
        if (routeIndex < routePoints.length - 1) {
            const nextPoint = routePoints[++routeIndex];
            marker.setPosition(nextPoint);
            const lat = nextPoint.lat();
            const lng = nextPoint.lng();
            saveLocationData(lat, lng);
            simulateData();
        } else {
            routeIndex = 0;  // Reinicia la ruta cuando se completa
        }
    }, 2000);  // Aumentar el intervalo de tiempo a 2 segundos para reducir la frecuencia de actualización
}

// Simula los datos del bus
function simulateData() {
    speed = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
    seatBelt = Math.random() > 0.2;
    kmTraveled += speed / 60;  // Asume que la simulación se ejecuta cada minuto
    if (Math.random() < 0.1) {
        stops++;
        stopDuration = Math.floor(Math.random() * 5) + 1;
    }
    if (Math.random() < 0.05) {
        hardBrakes++;
    }
    if (Math.random() < 0.05) {
        routeDeviations++;
    }
}

// Muestra el mapa después de la bienvenida
window.onload = () => {
    const welcomeScreen = document.getElementById("welcome-screen");
    setTimeout(() => {
        welcomeScreen.style.opacity = "0";
        setTimeout(() => {
            welcomeScreen.style.display = "none";
            document.getElementById("map-container").style.display = "block";
            initMap();  // Inicializa el mapa después de mostrar el contenedor
        }, 500);  // Espera medio segundo para completar la transición
    }, 3000);  // 3 segundos de bienvenida
};