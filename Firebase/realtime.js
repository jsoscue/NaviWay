// Importa los módulos necesarios desde Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0Im_ROxNZcWaBhj9w4Ncrh7MOELnWZGE",
  authDomain: "naviway-database.firebaseapp.com",
  projectId: "naviway-database",
  storageBucket: "naviway-database.appspot.com",
  messagingSenderId: "35224588554",
  appId: "1:35224588554:web:8a44a81de4c5820a2c2af3",
  measurementId: "G-MTB3GZZZ9N"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
console.log('Firebase App Initialized:', app); // Verificar inicialización de Firebase
const database = getDatabase(app);
console.log('Firebase Database:', database); // Verificar inicialización de la base de datos

// Función para almacenar datos de geolocalización en Firebase con timestamp en formato entero y fecha legible
export function saveLocationData(lat, lng) {
  const timestamp = Date.now(); // Obtiene el timestamp en milisegundos como entero
  const readableDate = new Date(timestamp).toLocaleString(); // Convierte el timestamp a una fecha legible
  console.log('Guardando timestamp:', timestamp); // Añadir log para verificar el timestamp
  console.log('Guardando fecha legible:', readableDate); // Añadir log para verificar la fecha legible
  const locationRef = ref(database, 'bus/location_history'); // Referencia en la base de datos

  // Almacena latitud, longitud, timestamp y fecha legible
  push(locationRef, { latitude: lat, longitude: lng, timestamp, readableDate })
    .then(() => {
      console.log('Datos de localización guardados en Firebase.');
      // Procesar los datos guardados inmediatamente
      processSavedData({ latitude: lat, longitude: lng, timestamp, readableDate });
    })
    .catch((error) => {
      console.error('Error al guardar datos de localización:', error);
    });
}

// Función para procesar los datos recién guardados
function processSavedData(data) {
  console.log('Procesando datos guardados:', data);
  // Aquí puedes añadir cualquier lógica adicional para procesar los datos
}
