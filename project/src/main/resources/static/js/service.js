// Service interactivity data: visible/hidden service sections, contact form enabled/disabled.
document.addEventListener("DOMContentLoaded", () => {

    /* Section Toggles */
    const sections = {
        account: document.getElementById("accountServices"),
        customer: document.getElementById("customerServices"),
        supplier: document.getElementById("supplierServices"),
        delivery: document.getElementById("deliveryServices")
    };

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        console.log("Guest user: hiding all role-based sections");
        Object.values(sections).forEach(sec => sec?.classList.add("hidden"));   // Hide all initially
        disableContactForm();

    } else {
        Object.values(sections).forEach(sec => sec?.classList.add("hidden"));
        const role = user.role;     // Show sections based on role
        if (role === "CUSTOMER") {
            sections.customer?.classList.remove("hidden");
        } else if (role === "SUPPLIER") {
            sections.supplier?.classList.remove("hidden");
        } else if (role === "DELIVERY") {
            sections.delivery?.classList.remove("hidden");
        } else if (role === "ADMIN") {
            Object.values(sections).forEach(sec => sec?.classList.remove("hidden"));
        }
        enableContactForm();
    }

    /* Contact Form UX */
    const sendMailBtn = document.querySelector(".send-mail-btn");
    const formResponse = document.getElementById("formResponse");
    const contactBox = document.querySelector(".contact-form");

    // Show response after clicking SEND NOW
    sendMailBtn?.addEventListener("click", () => {
        formResponse.innerHTML = `
            <div class="mail-success-box">
                <h4>📩 Message Ready to Send!</h4>
                <p>
                    Thank you for reaching out to <strong>Vendora Support</strong>.
                    Your email app has been opened so you can send your message directly.
                </p>
                <p>
                    Once we receive your email, our support team will carefully review it and get back to you as soon as possible.
                </p>
                <p>
                    ⏳ <strong>Please allow some time for our response</strong>, especially for package, supplier, delivery, or order-related concerns.
                </p>
                <p>
                    💡 Whether you're a <strong>Customer</strong>, <strong>Supplier</strong>, or <strong>Delivery Partner</strong>,
                    we appreciate your patience and will do our best to assist you quickly.
                </p>
                <p>
                    ❤️ Thank you for contacting us and being part of <strong>Vendora</strong>.
                </p>
            </div>
        `;
    });

    // Disable support access
    function disableContactForm() {
        if (sendMailBtn) {
            sendMailBtn.classList.add("disabled-mail");
            sendMailBtn.setAttribute("aria-disabled", "true");
            sendMailBtn.removeAttribute("href");
        }

        if (!document.querySelector(".login-warning-msg")) {
            contactBox?.insertAdjacentHTML(
                "afterbegin",
                `
                <p class="login-warning-msg" style="color:red; margin-top:10px;">
                    Please log in to send a message.
                </p>
                `
            );
        }
    }

    // Enable support access
    function enableContactForm() {
        if (sendMailBtn) {
            sendMailBtn.classList.remove("disabled-mail");
            sendMailBtn.setAttribute(
                "href",
                "mailto:vendorabeautystore@gmail.com?subject=Customer Support Message - Vendora"
            );
            sendMailBtn.removeAttribute("aria-disabled");
        }

        document.querySelector(".login-warning-msg")?.remove();
    }
});