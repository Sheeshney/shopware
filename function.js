async function checkCustomer() {
    const email = document.getElementById("email").value.trim();
    const resultDiv = document.getElementById("result");

    if (!email) {
        resultDiv.innerHTML = `
            <div class="bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow-md flex items-center">
                <i class="bi bi-exclamation-circle text-xl mr-2"></i> Bitte eine E-Mail eingeben!
            </div>`;
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
            resultDiv.innerHTML = `
                <div class="bg-red-100 text-red-800 p-4 rounded-lg shadow-md flex items-center">
                    <i class="bi bi-x-circle text-xl mr-2"></i> ${data.error}
                </div>`;
            return;
        }

        const kunde = data.customer;
        const attributes = kunde.attributes;
        resultDiv.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 mt-4 transition-transform transform hover:scale-105">
                <div class="bg-blue-500 text-white p-4 rounded-t-lg text-lg font-semibold flex items-center">
                    <i class="bi bi-person-check text-2xl mr-2"></i> Kundendaten
                </div>
                <div class="p-4 space-y-2">
                <p><i class="bi bi-person"></i> <strong>Name:</strong> ${attributes.firstName} ${attributes.lastName}</p>
                <p><i class="bi bi-person"></i> <strong>Name:</strong> ${attributes.firstName} ${attributes.lastName}</p>
                <p><i class="bi bi-envelope"></i> <strong>E-Mail:</strong> ${attributes.email}</p>
                <p><i class="bi bi-hash"></i> <strong>ID:</strong> ${kunde.id}</p>
                <p><i class="bi bi-person-badge"></i> <strong>Kundennummer:</strong> ${attributes.customerNumber}</p>
                <p><i class="bi bi-building"></i> <strong>Firma:</strong> ${attributes.company || "Keine Firma hinterlegt"}</p>
                <p><i class="bi bi-calendar-check"></i> <strong>Erstellt am:</strong> ${new Date(attributes.createdAt).toLocaleDateString()}</p>
                <p><i class="bi bi-pencil-square"></i> <strong>Aktualisiert am:</strong> ${new Date(attributes.updatedAt).toLocaleDateString()}</p>
                <p><i class="bi bi-check-circle"></i> <strong>Aktiv:</strong> ${attributes.active ? "Ja" : "Nein"}</p>
                <p><i class="bi bi-person-x"></i> <strong>Gastkonto:</strong> ${attributes.guest ? "Ja" : "Nein"}</p>
                <p><i class="bi bi-calendar-heart"></i> <strong>Geburtsdatum:</strong> ${attributes.birthday ? new Date(attributes.birthday).toLocaleDateString() : "Nicht angegeben"}</p>
                <p><i class="bi bi-cart"></i> <strong>Anzahl Bestellungen:</strong> ${attributes.orderCount}</p>
                <p><i class="bi bi-currency-euro"></i> <strong>Gesamtausgaben:</strong> ${attributes.orderTotalAmount.toFixed(2)} €</p>
                <p><i class="bi bi-star"></i> <strong>Anzahl Bewertungen:</strong> ${attributes.reviewCount}</p>
                <p><i class="bi bi-receipt"></i> <strong>USt-IDs:</strong> ${attributes.vatIds.length ? attributes.vatIds.join(", ") : "Keine hinterlegt"}</p>
                <p><i class="bi bi-envelope-check"></i> <strong>Newsletter Opt-In:</strong> ${attributes.doubleOptInRegistration ? "Ja" : "Nein"}</p>
                </div>
            </div>`;
    } catch (error) {
        console.error("Fehler:", error);
        resultDiv.innerHTML = `
            <div class='bg-red-100 text-red-800 p-4 rounded-lg shadow-md flex items-center'>
                <i class="bi bi-x-circle text-xl mr-2"></i> Fehler beim Abrufen der Daten: ${error.message}
            </div>`;
    }
}