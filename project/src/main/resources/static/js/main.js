// GLOBAL UI STATE

document.addEventListener("DOMContentLoaded", () => {

    /* LOGIN STATE (TEMP) */
    const isLoggedIn = true; // replace with backend later
    const user = {
        name: "Venom",
        profile_image_url: "https://yourdomain.com/images/user1.jpg"
    };

    /* ELEMENTS */
    const authLinks = document.getElementById("authLinks");
    const userSection = document.getElementById("userSection");
    const userName = document.getElementById("userName");
    const profileImg = document.getElementById("profileImg");
    const dropdown = document.getElementById("dropdownMenu");
    const profileTrigger = document.getElementById("profileTrigger");
    const logoutBtn = document.getElementById("logoutBtn");

    /* NAVBAR STATE */
    if (isLoggedIn) {
        authLinks?.classList.add("hidden");
        userSection?.classList.remove("hidden");
        if (userName) userName.textContent = user.name;
        if (profileImg) {
            profileImg.src = user.profile_image_url || "images/default-profile.png";
            profileImg.onerror = () => {
                profileImg.src = "images/default-profile.png";
            };
        }

    } else {
        authLinks?.classList.remove("hidden");
        userSection?.classList.add("hidden");
    }

    /* DROPDOWN */
    if (profileTrigger && dropdown) {
        profileTrigger.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("hidden");
        });
        document.addEventListener("click", () => {
            dropdown.classList.add("hidden");
        });
    }

    /* LOGOUT */
    logoutBtn?.addEventListener("click", () => {
        // Replace with backend logout later
        alert("Logged out");

        authLinks?.classList.remove("hidden");
        userSection?.classList.add("hidden");
    });

    /* HERO VIDEO LOOP */
    const heroVideo = document.getElementById("heroVideo");
    heroVideo?.addEventListener("ended", () => {
        setTimeout(() => {
            heroVideo.currentTime = 0;
            heroVideo.play();
        }, 1500);
    });

    /* HOME FEEDBACK PREVIEW */
    const feedbackGrid = document.getElementById("homeFeedbackGrid");
    if (feedbackGrid) {
        let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
        if (feedbacks.length === 0) {
            feedbacks.push({
                name: "Test User",
                rating: 5,
                message: "This is a test feedback.",
                image: "images/default-profile.png"
            });
            localStorage.setItem("feedbacks", JSON.stringify(feedbacks));
        }

        const latest = feedbacks.slice(-4).reverse();
        feedbackGrid.innerHTML = latest.map(fb => `
            <div class="feedback-card">
                <div class="user">
                    <img src="${fb.image}" alt="${fb.name}">
                    <span>${fb.name}</span>
                </div>
                <div class="rating">⭐ ${fb.rating}/5</div>
                <p class="message">${fb.message}</p>
            </div>
        `).join("");
    }

    /* SUBSCRIBE FORM */
    const subscribeForm = document.getElementById("subscribeForm");
    subscribeForm?.addEventListener("submit", function(e) {
        e.preventDefault();
        const email = document.getElementById("subscribeEmail")?.value.trim();
        const message = document.getElementById("subscribeMessage");
        if (!email) {
            message.textContent = "Please enter your email.";
            message.style.color = "red";
            return;
        }
        message.textContent = "Thanks! You’re subscribed 🎉";
        message.style.color = "green";
        this.reset();
    });

    /* STICKY HEADER */
    const header = document.querySelector(".header");

    if (header) {
        const sticky = header.offsetTop;

        window.addEventListener("scroll", () => {
            window.pageYOffset > sticky
                ? header.classList.add("sticky")
                : header.classList.remove("sticky");
        });
    }

    /* SCROLL ANIMATIONS */
    const elements = document.querySelectorAll(".scroll-reveal");
    const inView = (el) =>
        el.getBoundingClientRect().top <= window.innerHeight * 0.8;

    const handleScroll = () => {
        elements.forEach(el => {
            inView(el)
                ? el.classList.add("scrolled")
                : el.classList.remove("scrolled");
        });
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
});


    /* GLOBAL CANCEL FUNCTION */
    function cancelForm() {
    if (confirm("Are you sure you want to cancel?")) {
        window.location.href = "index.html";
    }
}