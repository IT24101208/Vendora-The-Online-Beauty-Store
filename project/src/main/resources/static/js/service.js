document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("user"));

    // Sections
    const accountSection = document.getElementById("accountServices");
    const customerSection = document.getElementById("customerServices");
    const supplierSection = document.getElementById("supplierServices");
    const deliverySection = document.getElementById("deliveryServices");
    const paymentSection = document.getElementById("paymentServices");

    const contactForm = document.querySelector(".contact-form form");

    // If NOT logged in
    if (!user) {
        console.log("Guest user");

        // Hide sections
        accountSection.classList.add("hidden");
        customerSection.classList.add("hidden");
        supplierSection.classList.add("hidden");
        deliverySection.classList.add("hidden");
        paymentSection.classList.add("hidden");

        // Disable contact form
        disableContactForm();

        return;
    }

    // Logged-in users
    accountSection.classList.remove("hidden");

    const role = user.role;

    // Hide all role sections first
    customerSection.classList.add("hidden");
    supplierSection.classList.add("hidden");
    deliverySection.classList.add("hidden");
    paymentSection.classList.add("hidden");

    // Role-based visibility
    switch (role) {

        case "CUSTOMER":
            customerSection.classList.remove("hidden");
            paymentSection.classList.remove("hidden");
            break;

        case "SUPPLIER":
            supplierSection.classList.remove("hidden");
            break;

        case "DELIVERY":
            deliverySection.classList.remove("hidden");
            break;

        case "ADMIN":
            // Admin sees everything
            customerSection.classList.remove("hidden");
            supplierSection.classList.remove("hidden");
            deliverySection.classList.remove("hidden");
            paymentSection.classList.remove("hidden");
            break;

        default:
            console.warn("Unknown role");
    }

    // Enable contact form
    enableContactForm();

});


// 🔒 Disable Contact Form (for guests)
function disableContactForm() {
    const form = document.querySelector(".contact-form form");
    const inputs = form.querySelectorAll("input, textarea, button");

    inputs.forEach(el => {
        el.disabled = true;
    });

    form.insertAdjacentHTML("beforebegin",
        `<p style="color:red;">Please log in to send a message.</p>`
    );
}


// ✅ Enable Contact Form
function enableContactForm() {
    const form = document.querySelector(".contact-form form");
    const inputs = form.querySelectorAll("input, textarea, button");

    inputs.forEach(el => {
        el.disabled = false;
    });
}