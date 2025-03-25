async function checkCustomer() {
    const email = document.getElementById("email").value.trim();  // trim() entfernt führende und abschließende Leerzeichen
    const resultDiv = document.getElementById("result");

    if (!email) {
        resultDiv.innerHTML = "<p style='color: red;'>Bitte eine E-Mail eingeben!</p>";
        return;
    }

    try {
        const response = await fetch("api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Serverantwort: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || data.error) {
            resultDiv.innerHTML = `<p style='color: red;'>${data.error || "Kunde nicht gefunden!"}</p>`;
            return;
        }

        const kunde = data.customer;
        resultDiv.innerHTML = `
            <p><b>Name:</b> ${kunde.firstName} ${kunde.lastName}</p>
            <p><b>E-Mail:</b> ${kunde.email}</p>
            <p><b>ID:</b> ${kunde.id ?? "Keine ID vorhanden"}</p>
        `;
    } catch (error) {
        console.error("Fehler:", error);
        resultDiv.innerHTML = `<p style='color: red;'>Fehler beim Abrufen der Daten: ${error.message}</p>`;
    }
}