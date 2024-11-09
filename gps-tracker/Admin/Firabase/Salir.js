export async function cerrar() {
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
