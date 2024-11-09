import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD0Im_ROxNZcWaBhj9w4Ncrh7MOELnWZGE",
  authDomain: "naviway-database.firebaseapp.com",
  projectId: "naviway-database",
  storageBucket: "naviway-database.appspot.com",
  messagingSenderId: "35224588554",
  appId: "1:35224588554:web:8a44a81de4c5820a2c2af3",
  measurementId: "G-MTB3GZZZ9N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

auth.languageCode = 'es';

export async function registrar() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('passwordS').value;
  const name = document.getElementById('name').value;
  const license = document.getElementById('license').value;
  const phoneNumber = document.getElementById('phone').value;

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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('Usuario creado:', user);

    await setDoc(doc(db, "drivers", user.uid), {
      name: name,
      email: email,
      license: license,
      phoneNumber: phoneNumber
    });

    console.log("Datos guardados en Firestore");
    alert("Usuario registrado exitosamente y datos guardados en Firestore.");
    window.location.href = '../inicio/index.html';  
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

export async function inicio() {
  const email2 = document.getElementById('email2').value;
  const password2 = document.getElementById('password2').value;
  if (!email2 || !password2) {
    alert('Por favor, ingresa un correo electrónico y una contraseña.');
    return;
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email2, password2);
    console.log('Usuario iniciado:', userCredential.user);
    alert('Inicio de sesión exitoso');
    
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('Error al iniciar sesión: ' + error.message);
  }
}
export async function cerrar() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('userPhotoURL');
      window.location.href = '../inicio/index.html'; // Redirect to home page
    })
    .catch((error) => {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    });
}

window.registrar = registrar;
window.inicio = inicio;
window.cerrar = cerrar;