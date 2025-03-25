const form = document.getElementById('form');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('url').value;
    
    // Generar código corto aleatorio (ej: "aB3dEf")
    const shortCode = Math.random().toString(36).substring(2, 8);
    
    // Guardar en Firebase
    await db.collection('urls').doc(shortCode).set({
        originalUrl: url
    });
    
    // Mostrar resultado
    const shortUrl = `${window.location.origin}/${shortCode}`;
    resultDiv.innerHTML = `URL acortada: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
});