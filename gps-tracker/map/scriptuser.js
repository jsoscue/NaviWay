import { saveLocationData } from '../Firebase/realtime.js';  // Asegúrate de que la ruta del archivo sea correcta

// Variables globales para el mapa y la simulación
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
let routeName = "Mosquera a Puente Aranda";  // Nombre de la ruta

// Función llamada por la API de Google Maps para inicializar el mapa
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.6280, lng: -74.1000 },  // Coordenadas iniciales del mapa
        zoom: 14,  // Nivel de zoom del mapa
    });

    trafficLayer = new google.maps.TrafficLayer();  // Capa de tráfico
    trafficLayer.setMap(map);  // Activa la capa de tráfico en el mapa

    marker = new google.maps.Marker({
        position: { lat: 4.7061, lng: -74.2306 },  // Coordenadas de Mosquera
        map: map,
        icon: {
            url: "https://img.icons8.com/color/48/bus.png",  // URL del icono del marcador
            scaledSize: new google.maps.Size(40, 40),  // Tamaño del icono
        },
        title: "Bus en Movimiento",  // Título del marcador
    });

    directionsService = new google.maps.DirectionsService();  // Servicio de direcciones de Google Maps
    directionsRenderer = new google.maps.DirectionsRenderer();  // Renderizador de direcciones
    directionsRenderer.setMap(map);  // Configura el renderizador para el mapa

    const infoWindow = new google.maps.InfoWindow();  // Ventana de información para el marcador

    // Añade un listener para mostrar la información del vehículo al hacer clic en el marcador
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
        infoWindow.setContent(infoContent);  // Configura el contenido de la ventana de información
        infoWindow.open(map, marker);  // Abre la ventana de información en el marcador
    });

    calculateAndDisplayRoute();  // Calcula y muestra la ruta en el mapa
}

// Calcula y muestra la ruta en el mapa
function calculateAndDisplayRoute() {
    directionsService.route(
        {
            origin: { lat: 4.7061, lng: -74.2306 },  // Coordenadas de origen (Mosquera)
            destination: { lat: 4.630833, lng: -74.103056 },  // Coordenadas de destino (Puente Aranda, Bogotá)
            travelMode: google.maps.TravelMode.DRIVING,  // Modo de viaje
        },
        (response, status) => {
            if (status === "OK") {
                directionsRenderer.setDirections(response);  // Muestra la ruta en el mapa
                routePoints = response.routes[0].overview_path;  // Guarda los puntos de la ruta
                startSimulation();  // Inicia la simulación del movimiento del bus
            } else {
                console.error("Error al obtener la ruta:", status);  // Muestra un error si no se puede obtener la ruta
            }
        }
    );
}

// Simula el movimiento del bus a lo largo de la ruta
function startSimulation() {
    setInterval(() => {
        if (routeIndex < routePoints.length - 1) {
            const nextPoint = routePoints[++routeIndex];
            marker.setPosition(nextPoint);  // Mueve el marcador a la siguiente posición
            const lat = nextPoint.lat();
            const lng = nextPoint.lng();
            saveLocationData(lat, lng);  // Guarda los datos de la ubicación
            simulateData();  // Simula los datos del bus
        } else {
            routeIndex = 0;  // Reinicia la ruta cuando se completa
        }
    }, 2000);  // Intervalo de tiempo para la simulación (2 segundos)
}

// Simula los datos del bus (velocidad, cinturón, etc.)
function simulateData() {
    speed = Math.floor(Math.random() * (80 - 20 + 1)) + 20;  // Simula la velocidad entre 20 y 80 km/h
    seatBelt = Math.random() > 0.2;  // Simula si el cinturón está puesto (80% de probabilidad)
    kmTraveled += speed / 60;  // Calcula los km recorridos (asume que la simulación se ejecuta cada minuto)
    if (Math.random() < 0.1) {
        stops++;  // Incrementa el número de paradas con una probabilidad del 10%
        stopDuration = Math.floor(Math.random() * 5) + 1;  // Simula la duración de la parada (entre 1 y 5 minutos)
    }
    if (Math.random() < 0.05) {
        hardBrakes++;  // Incrementa las alertas por frenadas bruscas con una probabilidad del 5%
    }
    if (Math.random() < 0.05) {
        routeDeviations++;  // Incrementa las alertas por desvíos de ruta con una probabilidad del 5%
    }
}

// Muestra el mapa después de la pantalla de bienvenida
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
