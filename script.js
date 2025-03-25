const form = document.getElementById('form');
const shortLink = document.getElementById('short-link');

// Guardar URL acortada
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('url').value;
    
    // Generar código corto (ej: "elxppj")
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    // Guardar en Firestore
    await db.collection("urls").doc(shortCode).set({
        originalUrl: url,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // Mostrar enlace acortado (usando parámetros ?code)
    const shortUrl = `${window.location.origin}?${shortCode}`;
    shortLink.href = shortUrl;
    shortLink.textContent = shortUrl;
});

// Redirección al abrir el enlace acortado
const params = new URLSearchParams(window.location.search);
const shortCode = params.keys().next().value;

if (shortCode) {
    db.collection("urls").doc(shortCode).get()
        .then(doc => {
            if (doc.exists) {
                window.location.href = doc.data().originalUrl; // Redirige a la URL original
            } else {
                document.body.innerHTML = "<h1 class='text-center mt-5'>⚠️ Enlace no encontrado</h1>";
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}