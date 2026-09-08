// ==========================================
// AI Resume Analyzer - Frontend JavaScript
// ==========================================


// Get HTML elements
const resumeInput = document.getElementById("resume");
const fileName = document.getElementById("fileName");

const jobDescription = document.getElementById("jobDescription");
const analyzeBtn = document.getElementById("analyzeBtn");

const loading = document.getElementById("loading");
const errorBox = document.getElementById("error");
const results = document.getElementById("results");

const score = document.getElementById("score");
const recommendation = document.getElementById("recommendation");

const matchedSkills = document.getElementById("matchedSkills");
const missingSkills = document.getElementById("missingSkills");

const resumeSkills = document.getElementById("resumeSkills");
const jobSkills = document.getElementById("jobSkills");

const suggestions = document.getElementById("suggestions");


// ==========================================
// Show selected file name
// ==========================================

resumeInput.addEventListener("change", function () {

    if (resumeInput.files.length > 0) {

        const file = resumeInput.files[0];

        fileName.textContent = `Selected: ${file.name}`;

    } else {

        fileName.textContent = "No file selected";

    }

});


// ==========================================
// Analyze Resume
// ==========================================

analyzeBtn.addEventListener("click", async function () {

    // Clear previous error
    errorBox.classList.add("hidden");
    errorBox.textContent = "";

    // Hide previous results
    results.classList.add("hidden");


    // ======================================
    // Validate Resume
    // ======================================

    if (resumeInput.files.length === 0) {

        showError("Please upload your resume PDF.");

        return;
    }


    const resumeFile = resumeInput.files[0];


    // Check PDF
    if (!resumeFile.name.toLowerCase().endsWith(".pdf")) {

        showError("Please upload a PDF resume.");

        return;
    }


    // ======================================
    // Validate Job Description
    // ======================================

    const jobText = jobDescription.value.trim();

    if (jobText === "") {

        showError("Please paste the job description.");

        return;
    }


    // ======================================
    // Create FormData
    // ======================================

    const formData = new FormData();

    formData.append("resume", resumeFile);
    formData.append("job_description", jobText);


    // ======================================
    // Show Loading
    // ======================================

    loading.classList.remove("hidden");

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "⏳ Analyzing...";


    try {

        // ==================================
        // Send request to Flask backend
        // ==================================

        const response = await fetch(
            "http://127.0.0.1:5000/api/analyze",
            {
                method: "POST",
                body: formData
            }
        );


        // Convert response to JSON
        const data = await response.json();


        // ==================================
        // Handle Backend Error
        // ==================================

        if (!response.ok || data.status === "error") {

            throw new Error(
                data.error || "Something went wrong while analyzing the resume."
            );

        }


        // ==================================
        // Get Analysis Result
        // ==================================

        const result = data.result;


        // ==================================
        // Display Match Score
        // ==================================

        score.textContent = `${result.match_score}%`;

        recommendation.textContent = result.recommendation;


        // ==================================
        // Display Matched Skills
        // ==================================

        displaySkills(
            matchedSkills,
            result.matched_skills,
            "matched"
        );


        // ==================================
        // Display Missing Skills
        // ==================================

        displaySkills(
            missingSkills,
            result.missing_skills,
            "missing"
        );


        // ==================================
        // Display Resume Skills
        // ==================================

        displaySkills(
            resumeSkills,
            result.resume_skills,
            "normal"
        );


        // ==================================
        // Display Job Skills
        // ==================================

        displaySkills(
            jobSkills,
            result.job_skills,
            "normal"
        );


        // ==================================
        // Display Suggestions
        // ==================================

        suggestions.innerHTML = "";


        if (result.suggestions && result.suggestions.length > 0) {

            result.suggestions.forEach(function (suggestion) {

                const li = document.createElement("li");

                li.textContent = suggestion;

                suggestions.appendChild(li);

            });

        } else {

            const li = document.createElement("li");

            li.textContent = "No additional suggestions.";

            suggestions.appendChild(li);

        }


        // ==================================
        // Show Results
        // ==================================

        results.classList.remove("hidden");


        // Scroll to results
        results.scrollIntoView({
            behavior: "smooth"
        });

    }


    catch (error) {

        console.error("Error:", error);

        showError(error.message);

    }


    finally {

        // Hide loading
        loading.classList.add("hidden");


        // Enable button
        analyzeBtn.disabled = false;

        analyzeBtn.textContent = "🚀 Analyze Resume";

    }

});


// ==========================================
// Display Skills
// ==========================================

function displaySkills(container, skills, type) {

    // Clear existing content
    container.innerHTML = "";


    // If no skills
    if (!skills || skills.length === 0) {

        const paragraph = document.createElement("p");

        paragraph.textContent = "No skills detected.";

        container.appendChild(paragraph);

        return;
    }


    // Create skill tags
    skills.forEach(function (skill) {

        const span = document.createElement("span");

        span.textContent = skill;

        span.classList.add("skill-tag");


        // Add special class
        if (type === "matched") {

            span.classList.add("matched-tag");

        }

        else if (type === "missing") {

            span.classList.add("missing-tag");

        }


        container.appendChild(span);

    });

}


// ==========================================
// Show Error
// ==========================================

function showError(message) {

    errorBox.textContent = message;

    errorBox.classList.remove("hidden");

    errorBox.scrollIntoView({
        behavior: "smooth"
    });

}
