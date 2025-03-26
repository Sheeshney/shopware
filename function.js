async function checkCustomer() {
    const email = document.getElementById("email").value.trim();
    const resultDiv = document.getElementById("result");

    if (!email) {
        resultDiv.innerHTML = `<div class="alert alert-warning"><i class="bi bi-exclamation-circle"></i> Bitte eine E-Mail eingeben!</div>`;
        return;
    }

    try {
        const response = await fetch("api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        if (!response.ok) {
            throw new Error(`Serverantwort: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.error) {
            resultDiv.innerHTML = `<div class="alert alert-danger"><i class="bi bi-x-circle"></i> ${data.error}</div>`;
            return;
        }

        const kunde = data.customer;
        const attributes = kunde.attributes;
        resultDiv.innerHTML = `
            <div class="card shadow-sm mt-3">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0"><i class="bi bi-person-check"></i> Kundendaten</h5>
                </div>
                <div class="card-body">
                    <p><i class="bi bi-person"></i> <strong>Name:</strong> ${attributes.firstName} ${attributes.lastName}</p>
                    <p><i class="bi bi-envelope"></i> <strong>E-Mail:</strong> ${attributes.email}</p>
                    <p><i class="bi bi-hash"></i> <strong>ID:</strong> ${kunde.id ?? "Keine ID vorhanden"}</p>
                    <p><i class="bi bi-person-badge"></i> <strong>Kundennummer:</strong> ${attributes.customerNumber ?? "Nicht verfügbar"}</p>
                    <p><i class="bi bi-calendar-check"></i> <strong>Erstellt am:</strong> ${new Date(attributes.createdAt).toLocaleDateString() ?? "Unbekannt"}</p>
                    <p><i class="bi bi-clock-history"></i> <strong>Letzter Login:</strong> ${attributes.lastLogin ? new Date(attributes.lastLogin).toLocaleString() : "Nie"}</p>
                    <p><i class="bi bi-calendar-heart"></i> <strong>Geburtsdatum:</strong> ${attributes.birthday ? new Date(attributes.birthday).toLocaleDateString() : "Nicht angegeben"}</p>
                </div>
            </div>
        `;
    } catch (error) {
        console.error("Fehler:", error);
        resultDiv.innerHTML = `<div class='alert alert-danger'><i class="bi bi-x-circle"></i> Fehler beim Abrufen der Daten: ${error.message}</div>`;
    }
}