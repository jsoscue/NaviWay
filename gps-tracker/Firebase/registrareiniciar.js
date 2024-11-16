// Importa los módulos necesarios desde Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Configuración de Firebase, con claves y detalles del proyecto
const firebaseConfig = {
  apiKey: "AIzaSyD0Im_ROxNZcWaBhj9w4Ncrh7MOELnWZGE",
  authDomain: "naviway-database.firebaseapp.com",
  projectId: "naviway-database",
  storageBucket: "naviway-database.appspot.com",
  messagingSenderId: "35224588554",
  appId: "1:35224588554:web:8a44a81de4c5820a2c2af3",
  measurementId: "G-MTB3GZZZ9N"
};

// Inicializa Firebase con la configuración proporcionada
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Configura el idioma de autenticación a español
auth.languageCode = 'es';

/**
 * Función para registrar un nuevo usuario en Firebase
 */
export async function registrar() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('passwordS').value;
  const name = document.getElementById('name').value;
  const license = document.getElementById('license').value;
  const phoneNumber = document.getElementById('phone').value;

  // Verifica que todos los campos estén llenos
  if (!email || !password || !name || !license || !phoneNumber) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Validación de formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Por favor, ingresa un correo electrónico válido.");
    return;
  }

  try {
    // Crea un nuevo usuario con correo electrónico y contraseña
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('Usuario creado:', user);

    // Guarda los datos del usuario en Firestore
    await setDoc(doc(db, "drivers", user.uid), {
      name: name,
      email: email,
      license: license,
      phoneNumber: phoneNumber
    });

    console.log("Datos guardados en Firestore");
    alert("Usuario registrado exitosamente y datos guardados en Firestore.");
    window.location.href = '../index.html';  
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    if (error.code === 'auth/email-already-in-use') {
      alert("El correo electrónico ya está en uso.");
    } else if (error.code === 'auth/invalid-email') {
      alert("Correo electrónico no válido.");
    } else if (error.code === 'auth/weak-password') {
      alert("La contraseña es muy débil.");
    } else {
      alert("Error al registrar el usuario: " + error.message);
    }
  }
}

/**
 * Función para iniciar sesión con un usuario existente en Firebase
 */
export async function inicio() {
  const email2 = document.getElementById('email2').value;
  const password2 = document.getElementById('password2').value;
  
  // Verifica que ambos campos estén llenos
  if (!email2 || !password2) {
    alert('Por favor, ingresa un correo electrónico y una contraseña.');
    return false;
  }

  try {
    // Inicia sesión con correo electrónico y contraseña
    const userCredential = await signInWithEmailAndPassword(auth, email2, password2);
    console.log('Usuario iniciado:', userCredential.user);
    alert('Inicio de sesión exitoso');
    return true; // Retornar verdadero si el inicio de sesión fue exitoso
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error al iniciar sesión: ' + error.message);
    return false; // Retornar falso si el inicio de sesión falló
  }
}

/**
 * Función para cerrar sesión en Firebase
 */
export async function cerrar() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('userPhotoURL');
      window.location.href = '../index.html'; // Redirige a la página principal
    })
    .catch((error) => {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    });
}

// Asigna las funciones al objeto window para que estén disponibles globalmente
window.registrar = registrar;
window.inicio = inicio;
window.cerrar = cerrar;
