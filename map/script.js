import { saveLocationData } from '../Firebase/realtime.js';  // Asegúrate de que la ruta del archivo sea correcta

let map, marker, trafficLayer;
let routePoints = [];
let routeIndex = 0;
let speed = 0;
let stops = 0;
let seatBelt = true;
let stopDuration = 0;

// Función llamada por la API de Google Maps
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 4.6280, lng: -74.1000 },
        zoom: 14,
    });

    trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);  // Activa la capa de tráfico

    marker = new google.maps.Marker({
        map: map,
        icon: {
            url: "https://img.icons8.com/color/48/bus.png",
            scaledSize: new google.maps.Size(40, 40),
        },
        title: "Bus en Movimiento",
    });

    const infoWindow = new google.maps.InfoWindow();

    marker.addListener("click", () => {
        const infoContent = `
            <div class="info-window">
                <h3>Datos del Vehículo</h3>
                <p><b>Velocidad:</b> ${speed} km/h</p>
                <p><b>Paradas realizadas:</b> ${stops}</p>
                <p><b>Cinturón puesto:</b> ${seatBelt ? "Sí" : "No"}</p>
                <p><b>Duración última parada:</b> ${stopDuration} minutos</p>
            </div>
        `;
        infoWindow.setContent(infoContent);
        infoWindow.open(map, marker);
    });

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
        {
            origin: { lat: 4.6280, lng: -74.1000 },
            destination: { lat: 4.6500, lng: -74.0931 },
            travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
            if (status === "OK") {
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
            map.panTo(nextPoint);
            const lat = nextPoint.lat();
            const lng = nextPoint.lng();
            saveLocationData(lat, lng);
            simulateData();
        } else {
            routeIndex = 0;  // Reinicia la ruta cuando se completa
        }
    }, 1000);
}

// Simula los datos del bus
function simulateData() {
    speed = Math.floor(Math.random() * (80 - 20 + 1)) + 20;
    seatBelt = Math.random() > 0.2;
    if (Math.random() < 0.1) {
        stops++;
        stopDuration = Math.floor(Math.random() * 5) + 1;
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
