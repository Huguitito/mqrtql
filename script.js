document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form');
    const resultDiv = document.getElementById('result');
    const db = firebase.firestore();
    
    function showSuccess(shortCode) {
        const currentUrl = window.location.href;
        const urlObj = new URL(currentUrl);
        let basePath = urlObj.pathname;
        
        // Ajustar la ruta base
        if (basePath.endsWith('/')) {
            basePath = basePath.slice(0, -1);
        }
        
        // Construir URL final
        const fullShortUrl = `${urlObj.origin}${basePath}?${shortCode}`;
        
        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <strong>✅ URL acortada:</strong><br>
                <div class="input-group mt-2">
                    <input type="text" id="short-url" class="form-control" value="${fullShortUrl}" readonly>
                    <button class="btn btn-outline-secondary" onclick="copyToClipboard('${fullShortUrl}')">
                        Copiar
                    </button>
                </div>
                <small class="text-muted d-block mt-2">Este enlace redirigirá a tu URL original</small>
            </div>
        `;
    }

    function showError(message) {
        resultDiv.innerHTML = `<div class="alert alert-danger">${message}</div>`;
    }

    window.copyToClipboard = function(text) {
        navigator.clipboard.writeText(text).then(() => {
            const copyBtn = document.querySelector('#result button');
            copyBtn.textContent = '¡Copiado!';
            setTimeout(() => {
                copyBtn.textContent = 'Copiar';
            }, 2000);
        });
    };

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const url = document.getElementById('url').value.trim();
        
        if (!url) {
            showError("Por favor ingresa una URL");
            return;
        }

        try {
            const shortCode = Math.random().toString(36).substring(2, 8);
            await db.collection("urls").doc(shortCode).set({
                originalUrl: url,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            showSuccess(shortCode);
            document.getElementById('url').value = '';
        } catch (error) {
            console.error("Error:", error);
            showError("Error al acortar la URL");
        }
    });

    // Redirección
    const params = new URLSearchParams(window.location.search);
    const shortCode = params.keys().next().value;
    if (shortCode) {
        db.collection("urls").doc(shortCode).get()
            .then(doc => {
                if (doc.exists) window.location.href = doc.data().originalUrl;
                else showError("Enlace no encontrado");
            })
            .catch(error => {
                console.error("Error:", error);
                showError("Error al cargar el enlace");
            });
    }
});