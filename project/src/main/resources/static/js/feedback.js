document.addEventListener("DOMContentLoaded", () => {
    const feedbackGrid = document.getElementById("feedbackGrid");
    const feedbackPanel = document.getElementById("feedbackPanel");
    const openPanelBtn = document.getElementById("openPanelBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const feedbackForm = document.getElementById("feedbackForm");
    const filterButtons = document.querySelectorAll(".feedback-filters button");
    const loggedUserText = document.getElementById("loggedUser");
    const ratingInput = document.getElementById("rating");
    const messageInput = document.getElementById("message");
    feedbackPanel?.classList.remove("open");

    /* Current User */
    const currentUser = getCurrentUser();
    function getCurrentUser() {
        const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (storedUser && storedUser.name && storedUser.role) {
            return {
                id: storedUser.id || generateUserId(storedUser.name, storedUser.role),
                name: storedUser.name,
                role: normalizeRole(storedUser.role)
            };
        }
        return {
            id: "guest-user",
            name: "Guest",
            role: "guest"
        };
    }

    function generateUserId(name, role) {
        return `${role}-${name.toLowerCase().replace(/\s+/g, "-")}`;
    }

    function normalizeRole(role) {
        const value = String(role || "").toLowerCase().trim();
        if (["customer", "supplier", "delivery", "guest", "admin"].includes(value)) {
            return value;
        }
        return "guest";
    }

    function formatRole(role) {
        switch (role) {
            case "guest": return "Guest";
            case "customer": return "Customer";
            case "supplier": return "Supplier";
            case "delivery": return "Delivery Person";
            case "admin": return "Admin";
            default: return "Guest";
        }
    }

    function formatCategory(category) {
        return category === "routine" ? "Routine" : "General";
    }

    if (loggedUserText) {
        loggedUserText.textContent = `User: ${currentUser.name} (${formatRole(currentUser.role)})`;
    }

    /* Storage */
    let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
    function saveFeedbacks() {
        localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
    }

    /* Render */
    function renderFeedback(filter = "all") {
        if (!feedbackGrid) return;
        feedbackGrid.innerHTML = "";
        let data = feedbacks.filter(fb => {
            if (filter === "all") return true;
            if (filter === "routine") return fb.category === "routine";
            return fb.role === filter;
        });

        data = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (!data.length) {
            feedbackGrid.innerHTML = `
                <div class="empty-feedback">
                    <i class="fas fa-comment-slash" style="font-size: 28px; margin-bottom: 12px;"></i>
                    <p>No feedback available for this category yet.</p>
                </div>
            `;
            return;
        }

        data.forEach(fb => {
            const stars = "★".repeat(fb.rating) + "☆".repeat(5 - fb.rating);
            const canDelete = currentUser.role === "admin" || currentUser.id === fb.userId;
            const card = document.createElement("div");
            card.className = "feedback-card";
            card.dataset.role = fb.role;
            card.dataset.category = fb.category || "general";

            card.innerHTML = `
                <div class="feedback-top">
                    <div class="feedback-user-block">
                        <h4>${escapeHTML(fb.name)}</h4>
                        <div class="feedback-date">${formatDate(fb.createdAt)}</div>
                        <div class="feedback-role">${formatRole(fb.role)}</div>
                        <div class="feedback-category">${formatCategory(fb.category || "general")}</div>
                    </div>
                </div>

                <div class="feedback-rating">${stars}</div>
                <div class="feedback-message">${escapeHTML(fb.message)}</div>

                ${canDelete ? `
                    <button class="delete-feedback-btn" data-id="${fb.id}">
                        <i class="fas fa-trash-alt"></i> Delete
                    </button>
                ` : ""}
            `;
            feedbackGrid.appendChild(card);
        });
        attachDeleteEvents();
    }

    function attachDeleteEvents() {
        const deleteButtons = document.querySelectorAll(".delete-feedback-btn");
        deleteButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const feedbackId = btn.dataset.id;
                const feedback = feedbacks.find(item => item.id === feedbackId);

                if (!feedback) return;
                const allowed = currentUser.role === "admin" || currentUser.id === feedback.userId;
                if (!allowed) {
                    alert("You are not allowed to delete this feedback.");
                    return;
                }

                const confirmed = confirm("Are you sure you want to delete this feedback?");
                if (!confirmed) return;
                feedbacks = feedbacks.filter(item => item.id !== feedbackId);
                saveFeedbacks();
                const activeFilter = document.querySelector(".feedback-filters button.active")?.dataset.filter || "all";
                renderFeedback(activeFilter);
            });
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-LK", {
            year: "numeric",
            month: "short",
            day: "numeric"
        }) + " • " + date.toLocaleTimeString("en-LK", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    const params = new URLSearchParams(window.location.search);
    const initialFilter = params.get("filter") || "all";

    const initialButton = document.querySelector(`.feedback-filters button[data-filter="${initialFilter}"]`);
    if (initialButton) {
        filterButtons.forEach(b => b.classList.remove("active"));
        initialButton.classList.add("active");
    }
    renderFeedback(initialFilter);

    /* Filters */
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderFeedback(btn.dataset.filter);
        });
    });

    /* Panel Toggle */
    openPanelBtn?.addEventListener("click", () => {
        feedbackPanel?.classList.add("open");
    });

    cancelBtn?.addEventListener("click", () => {
        feedbackPanel?.classList.remove("open");
        feedbackForm?.reset();
    });

    /* General Feedback Submit */
    feedbackForm?.addEventListener("submit", e => {
        e.preventDefault();
        const rating = parseInt(ratingInput?.value || "0", 10);
        const message = messageInput?.value.trim();

        if (rating < 1 || rating > 5) {
            alert("Please select a valid rating.");
            return;
        }
        if (!message) {
            alert("Please enter your feedback message.");
            return;
        }

        const feedbackRole = currentUser.role === "admin" ? "guest" : currentUser.role;
        const newFeedback = {
            id: crypto.randomUUID(),
            userId: currentUser.id,
            name: currentUser.name,
            role: feedbackRole,
            category: "general",
            rating,
            message,
            createdAt: new Date().toISOString()
        };

        feedbacks.push(newFeedback);
        saveFeedbacks();
        feedbackForm.reset();
        feedbackPanel?.classList.remove("open");
        alert("Thank you! Your feedback has been submitted successfully.");
        const activeFilter = document.querySelector(".feedback-filters button.active")?.dataset.filter || "all";
        renderFeedback(activeFilter);
    });
});