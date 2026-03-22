// feedback.js
document.addEventListener("DOMContentLoaded", () => {

    /* ---------------- ELEMENTS ---------------- */
    const feedbackGrid = document.getElementById("homeFeedbackGrid") || document.getElementById("feedbackGrid");
    const feedbackPanel = document.getElementById("feedbackPanel");
    const openPanelBtn = document.getElementById("openPanelBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const feedbackForm = document.getElementById("feedbackForm");

    /* ---------------- LOCAL STORAGE ---------------- */
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [
        { name: "Alice", role: "customer", rating: 5, message: "Great website! Easy to use and love the products." },
        { name: "Bob", role: "delivery", rating: 4, message: "Delivery was fast and the packaging is excellent." },
        { name: "Carol", role: "customer", rating: 5, message: "I love the custom routine feature. It helps me pick the right products." }
    ];

    /* ---------------- RENDER FEEDBACK ---------------- */
    function renderFeedback(filter = "all", targetGrid = feedbackGrid) {
        if (!targetGrid) return;
        targetGrid.innerHTML = "";

        // Filter feedbacks
        feedbacks
            .filter(fb => filter === "all" || fb.role === filter)
            .slice(-4) // show latest 4
            .reverse()
            .forEach(fb => {
                const stars = "★".repeat(fb.rating) + "☆".repeat(5 - fb.rating);
                const card = document.createElement("div");
                card.classList.add("feedback-card");
                card.dataset.role = fb.role;
                card.innerHTML = `
                    <h4>${fb.name}</h4>
                    <div class="feedback-role">${fb.role}</div>
                    <div class="feedback-rating">${stars}</div>
                    <div class="feedback-message">${fb.message}</div>
                `;
                targetGrid.appendChild(card);
            });
    }

    renderFeedback();

    /* ---------------- FILTER BUTTONS ---------------- */
    document.querySelectorAll(".feedback-filters button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".feedback-filters button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderFeedback(btn.dataset.filter);
        });
    });

    /* ---------------- PANEL TOGGLE ---------------- */
    openPanelBtn?.addEventListener("click", () => feedbackPanel?.classList.add("open"));
    cancelBtn?.addEventListener("click", () => feedbackPanel?.classList.remove("open"));

    /* ---------------- SUBMIT FEEDBACK ---------------- */
    feedbackForm?.addEventListener("submit", e => {
        e.preventDefault();

        const name = prompt("Enter your name (simulate registered user)", "Guest");
        if (!name) return alert("Only registered users can submit feedback.");

        const rating = parseInt(document.getElementById("rating")?.value || 0);
        if (!rating || rating < 1 || rating > 5) return alert("Please select a rating (1-5).");

        const message = document.getElementById("message")?.value.trim();
        if (!message) return alert("Please enter a message.");

        const category = document.querySelector(".feedback-filters button.active")?.dataset.filter || "customer";

        // Add new feedback
        feedbacks.push({ name, role: category, rating, message });
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

        renderFeedback(category);
        feedbackForm.reset();
        feedbackPanel?.classList.remove("open");
        alert("Feedback submitted successfully!");
    });

});