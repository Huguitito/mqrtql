// Reemplaza con TUS datos de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAHZnk75eHtRLLfHslO1QdYLY3gZUrutfs",
    authDomain: "mqrtql.firebaseapp.com",
    databaseURL: "https://mqrtql-default-rtdb.firebaseio.com",
    projectId: "mqrtql",
    storageBucket: "mqrtql.firebasestorage.app",
    messagingSenderId: "711181799625",
    appId: "1:711181799625:web:323213597c121794433d18"
  };

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Hacer disponible globalmente
window.firebaseDb = db;