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
export async function cerrarsesion() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('userPhotoURL');
      window.location.href = '../../index.html'; // Redirect to home page
    })
    .catch((error) => {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    });
}
window.cerrarsesion = cerrarsesion;
