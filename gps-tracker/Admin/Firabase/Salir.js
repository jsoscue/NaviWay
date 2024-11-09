import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
export async function cerrarsesion() {
  signOut(auth)
    .then(() => {
      localStorage.removeItem('loggedIn');
      localStorage.removeItem('userPhotoURL');
      window.location.href = '../index.html'; // Redirect to home page
    })
    .catch((error) => {
      console.error('Error signing out:', error);
      alert('Error signing out. Please try again.');
    });
}
