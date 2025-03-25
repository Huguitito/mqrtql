// Reemplaza con TUS datos de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAHZnk75eHtRLLfHslO1QdYLY3gZUrutfs",
  authDomain: "mqrtql.firebaseapp.com",
  databaseURL: "https://mqrtql-default-rtdb.firebaseio.com",
  projectId: "mqrtql",
  storageBucket: "mqrtql.firebasestorage.app",
  messagingSenderId: "711181799625",
  appId: "1:711181799625:web:e5238821f52fc83a433d18"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();