document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("routine.html")) return;

    /* URL Parameter */
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");

    /* DOM Elements */
    const concernForm = document.getElementById("concernForm");
    const categoryTitle = document.getElementById("categoryTitle");
    const concernsContainer = document.getElementById("concernsContainer");
    const resultDiv = document.getElementById("result");
    const feedbackSection = document.getElementById("feedbackSection");
    const feedbackRating = document.getElementById("feedbackRating");
    const feedbackMessage = document.getElementById("feedbackMessage");
    const submitFeedbackBtn = document.getElementById("submitFeedback");

    if (!category || !concernForm || !categoryTitle || !concernsContainer) return;

    concernForm.style.display = "block";
    categoryTitle.textContent = `Selected: ${category.toUpperCase()}`;

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

    /* Data */
    const concernsData = {
        skincare: ["Oily/combination skin", "Acne & clogged pores", "Hyperpigmentation", "Dehydration", "Fungal infections", "Heat rashes"],
        haircare: ["Hair fall", "Dandruff", "Frizz", "Dry/damaged hair", "Oily scalp", "Split ends"],
        bodycare: ["Body acne", "Fungal infections", "Body odor", "Dark areas", "Dry skin", "Heat rashes"]
        };

    }

    const routineTemplates = {
        skincare: {
            "Oily/combination skin": { symptoms: "Shiny forehead, nose, or chin; enlarged pores.", causes: "Overactive sebaceous glands, hormones, or diet.", routine: "Morning: Gentle cleanser + Oil-free moisturizer\nNight: Clay mask weekly + Light moisturizer" },
            "Acne & clogged pores": { symptoms: "Blackheads, whiteheads, red pimples.", causes: "Excess oil, bacteria, hormonal changes.", routine: "Morning: Salicylic acid cleanser + Non-comedogenic moisturizer\nNight: Spot treatment + Moisturizer" },
            "Hyperpigmentation": { symptoms: "Dark spots, uneven skin tone.", causes: "Sun exposure, acne scars, hormones.", routine: "Morning: Sunscreen + Vitamin C serum\nNight: Retinol or brightening serum" },
            "Dehydration": { symptoms: "Tight, flaky skin; dull appearance.", causes: "Low water intake, harsh products, environment.", routine: "Morning: Hydrating cleanser + Moisturizer\nNight: Hydrating serum + Moisturizer" },
            "Fungal infections": { symptoms: "Red itchy patches, sometimes scaling.", causes: "Yeast overgrowth due to moisture or heat.", routine: "Keep area dry, antifungal creams, gentle cleanser" },
            "Heat rashes": { symptoms: "Red bumps, itching, irritation." causes: "Blocked sweat ducts from heat and sweat.", routine: "Cool compress, breathable clothing, mild cleanser" }
        },
        haircare: {
            "Hair fall": { symptoms: "Excessive shedding, thinning hair.", causes: "Stress, nutrition, genetics.", routine: "Mild shampoo, protein treatments, balanced diet" },
            "Dandruff": { symptoms: "Flaky scalp, itchiness.", causes: "Dry scalp, fungal infection.", routine: "Anti-dandruff shampoo, scalp massage, hydration" },
            "Frizz": { symptoms: "Dry, unruly hair.", causes: "Humidity, dryness, damaged cuticles.", routine: "Moisturizing shampoo + leave-in serum" },
            "Dry/damaged hair": { symptoms: "Brittle, split ends.", causes: "Heat styling, chemicals, sun exposure.", routine: "Deep conditioning, gentle shampoo, oils" },
            "Oily scalp": { symptoms: "Greasy roots, limp hair.", causes: "Sebum overproduction.", routine: "Clarifying shampoo, avoid heavy conditioner on scalp" },
            "Split ends": { symptoms: "Frayed hair tips, breakage.", causes: "Dryness, friction, heat.", routine: "Trim regularly, hydrating conditioner, minimal heat" }
        },
        bodycare: {
            "Body acne": { symptoms: "Red bumps on back, chest, shoulders.", causes: "Clogged pores, sweat, tight clothing.", routine: "Exfoliating body wash, breathable clothing, moisturizer" },
            "Fungal infections": { symptoms: "Itchy red patches.", causes: "Moist environment, friction.", routine: "Antifungal cream, keep dry" },
            "Body odor": { symptoms: "Unpleasant smell from sweat.", causes: "Bacterial breakdown of sweat.", routine: "Daily cleansing, antiperspirant, breathable clothing" },
            "Dark areas": { symptoms: "Hyperpigmentation under arms, knees, elbows.", causes: "Friction, shaving, hormones.", routine: "Gentle exfoliation, brightening creams, sunscreen" },
            "Dry skin": { symptoms: "Flaky, itchy skin on body.", causes: "Low humidity, harsh soaps, hot showers.", routine: "Moisturizing lotions, mild soap, hydration" },
            "Heat rashes": { symptoms: "Red bumps, itching, irritation.", causes: "Blocked sweat ducts.", routine: "Cool showers, breathable clothing, avoid sweating" }
        }
    };

    /* Generate Checkboxes */
    concernsContainer.innerHTML = "";
    const categoryConcerns = concernsData[category];
    if (!categoryConcerns) return;

    categoryConcerns.forEach(concern => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" value="${concern}"> ${concern}`;
        concernsContainer.appendChild(label);
    });

    const otherLabel = document.createElement("label");
    otherLabel.innerHTML = `<input type="checkbox" id="otherCheck"> Other (custom)`;
    concernsContainer.appendChild(otherLabel);

    const otherInput = document.createElement("input");
    otherInput.type = "text";
    otherInput.id = "otherText";
    otherInput.placeholder = "Enter your concern";
    otherInput.style.display = "none";
    concernsContainer.appendChild(otherInput);

    const otherCheck = document.getElementById("otherCheck");
    otherCheck?.addEventListener("change", () => {
        otherInput.style.display = otherCheck.checked ? "block" : "none";
    });

    /* Form Submit */
    concernForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const enteredName = document.getElementById("fullName")?.value.trim();
        const age = parseInt(document.getElementById("age")?.value.trim(), 10);
        const displayName = enteredName || currentUser.name;

        if (!displayName || isNaN(age) || age < 16 || age > 75) {
            alert("Please enter a valid name and age (16–75).");
            return;
        }

        const selected = Array.from(
            concernsContainer.querySelectorAll("input[type=checkbox]:checked")
        )
            .filter(cb => cb.id !== "otherCheck")
            .map(cb => cb.value);

        const otherVal = otherInput.value.trim();
        if (otherCheck.checked && otherVal) selected.push(otherVal);

        if (selected.length === 0) {
            alert("Please select at least one concern.");
            return;
        }

        resultDiv.style.display = "block";
        resultDiv.innerHTML = "<div class='loading'>Generating your routine...</div>";

        setTimeout(() => {
            let output = `Hello ${displayName}! Here’s a personalized ${category} routine for age ${age}:\n\n`;

            selected.forEach(concern => {
                const template = routineTemplates[category]?.[concern] || {
                    symptoms: "Varies depending on individual",
                    causes: "Unknown or multiple factors",
                    routine: "General care: cleanse, moisturize, avoid irritants"
                };

                output += `🔹 Concern: ${concern}\n   • Symptoms: ${template.symptoms}\n   • Causes: ${template.causes}\n   • Routine:\n       ${template.routine.replace(/\n/g, "\n       ")}\n\n`;
            });

            output += `💡 Tips:
    - Stay hydrated
    - Follow a consistent routine
    - Adjust to your body type

⚠️ This message was created by AI. Always consult your doctor before using products.`;

            resultDiv.innerHTML = `<pre style="white-space: pre-wrap;">${escapeHTML(output)}</pre>`;

            if (feedbackSection) {
                feedbackSection.style.display = "block";
                feedbackSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 800);
    });

    /* Feedback Submit */
    submitFeedbackBtn?.addEventListener("click", () => {
        const rating = parseInt(feedbackRating?.value || "0", 10);
        const message = feedbackMessage?.value.trim() || "Routine feedback submitted.";

        if (!rating || rating < 1 || rating > 5) {
            alert("Please select a valid rating.");
            return;
        }

        const enteredName = document.getElementById("fullName")?.value.trim();
        const finalName = enteredName || currentUser.name;

        const newFeedback = {
            id: crypto.randomUUID(),
            userId: currentUser.id,
            name: finalName,
            role: currentUser.role,
            category: "routine",
            routineType: category,
            rating: rating,
            message: message,
            createdAt: new Date().toISOString()
        };

        const existingFeedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];
        existingFeedbacks.push(newFeedback);
        localStorage.setItem("feedbacks", JSON.stringify(existingFeedbacks));

        feedbackSection.innerHTML = `
            <div style="text-align:center; padding: 10px 0;">
                <h3>💜 Thank You for Your Feedback!</h3>
                <p>Your routine review has been submitted successfully.</p>
                <p>It will now appear in the <strong>Routine</strong> category on the feedback page.</p>
            </div>
        `;

        setTimeout(() => {
            window.location.href = "feedback.html?filter=routine";
        }, 1500);
    });

    function escapeHTML(str) {
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});

/* GLOBAL CANCEL */
function cancelForm() {
    if (confirm("Are you sure?")) {
        window.location.href = "index.html";
    }
}