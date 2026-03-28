// feedback.js

document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       ELEMENTS
    ========================= */
    const feedbackGrid = document.getElementById("feedbackGrid");
    const feedbackPanel = document.getElementById("feedbackPanel");
    const openPanelBtn = document.getElementById("openPanelBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const feedbackForm = document.getElementById("feedbackForm");
    const filterButtons = document.querySelectorAll(".feedback-filters button");

    /* =========================
       INITIAL STATE (HIDDEN)
    ========================= */
    feedbackPanel?.classList.remove("open");

    /* =========================
       LOCAL STORAGE
    ========================= */
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [
        { name: "Alice", role: "customer", rating: 5, message: "Great website! Easy to use." },
        { name: "Bob", role: "delivery", rating: 4, message: "Fast delivery and good packaging." },
        { name: "Carol", role: "customer", rating: 5, message: "Love the routine feature." }
    ];

    /* =========================
       RENDER
    ========================= */
    function renderFeedback(filter = "all") {
        if (!feedbackGrid) return;

        feedbackGrid.innerHTML = "";

        let data = feedbacks.filter(fb => filter === "all" || fb.role === filter);

        if (window.location.pathname.includes("index.html")) {
            data = data.slice(-4);
        }

        data.reverse().forEach(fb => {
            const stars = "★".repeat(fb.rating) + "☆".repeat(5 - fb.rating);

            const card = document.createElement("div");
            card.className = "feedback-card";
            card.dataset.role = fb.role;

            card.innerHTML = `
                <h4>${fb.name}</h4>
                <div class="feedback-role">${fb.role}</div>
                <div class="feedback-rating">${stars}</div>
                <div class="feedback-message">${fb.message}</div>
            `;

            feedbackGrid.appendChild(card);
        });
    }

    renderFeedback();

    /* =========================
       FILTERS
    ========================= */
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderFeedback(btn.dataset.filter);
        });
    });

    /* =========================
       PANEL TOGGLE
    ========================= */
    openPanelBtn?.addEventListener("click", () => {
        feedbackPanel?.classList.add("open");
    });

    cancelBtn?.addEventListener("click", () => {
        feedbackPanel?.classList.remove("open");
    });

    /* =========================
       SUBMIT
    ========================= */
    feedbackForm?.addEventListener("submit", e => {
        e.preventDefault();

        const name = prompt("Enter your name", "Guest");
        if (!name) return;

        const rating = parseInt(document.getElementById("rating")?.value || 0);
        if (rating < 1 || rating > 5) return;

        const message = document.getElementById("message")?.value.trim();
        if (!message) return;

        const category = document.querySelector(".feedback-filters button.active")?.dataset.filter || "customer";

        feedbacks.push({ name, role: category, rating, message });
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

        renderFeedback(category);
        feedbackForm.reset();

        feedbackPanel?.classList.remove("open");
    });

});