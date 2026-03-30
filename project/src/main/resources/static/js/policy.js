// User preference data: cookie consent status, privacy toggles, terms accordion states
document.addEventListener("DOMContentLoaded", () => {

    /* Cookie Constant */
    const cookieBanner = document.getElementById("cookieBanner");
    const acceptBtn = document.getElementById("acceptCookies");
    if (cookieBanner && localStorage.getItem("cookiesAccepted") !== "true") {
        cookieBanner.style.display = "flex";
    }
    acceptBtn?.addEventListener("click", () => {
        localStorage.setItem("cookiesAccepted", "true");
        if (cookieBanner) cookieBanner.style.display = "none";
    });

    /* Privacy Toggles */
    const privacyToggles = document.querySelectorAll(".privacy-toggle");
    privacyToggles.forEach(toggle => {
        const prefName = toggle.dataset.pref;
        if (!prefName) return;
        toggle.checked = localStorage.getItem(prefName) === "true";     // Initialize toggle state from localStorage
        toggle.addEventListener("change", (e) => {      // Listen for changes
            localStorage.setItem(prefName, e.target.checked);
            console.log(`Preference "${prefName}" set to ${e.target.checked}`);
        });
    });

    /* Terms Accordion */
    const accordions = document.querySelectorAll(".accordion-header");
    accordions.forEach(header => {
        const content = header.nextElementSibling;
        if (!content) return;
        const accId = header.dataset.accordionId || header.textContent.trim();  // Restore previous state
        if (localStorage.getItem(`accordion-${accId}`) === "open") {
            content.style.maxHeight = content.scrollHeight + "px";
        }

        header.addEventListener("click", () => {
            const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px";
            accordions.forEach(h => {       // Close all other accordions
                const c = h.nextElementSibling;
                if (c && c !== content) {
                    c.style.maxHeight = null;
                    const id = h.dataset.accordionId || h.textContent.trim();
                    localStorage.setItem(`accordion-${id}`, "closed");
                }
            });
            if (isOpen) {       // Toggle current
                content.style.maxHeight = null;
                localStorage.setItem(`accordion-${accId}`, "closed");
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                localStorage.setItem(`accordion-${accId}`, "open");
            }
        });
    });

    /* Reset Preferences */
    const resetBtn = document.getElementById("resetPreferences");
    resetBtn?.addEventListener("click", () => {
        privacyToggles.forEach(toggle => {
            toggle.checked = false;
            const prefName = toggle.dataset.pref;
            if (prefName) localStorage.removeItem(prefName);
        });

        // Reset accordions
        accordions.forEach(header => {
            const content = header.nextElementSibling;
            if (content) content.style.maxHeight = null;
            const accId = header.dataset.accordionId || header.textContent.trim();
            localStorage.removeItem(`accordion-${accId}`);
        });
        alert("Preferences and accordions reset successfully.");
    });
});