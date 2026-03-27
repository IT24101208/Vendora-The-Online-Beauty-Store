// Service interactivity data: visible/hidden service sections, FAQ modal state, contact form enabled/disabled.

document.addEventListener("DOMContentLoaded", () => {

    /* SECTION TOGGLES */
    const sections = {
        account: document.getElementById("accountServices"),
        customer: document.getElementById("customerServices"),
        supplier: document.getElementById("supplierServices"),
        delivery: document.getElementById("deliveryServices"),
        payment: document.getElementById("paymentServices")
    };

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        console.log("Guest user: hiding all role-based sections");
        Object.values(sections).forEach(sec => sec?.classList.add("hidden"));
        disableContactForm();
    } else {
        // Hide all initially
        Object.values(sections).forEach(sec => sec?.classList.add("hidden"));

        // Show sections based on role
        const role = user.role;
        if (role === "CUSTOMER") {
            sections.customer?.classList.remove("hidden");
            sections.payment?.classList.remove("hidden");
        } else if (role === "SUPPLIER") {
            sections.supplier?.classList.remove("hidden");
        } else if (role === "DELIVERY") {
            sections.delivery?.classList.remove("hidden");
        } else if (role === "ADMIN") {
            Object.values(sections).forEach(sec => sec?.classList.remove("hidden"));
        }
        enableContactForm();
    }

    /* CONTACT FORM UX */
    const contactForm = document.querySelector(".contact-form form");
    contactForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        document.getElementById("formResponse").innerText = "✅ Message sent successfully!";
    });

    function disableContactForm() {
        const inputs = contactForm?.querySelectorAll("input, textarea, button") || [];
        inputs.forEach(el => el.disabled = true);
        contactForm?.insertAdjacentHTML("beforebegin",
            `<p style="color:red;">Please log in to send a message.</p>`
        );
    }

    function enableContactForm() {
        const inputs = contactForm?.querySelectorAll("input, textarea, button") || [];
        inputs.forEach(el => el.disabled = false);
    }

    /* FAQ MODAL */
    const faqModal = document.getElementById("faqModal");
    const closeBtn = faqModal?.querySelector(".close");
    const openFaqBtn = document.getElementById("openFaq");

    openFaqBtn?.addEventListener("click", () => {
        faqModal.classList.remove("hidden");
        setTimeout(() => faqModal.classList.add("show"), 10);
    });

    closeBtn?.addEventListener("click", () => {
        faqModal.classList.remove("show");
        setTimeout(() => faqModal.classList.add("hidden"), 300);
    });

    window.addEventListener("click", (e) => {
        if (e.target === faqModal) {
            faqModal.classList.remove("show");
            setTimeout(() => faqModal.classList.add("hidden"), 300);
        }
    });
});