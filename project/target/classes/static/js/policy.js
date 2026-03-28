// User preference data: cookie consent status, privacy toggles, terms accordion states.

document.addEventListener("DOMContentLoaded", () => {

    /* COOKIE CONSENT */
    const cookieBanner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("acceptCookies");

    if (!localStorage.getItem("cookiesAccepted") && cookieBanner) {
        cookieBanner.style.display = "flex";
    }

    acceptBtn?.addEventListener("click", () => {
        localStorage.setItem("cookiesAccepted", "true");
        cookieBanner.style.display = "none";
    });

    /* PRIVACY TOGGLE */
    const privacyToggles = document.querySelectorAll(".privacy-toggle");

    privacyToggles.forEach(toggle => {
        toggle.addEventListener("change", (e) => {
            const prefName = e.target.dataset.pref;
            if (!prefName) return;

            localStorage.setItem(prefName, e.target.checked);
            console.log(`Preference ${prefName}: ${e.target.checked}`);
        });

        // Initialize from localStorage
        const prefName = toggle.dataset.pref;
        if (prefName && localStorage.getItem(prefName)) {
            toggle.checked = localStorage.getItem(prefName) === "true";
        }
    });

    /* TERMS ACCORDION */
    const accordions = document.querySelectorAll(".accordion-header");
    accordions.forEach(header => {
        header.addEventListener("click", () => {
            const content = header.nextElementSibling;
            const isOpen = content.style.maxHeight;

            // Close all other accordions
            accordions.forEach(h => {
                const c = h.nextElementSibling;
                if (c !== content) c.style.maxHeight = null;
            });

            // Toggle current
            if (isOpen) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    /* RESET PREFERENCES BUTTON */
    const resetBtn = document.getElementById("resetPreferences");
    resetBtn?.addEventListener("click", () => {
        privacyToggles.forEach(toggle => {
            toggle.checked = false;
            const prefName = toggle.dataset.pref;
            if (prefName) localStorage.removeItem(prefName);
        });
        alert("Preferences reset successfully.");
    });
});