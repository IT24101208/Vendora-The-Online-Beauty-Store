document.addEventListener("DOMContentLoaded", () => {

    if (!window.location.pathname.includes("routine.html")) return;

    /* ---------------- URL PARAMETER: CATEGORY ---------------- */
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");

    const concernForm = document.getElementById("concernForm");
    const categoryTitle = document.getElementById("categoryTitle");
    const concernsContainer = document.getElementById("concernsContainer");
    const resultDiv = document.getElementById("result");
    const feedbackSection = document.getElementById("feedbackSection");

    if (!category || !concernForm || !categoryTitle || !concernsContainer) return;

    concernForm.style.display = "block";
    categoryTitle.textContent = `Selected: ${category.toUpperCase()}`;

    /* ---------------- CONCERNS DATA ---------------- */
    const concernsData = {
        skincare: ["Oily/combination skin", "Acne & clogged pores", "Hyperpigmentation", "Dehydration", "Fungal infections", "Heat rashes"],
        haircare: ["Hair fall", "Dandruff", "Frizz", "Dry/damaged hair", "Oily scalp", "Split ends"],
        bodycare: ["Body acne", "Fungal infections", "Body odor", "Dark areas", "Dry skin", "Heat rashes"]
    };

    const routineTemplates = {
        skincare: {
            "Oily/combination skin": { symptoms: "Shiny forehead, nose, or chin; enlarged pores.", causes: "Overactive sebaceous glands, hormones, or diet.", routine: "Morning: Gentle cleanser + Oil-free moisturizer\nNight: Clay mask weekly + Light moisturizer" },
            "Acne & clogged pores": { symptoms: "Blackheads, whiteheads, red pimples.", causes: "Excess oil, bacteria, hormonal changes.", routine: "Morning: Salicylic acid cleanser + Non-comedogenic moisturizer\nNight: Spot treatment + Moisturizer" },
            "Hyperpigmentation": { symptoms: "Dark spots, uneven skin tone.", causes: "Sun exposure, acne scars, hormones.", routine: "Morning: Sunscreen + Vitamin C serum\nNight: Retinol or brightening serum" },
            "Dehydration": { symptoms: "Tight, flaky skin; dull appearance.", causes: "Low water intake, harsh products, environment.", routine: "Morning: Hydrating cleanser + Moisturizer\nNight: Hydrating serum + Moisturizer" },
            "Fungal infections": { symptoms: "Red itchy patches, sometimes scaling.", causes: "Yeast overgrowth due to moisture or heat.", routine: "Keep area dry, antifungal creams, gentle cleanser" },
            "Heat rashes": { symptoms: "Red bumps, itching, irritation.", causes: "Blocked sweat ducts from heat and sweat.", routine: "Cool compress, breathable clothing, mild cleanser" }
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

    /* ---------------- GENERATE CONCERN CHECKBOXES ---------------- */
    concernsContainer.innerHTML = "";
    if (concernsData[category]) {
        concernsData[category].forEach(c => {
            const label = document.createElement("label");
            label.innerHTML = `<input type="checkbox" value="${c}"> ${c}`;
            concernsContainer.appendChild(label);
        });

        // Add "Other" option
        const otherLabel = document.createElement("label");
        otherLabel.innerHTML = `<input type="checkbox" id="otherCheck"> Other (custom)`;
        concernsContainer.appendChild(otherLabel);

        const otherInput = document.createElement("input");
        otherInput.type = "text";
        otherInput.id = "otherText";
        otherInput.placeholder = "Enter your concern";
        otherInput.style.display = "none";
        concernsContainer.appendChild(otherInput);

        document.getElementById("otherCheck").addEventListener("change", function () {
            otherInput.style.display = this.checked ? "block" : "none";
        });
    }

    /* ---------------- FORM SUBMISSION ---------------- */
    concernForm.addEventListener("submit", e => {
        e.preventDefault();

        const name = document.querySelector("#fullName").value.trim();
        const age = parseInt(document.querySelector("#age").value.trim());

        if (!name || isNaN(age) || age < 16 || age > 75) {
            alert("Please enter a valid name and age (16-75).");
            return;
        }

        // Collect selected concerns
        const selected = Array.from(concernsContainer.querySelectorAll("input[type=checkbox]:checked"))
            .map(cb => cb.value);
        const otherVal = document.getElementById("otherText")?.value.trim();
        if (otherVal) selected.push(otherVal);

        if (selected.length === 0) {
            alert("Please select at least one concern.");
            return;
        }

        // Show loading
        resultDiv.style.display = "block";
        resultDiv.innerHTML = "<div class='loading'>Generating your routine...</div>";

        setTimeout(() => {
            // Generate routine output
            let output = `Hello ${name}! Here’s a personalized ${category} routine for age ${age}:\n\n`;
            selected.forEach(c => {
                const template = (routineTemplates[category] && routineTemplates[category][c]) || {
                    symptoms: "Varies depending on individual",
                    causes: "Unknown or multiple factors",
                    routine: "General care: cleanse, moisturize, avoid irritants"
                };
                output += `🔹 Concern: ${c}\n   • Symptoms: ${template.symptoms}\n   • Causes: ${template.causes}\n   • Routine:\n       ${template.routine.replace(/\n/g,"\n       ")}\n\n`;
            });

            output += `💡 Tips:\n- Stay hydrated\n- Follow a consistent routine\n- Adjust to your body type\n\n⚠️ this message was created by AI. Always consult your doctor before choosing or using products.`;

            resultDiv.innerHTML = `<pre style="white-space: pre-wrap;">${output}</pre>`;

            // Show feedback section
            if (feedbackSection) feedbackSection.style.display = "block";

            // Feedback submission (temporary)
            document.getElementById("submitFeedback")?.addEventListener("click", () => {
                const rating = document.getElementById("feedbackRating")?.value;
                const message = document.getElementById("feedbackMessage")?.value.trim();
                if (!rating) return alert("Please select a rating.");

                feedbackSection.innerHTML = `
                    <p>Thank you for your feedback!</p>
                    <p>Rating: ${rating}/5</p>
                    ${message ? `<p>Message: ${message}</p>` : ''}
                `;

                setTimeout(() => window.location.href = "index.html", 2000);
            });

            document.getElementById("exitButton")?.addEventListener("click", () => {
                window.location.href = "index.html";
            });

        }, 1000);
    });

});

/* ---------------- GLOBAL CANCEL FUNCTION ---------------- */
function cancelForm() {
    if (confirm("Cancel registration? All entered data will be lost.")) {
        window.location.href = "index.html";
    }
}