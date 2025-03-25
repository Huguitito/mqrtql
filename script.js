document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const resultDiv = document.getElementById('result');
    
    // Generar código corto aleatorio
    function generateShortCode() {
        return Math.random().toString(36).substring(2, 8);
    }

    // Manejar el envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const originalUrl = document.getElementById('url').value;
        
        if (!originalUrl.startsWith('http')) {
            resultDiv.innerHTML = `<div class="alert alert-danger">Por favor ingresa una URL válida (debe comenzar con http:// o https://)</div>`;
            return;
        }

        try {
            const shortCode = generateShortCode();
            const { doc, setDoc } = window.firebaseMethods;
            
            // Guardar en Firestore
            await setDoc(doc(window.db, "urls", shortCode), {
                originalUrl: originalUrl,
                createdAt: new Date().toISOString()
            });

            // Mostrar resultado
            const shortUrl = `${window.location.origin}?${shortCode}`;
            resultDiv.innerHTML = `
                <div class="alert alert-success">
                    <strong>✅ URL acortada:</strong><br>
                    <a href="${shortUrl}" target="_blank">${shortUrl}</a>
                </div>
                <button onclick="copyToClipboard('${shortUrl}')" class="btn btn-sm btn-outline-secondary mt-2">
                    Copiar enlace
                </button>
            `;
            
            // Limpiar el campo de entrada
            document.getElementById('url').value = '';
        } catch (error) {
            console.error("Error:", error);
            resultDiv.innerHTML = `<div class="alert alert-danger">Ocurrió un error: ${error.message}</div>`;
        }
    });

    // Función para copiar al portapapeles
    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("¡Enlace copiado!");
        });
    };

    // Manejar redirección al cargar la página
    const params = new URLSearchParams(window.location.search);
    const shortCode = params.get(0) || params.keys().next().value;

    if (shortCode) {
        redirectToOriginalUrl(shortCode);
    }

    async function redirectToOriginalUrl(code) {
        try {
            const { doc, getDoc } = window.firebaseMethods;
            const docRef = doc(window.db, "urls", code);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                window.location.href = docSnap.data().originalUrl;
            } else {
                document.body.innerHTML = `
                    <div class="container mt-5">
                        <div class="alert alert-danger">
                            <h4>⚠️ Enlace no encontrado</h4>
                            <p>El enlace acortado no existe o ha expirado.</p>
                            <a href="/" class="btn btn-primary">Volver al acortador</a>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error("Error de redirección:", error);
            document.body.innerHTML = `
                <div class="container mt-5">
                    <div class="alert alert-danger">
                        <h4>❌ Error del sistema</h4>
                        <p>No se pudo redirigir: ${error.message}</p>
                    </div>
                </div>
            `;
        }
    }
});