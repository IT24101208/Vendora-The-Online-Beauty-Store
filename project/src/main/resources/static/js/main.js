// GLOBAL UI STATE

document.addEventListener("DOMContentLoaded", () => {

    /* Login State */
    const storedLoggedInUser = localStorage.getItem("loggedInUser");
    const storedVendoraUser = localStorage.getItem("vendoraUser");
    const storedToken = localStorage.getItem("vendoraToken");
    const isLoggedIn = !!(storedLoggedInUser || storedVendoraUser || storedToken);
    let user = {
        id: "guest-user",
        name: "Guest",
        role: "guest",
        profile_image_url: "../images/default-profile.png"
    };

    try {
        const parsedUser = JSON.parse(storedLoggedInUser || storedVendoraUser || "{}");

        if (parsedUser && typeof parsedUser === "object") {
            user.id = parsedUser.id || generateUserId(parsedUser.name || parsedUser.email || "guest", parsedUser.role || "guest");
            user.name = parsedUser.name || (parsedUser.email ? parsedUser.email.split("@")[0] : "User");
            user.role = normalizeRole(parsedUser.role || "guest");
            user.profile_image_url =
                parsedUser.profile_image_url ||
                parsedUser.profileImage ||
                parsedUser.image ||
                "../images/default-profile.png";
        }
    } catch (e) {
        console.warn("User data parse error:", e);
    }

    /* Eelements */
    const authLinks = document.getElementById("authLinks");
    const userSection = document.getElementById("userSection");
    const userName = document.getElementById("userName");
    const profileImg = document.getElementById("profileImg");
    const dropdown = document.getElementById("dropdownMenu");
    const profileTrigger = document.getElementById("profileTrigger");
    const logoutBtn = document.getElementById("logoutBtn");

    /* Navbar Style */
    if (isLoggedIn) {
        authLinks?.classList.add("hidden");
        userSection?.classList.remove("hidden");
        if (userName) {
            userName.textContent = user.name;
        }

        if (profileImg) {
            profileImg.src = user.profile_image_url;
            profileImg.alt = `${user.name} Profile`;
            profileImg.onerror = () => {
                profileImg.src = "../images/default-profile.png";
            };
        }
    } else {
        authLinks?.classList.remove("hidden");
        userSection?.classList.add("hidden");
    }

    /* Dropdown */
    if (profileTrigger && dropdown) {
        profileTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("hidden");
        });
        document.addEventListener("click", () => {
            dropdown.classList.add("hidden");
        });
    }

    /* Logout */
    logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem("vendoraToken");
        localStorage.removeItem("vendoraUser");
        localStorage.removeItem("loggedInUser");
        alert("Logged out successfully.");
        window.location.href = "index.html";
    });

    /* HERO Video Loop */
    const heroVideo = document.getElementById("heroVideo");
    heroVideo?.addEventListener("ended", () => {
        setTimeout(() => {
            heroVideo.currentTime = 0;
            heroVideo.play();
        }, 1500);
    });

    /* Home Feedback Preview */
    const feedbackGrid = document.getElementById("homeFeedbackGrid");

    if (feedbackGrid) {
        const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

        // Show only latest 4 feedbacks
        const latest = [...feedbacks]
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 4);

        if (latest.length === 0) {
            feedbackGrid.innerHTML = `
                <div class="empty-feedback-preview">
                    <p>No feedback submitted yet.</p>
                </div>
            `;
        } else {
            feedbackGrid.innerHTML = latest.map(fb => {
                const rating = Number(fb.rating) || 0;
                const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
                const role = formatRole(fb.role || "guest");
                const category = fb.category === "routine" ? "Routine" : "General";
                const date = formatDate(fb.createdAt);

                return `
                    <div class="feedback-card" data-role="${escapeHTML(fb.role || 'guest')}">
                        <div class="feedback-top">
                            <h4>${escapeHTML(fb.name || "Guest")}</h4>
                            <div class="feedback-date">${date}</div>
                            <div class="feedback-role">${escapeHTML(role)}</div>
                            <div class="feedback-category">${escapeHTML(category)}</div>
                        </div>
                        <div class="feedback-rating">${stars}</div>
                        <p class="feedback-message">${escapeHTML(fb.message || "")}</p>
                    </div>
                `;
            }).join("");
        }
    }

    /* Subscribe Form */
    const subscribeForm = document.getElementById("subscribeForm");
    subscribeForm?.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("subscribeEmail")?.value.trim();
        const message = document.getElementById("subscribeMessage");
        if (!message) return;
        if (!email) {
            message.textContent = "Please enter your email.";
            message.style.color = "red";
            return;
        }
        message.textContent = "Thanks! You’re subscribed 🎉";
        message.style.color = "green";
        this.reset();
    });

    /* Sticky Header */
    const header = document.querySelector(".header");
    if (header) {
        const sticky = header.offsetTop;

        window.addEventListener("scroll", () => {
            if (window.pageYOffset > sticky) {
                header.classList.add("sticky");
            } else {
                header.classList.remove("sticky");
            }
        });
    }

    /* Helper Functions */
    function generateUserId(name, role) {
        return `${String(role).toLowerCase()}-${String(name).toLowerCase().replace(/\s+/g, "-")}`;
    }
    function normalizeRole(role) {
        const value = String(role || "").toLowerCase().trim();
        if (["customer", "supplier", "delivery", "guest", "admin"].includes(value)) {
            return value;
        }
        if (value === "delivery person") return "delivery";
        return "guest";
    }

    function formatRole(role) {
        switch (String(role).toLowerCase()) {
            case "customer":
                return "Customer";
            case "supplier":
                return "Supplier";
            case "delivery":
                return "Delivery Person";
            case "admin":
                return "Admin";
            case "guest":
            default:
                return "Guest";
        }
    }

    function formatDate(dateString) {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Recently";
        return date.toLocaleDateString("en-LK", {
            year: "numeric",
            month: "short",
            day: "numeric"
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
});

/* Global Cancel Function */
function cancelForm() {
    if (confirm("Are you sure you want to cancel?")) {
        window.location.href = "index.html";
    }
}