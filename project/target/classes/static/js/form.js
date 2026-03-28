// Form data: delivery, supplier, and routine form inputs, validations, submissions, dynamic required fields.

document.addEventListener("DOMContentLoaded", () => {

    /* CATEGORY TOGGLE (Supplier Products) */
    const categoryCheckboxes = document.querySelectorAll('input[name="productCategories[]"]');
    const productSections = document.querySelectorAll('.form-grid .routine');

    if (categoryCheckboxes.length && productSections.length) {
        categoryCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                productSections.forEach(section => {
                    const category = section.getAttribute('data-category');
                    const isChecked = document.querySelector(`input[name="productCategories[]"][value="${category}"]`)?.checked;
                    section.style.display = isChecked ? 'block' : 'none';
                    section.querySelector('textarea').required = isChecked;
                });
            });
        });
    }

    /* FORM SUBMISSION */
    const formIds = ["deliveryForm", "registrationForm", "supplierForm"];

    formIds.forEach(formId => {
        const form = document.getElementById(formId);
        if (!form) return;
        form.addEventListener("submit", e => {
            e.preventDefault();

            // PHONE VALIDATION 
            const phone = form.querySelector("#phone")?.value.trim();
            const emergencyPhone = form.querySelector("#emergencyPhone")?.value.trim();
            if (phone && emergencyPhone && phone === emergencyPhone) {
                alert("Emergency phone number cannot be the same as your phone number.");
                return;
            }

            // PROFILE PICTURE SIZE 
            const profileFile = form.querySelector("#profilePicture")?.files[0];
            if (profileFile && profileFile.size > 2 * 1024 * 1024) {
                alert("Profile picture must be less than 2MB");
                return;
            }

            // SUPPLIER PRODUCT CATEGORY VALIDATION 
            const productCategories = form.querySelectorAll('input[name="productCategories[]"]');
            if (productCategories.length) {
                const selected = Array.from(productCategories).some(cb => cb.checked);
                if (!selected) {
                    alert("Please select at least one product category.");
                    return;
                }

                const sections = form.querySelectorAll(".routine");
                for (let sec of sections) {
                    const textarea = sec.querySelector("textarea");
                    if (sec.style.display !== "none" && textarea.value.trim() === "") {
                        alert(`Please enter product details for ${textarea.id.replace("Products", "")}.`);
                        return;
                    }
                }
            }

            // VEHICLE INPUTS (Delivery Form) 
            const visibleVehicle = form.querySelector(".partner[style*='block']");
            if (visibleVehicle) {
                const inputs = visibleVehicle.querySelectorAll("input");
                for (let input of inputs) {
                    if (input.required && input.value.trim() === "") {
                        alert(`Please fill ${input.previousElementSibling.textContent}`);
                        return;
                    }
                }
            }

            // SUCCESS 
            alert("Registration submitted successfully!");
            window.location.href = "index.html"; // redirect home
        });
    });
});

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

/* GLOBAL CANCEL FUNCTION */
function cancelForm() {
    if (confirm("Cancel registration? All entered data will be lost.")) {
        window.location.href = "index.html";
    }
}