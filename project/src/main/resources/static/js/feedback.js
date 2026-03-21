document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       FAKE LOGGED-IN USER
    ========================== */
    const user = {
        name: "Venom",
        role: "customer" // change: customer | supplier | delivery
    };

    const loggedUserText = document.getElementById("loggedUser");
    loggedUserText.textContent = `Current User: ${user.name} (${user.role})`;

    /* =========================
       ELEMENTS
    ========================== */
    const grid = document.getElementById("feedbackGrid");
    const form = document.getElementById("feedbackForm");
    const panel = document.getElementById("feedbackPanel");
    const openBtn = document.getElementById("openPanelBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const minimizeBtn = document.getElementById("minimizeBtn");
    const filterBtns = document.querySelectorAll(".feedback-filters button");

    /* =========================
       LOAD FROM STORAGE
    ========================== */
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

    /* =========================
       DISPLAY FUNCTION
    ========================== */
    function displayFeedback(list) {
        grid.innerHTML = "";

        if (list.length === 0) {
            grid.innerHTML = "<p>No feedback yet.</p>";
            return;
        }

        list.forEach(f => {
            const card = document.createElement("div");
            card.classList.add("feedback-card");
            card.setAttribute("data-role", f.role);

            card.innerHTML = `
                <h4>${f.name}</h4>
                <span class="feedback-role">${f.role}</span>
                <div class="feedback-rating">${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)}</div>
                <p class="feedback-message">${f.message}</p>
            `;

            grid.appendChild(card);
        });
    }

    /* =========================
       INITIAL LOAD
    ========================== */
    displayFeedback(feedbacks);

    /* =========================
       FILTER SYSTEM
    ========================== */
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {

            // active button UI
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const type = btn.dataset.filter;

            if (type === "all") {
                displayFeedback(feedbacks);
            } else {
                const filtered = feedbacks.filter(f => f.role === type);
                displayFeedback(filtered);
            }
        });
    });

    /* =========================
       OPEN PANEL
    ========================== */
    openBtn.addEventListener("click", () => {
        panel.classList.add("active");
    });

    /* =========================
       MINIMIZE PANEL
    ========================== */
    minimizeBtn.addEventListener("click", () => {
        panel.classList.remove("active");
    });

    /* =========================
       CANCEL BUTTON
    ========================== */
    cancelBtn.addEventListener("click", () => {
        panel.classList.remove("active");
    });

    /* =========================
       FORM SUBMIT
    ========================== */
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const rating = document.getElementById("rating").value;
        const message = document.getElementById("message").value.trim();

        if (!rating || message === "") {
            alert("Please fill all fields");
            return;
        }

        const newFeedback = {
            name: user.name,
            role: user.role,
            rating: parseInt(rating),
            message: message
        };

        feedbacks.push(newFeedback);

        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

        // refresh UI
        displayFeedback(feedbacks);

        // reset form
        form.reset();

        // close panel
        panel.classList.remove("active");

        alert("Feedback submitted!");
    });

});