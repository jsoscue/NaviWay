// Importa la función saveLocationData desde el módulo Firebase/realtime.js
import { saveLocationData } from '../Firebase/realtime.js';  // Asegúrate de que la ruta del archivo sea correcta

// Variables globales para el mapa y la simulación
let map, marker, marker2, trafficLayer, directionsService, directionsRenderer;
let routePoints = [];
let routeIndex = 0;
let speed = 0;
let stops = 0;
let seatBelt = true;
let stopDuration = 0;
let hardBrakes = 0;
let routeDeviations = 0;
let kmTraveled = 0;
let placas = "ABC123";  // Ejemplo de placas para el primer vehículo
let orden = "001";  // Ejemplo de número de orden para el primer vehículo
let placas2 = "XYZ789";  // Ejemplo de placas para el segundo vehículo
let orden2 = "002";  // Ejemplo de número de orden para el segundo vehículo
let routeName = "";  // Nombre de la ruta
let isReturning = false;  // Indica si el bus está en el camino de regreso

// Función llamada por la API de Google Maps para inicializar el mapa
function initMap() {
    // Crear un nuevo mapa centrado en las coordenadas especificadas
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.6280, lng: -74.1000 },
        zoom: 14,
    });

    // Añadir capa de tráfico al mapa
    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);  // Activa la capa de tráfico

    // Crear el primer marcador en una posición específica
    marker = new google.maps.Marker({
        position: { lat: 4.7061, lng: -74.2306 },  // Coordenadas de Mosquera
        map: map,
        icon: {
            url: "https://img.icons8.com/color/48/bus.png",
            scaledSize: new google.maps.Size(40, 40),
        },
        title: "Bus en Movimiento",
    });

    // Crear el segundo marcador en una posición específica (200 metros al norte del primero)
    marker2 = new google.maps.Marker({
        position: { lat: 4.7080, lng: -74.2306 },  // Coordenadas de Mosquera, 200 metros al norte
        map: map,
        icon: {
            url: "https://img.icons8.com/color/48/bus.png",
            scaledSize: new google.maps.Size(40, 40),
        },
        title: "Bus en Movimiento",
    });

    // Inicializar el servicio de direcciones y el renderizador de direcciones de Google Maps
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const infoWindow = new google.maps.InfoWindow();

    // Añadir listener para mostrar información del vehículo al hacer clic en el primer marcador
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

    // Añadir listener para mostrar información del vehículo al hacer clic en el segundo marcador
    marker2.addListener("click", () => {
        const infoContent = `
            <div class="info-window">
                <h3>Datos del Vehículo</h3>
                <p><b>Placas:</b> ${placas2}</p>
                <p><b>Número de Orden:</b> ${orden2}</p>
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
        infoWindow.open(map, marker2);
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

// Función para calcular y mostrar la ruta en el mapa
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

// Función para simular el movimiento del bus a lo largo de la ruta
function startSimulation() {
    setInterval(() => {
        if (routeIndex < routePoints.length - 1) {
            const nextPoint = routePoints[++routeIndex];
            marker.setPosition(nextPoint);
            const lat = nextPoint.lat();
            const lng = nextPoint.lng();
            saveLocationData(lat, lng);  // Guarda los datos de ubicación en Firebase
            simulateData();
        } else {
            routeIndex = 0;  // Reinicia la ruta cuando se completa
        }
    }, 2000);  // Intervalo de 2 segundos para la actualización de la posición

    // Iniciar el segundo vehículo 15 segundos después
    setTimeout(() => {
        setInterval(() => {
            if (routeIndex < routePoints.length - 1) {
                const nextPoint = routePoints[++routeIndex];
                marker2.setPosition(nextPoint);
                const lat = nextPoint.lat();
                const lng = nextPoint.lng();
                saveLocationData(lat, lng);  // Guarda los datos de ubicación en Firebase
                simulateData();
            } else {
                routeIndex = 0;  // Reinicia la ruta cuando se completa
            }
        }, 2000);  // Intervalo de 2 segundos para la actualización de la posición
    }, 15000);  // 15 segundos de retraso para el segundo vehículo
}

// Función para simular los datos del bus
function simulateData() {
    speed = Math.floor(Math.random() * (80 - 20 + 1)) + 20;  // Simula la velocidad del bus entre 20 y 80 km/h
    seatBelt = Math.random() > 0.2;  // Simula el uso del cinturón de seguridad (80% de probabilidad de estar puesto)
    kmTraveled += speed / 60;  // Calcula los kilómetros recorridos, asumiendo que la simulación se ejecuta cada minuto
    if (Math.random() < 0.1) {
        stops++;
        stopDuration = Math.floor(Math.random() * 5) + 1;  // Simula la duración de una parada entre 1 y 5 minutos
    }
    if (Math.random() < 0.05) {
        hardBrakes++;  // Incrementa las alertas por frenadas bruscas (5% de probabilidad)
    }
    if (Math.random() < 0.05) {
        routeDeviations++;  // Incrementa las alertas por desvíos de ruta (5% de probabilidad)
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
