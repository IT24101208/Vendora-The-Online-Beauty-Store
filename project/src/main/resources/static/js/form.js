document.addEventListener("DOMContentLoaded", () => {

    /* ---------------- SUPPLIER PRODUCT CATEGORY TOGGLE ---------------- */
    const categoryCheckboxes = document.querySelectorAll('input[name="productCategories[]"]');
    const productSections = document.querySelectorAll('.form-grid .routine');

    if (categoryCheckboxes.length > 0 && productSections.length > 0) {
        categoryCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                productSections.forEach(section => {
                    const category = section.getAttribute('data-category');
                    const isChecked = document.querySelector(`input[name="productCategories[]"][value="${category}"]`)?.checked;
                    section.style.display = isChecked ? 'block' : 'none';
                    section.querySelector('textarea').required = isChecked; // dynamic required
                });
            });
        });
    }

    /* ---------------- FORM SUBMISSION ---------------- */
    const formIds = ["deliveryForm", "registrationForm", "supplierForm"]; // include supplier form ID if different

    formIds.forEach(formId => {
        const form = document.getElementById(formId);
        if (!form) return;

        form.addEventListener("submit", e => {
            e.preventDefault();

            /* -------- PHONE VALIDATION -------- */
            const phone = form.querySelector("#phone")?.value.trim();
            const emergencyPhone = form.querySelector("#emergencyPhone")?.value.trim();
            if (phone && emergencyPhone && phone === emergencyPhone) {
                alert("Emergency phone number cannot be the same as your phone number.");
                return;
            }

            /* -------- PROFILE PICTURE SIZE -------- */
            const profileFile = form.querySelector("#profilePicture")?.files[0];
            if (profileFile && profileFile.size > 2 * 1024 * 1024) { // 2MB
                alert("Profile picture must be less than 2MB");
                return;
            }

            /* -------- SUPPLIER PRODUCT CATEGORY VALIDATION -------- */
            const productCategories = form.querySelectorAll('input[name="productCategories[]"]');
            if (productCategories.length > 0) {
                const selected = Array.from(productCategories).some(cb => cb.checked);
                if (!selected) {
                    alert("Please select at least one product category.");
                    return;
                }

                // Required textareas for selected categories
                const sections = form.querySelectorAll(".routine");
                for (let sec of sections) {
                    const textarea = sec.querySelector("textarea");
                    if (sec.style.display !== "none" && textarea.value.trim() === "") {
                        alert(`Please enter product details for ${textarea.id.replace("Products", "")}.`);
                        return;
                    }
                }
            }

            /* -------- VEHICLE INPUTS (Delivery Form) -------- */
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

            /* -------- SUCCESS -------- */
            alert("Registration submitted successfully!");
            window.location.href = "index.html"; // redirect to home
        });
    });
});

/* ---------------- GLOBAL CANCEL FUNCTION ---------------- */
function cancelForm() {
    if (confirm("Cancel registration? All entered data will be lost.")) {
        window.location.href = "index.html";
    }
}