async function checkCustomer() {
    const email = document.getElementById("email").value;
    const resultDiv = document.getElementById("result");

    if (!email) {
        resultDiv.innerHTML = "<p style='color: red;'>Bitte eine E-Mail eingeben!</p>";
        return;
    }

    try {
        const response = await fetch("api.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (data.data.length > 0) {
            const kunde = data.data[0];
            resultDiv.innerHTML = `
                <p><b>Name:</b> ${kunde.firstName} ${kunde.lastName}</p>
                <p><b>E-Mail:</b> ${kunde.email}</p>
                <p><b>ID:</b> ${kunde.id}</p>
            `;
        } else {
            resultDiv.innerHTML = "<p style='color: red;'>Kunde nicht gefunden!</p>";
        }
    } catch (error) {
        console.error("Fehler:", error);
        resultDiv.innerHTML = "<p style='color: red;'>Fehler beim Abrufen der Daten!</p>";
    }
}