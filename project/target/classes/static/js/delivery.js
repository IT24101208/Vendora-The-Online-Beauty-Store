// delivery.js
document.addEventListener("DOMContentLoaded", () => {

    /* ---------------- VEHICLE SELECTION ---------------- */
    const vehicleSelect = document.getElementById("vehicleFilter");
    const vehicleSections = {
        bike: document.querySelector(".bike"),
        car: document.querySelector(".car"),
        van: document.querySelector(".van")
    };
    const vehicleInputs = {
        bike: ["bikeModel", "bikePlate"],
        car: ["carModel", "carPlate"],
        van: ["vanModel", "vanPlate"]
    };

    // Hide all vehicle sections initially
    Object.values(vehicleSections).forEach(sec => sec.style.display = "none");

    // Show selected vehicle section
    vehicleSelect?.addEventListener("change", () => {
        Object.keys(vehicleSections).forEach(type => {
            const sec = vehicleSections[type];
            sec.style.display = "none"; // hide all
            vehicleInputs[type].forEach(id => {
                const input = document.getElementById(id);
                input.required = false; // remove required
                input.value = "";       // clear input
            });
        });

        const selected = vehicleSelect.value;
        if (vehicleSections[selected]) {
            const sec = vehicleSections[selected];
            sec.style.display = "block"; // show selected
            vehicleInputs[selected].forEach(id => document.getElementById(id).required = true);
        }
    });

    /* ---------------- PROVINCE → DISTRICT LOGIC ---------------- */
    const province = document.getElementById("deliveryProvince");
    const district = document.getElementById("district");

    const districts = {
        western: ["Colombo", "Gampaha", "Kalutara"],
        central: ["Kandy", "Matale", "Nuwara Eliya"],
        southern: ["Galle", "Matara", "Hambantota"],
        eastern: ["Ampara", "Batticaloa", "Trincomalee"],
        northCentral: ["Anuradhapura", "Polonnaruwa"],
        northern: ["Jaffna", "Kilinochchi", "Mannar", "Mullaitivu", "Vavuniya"],
        northWestern: ["Kurunegala", "Puttalam"],
        uva: ["Badulla", "Moneragala"],
        sabaragamuwa: ["Ratnapura", "Kegalle"]
    };

    province?.addEventListener("change", () => {
        district.innerHTML = '<option value="">Select District</option>'; // reset
        if (!province.value || !districts[province.value]) return;
        districts[province.value].forEach(d => {
            const opt = document.createElement("option");
            opt.value = d;
            opt.textContent = d;
            district.appendChild(opt);
        });
    });

    /* ---------------- INITIALIZATION ---------------- */
    // Optional: pre-select first option or reset fields
    vehicleSelect?.dispatchEvent(new Event("change"));
});