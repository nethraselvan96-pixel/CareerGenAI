document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const startBtn = document.getElementById("startBtn");
    const careerForm = document.getElementById("careerForm");

    const careerSection =
        document.getElementById("career-analysis");

    const careerResult =
        document.getElementById("careerResult");

    const loading =
        document.getElementById("loading");

    // =====================================================
    // START CAREER ANALYSIS BUTTON
    // =====================================================

    if (startBtn) {

        startBtn.addEventListener("click", function () {

            if (careerSection) {

                careerSection.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    }

    // =====================================================
    // FORM SUBMIT
    // =====================================================

    if (careerForm) {

        careerForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            // -------------------------------------------------
            // GET FORM VALUES
            // -------------------------------------------------

            const education =
                document.getElementById("education")?.value || "";

            const skills =
                document.getElementById("skills")?.value || "";

            const interests =
                document.getElementById("interests")?.value || "";

            const careerGoal =
                document.getElementById("careerGoal")?.value || "";

            const experience =
                document.getElementById("experience")?.value || "";

            // -------------------------------------------------
            // SHOW LOADING
            // -------------------------------------------------

            if (loading) {
                loading.style.display = "block";
            }

            if (careerResult) {
                careerResult.style.display = "none";
            }

            // -------------------------------------------------
            // SEND DATA TO FLASK
            // -------------------------------------------------

            try {

                const response = await fetch("/analyze", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        education: education,
                        skills: skills,
                        interests: interests,
                        careerGoal: careerGoal,
                        experience: experience

                    })

                });

                if (!response.ok) {

                    throw new Error(
                        "Server error: " + response.status
                    );

                }

                const data = await response.json();

                if (!data.success) {

                    throw new Error(
                        data.error ||
                        "Career analysis failed."
                    );

                }

                // -------------------------------------------------
                // BASIC PROFILE INFORMATION
                // -------------------------------------------------

                setText(
                    "resultCareer",
                    careerGoal
                );

                setText(
                    "resultExperience",
                    experience
                );

                setText(
                    "resultSkills",
                    skills
                );

                setText(
                    "resultInterests",
                    interests
                );

                // -------------------------------------------------
                // AI RESULT
                // -------------------------------------------------

                const aiText =
                    data.ai_result || "";

                // -------------------------------------------------
                // BUILD RESULT SECTIONS
                // -------------------------------------------------

                calculateCareerScore(aiText);

                displayCurrentSkills(aiText);

                displayMissingSkills(aiText);

                displayRoadmap(aiText);

                displayProjects(aiText);

                displayResume(aiText);

                displayAIResult(aiText);

                // -------------------------------------------------
                // SHOW RESULTS
                // -------------------------------------------------

                if (loading) {
                    loading.style.display = "none";
                }

                if (careerResult) {

                    careerResult.style.display = "block";

                    setTimeout(function () {

                        careerResult.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }, 150);

                }

            }

            catch (error) {

                console.error(
                    "CareerGenAI Error:",
                    error
                );

                if (loading) {
                    loading.style.display = "none";
                }

                alert(
                    "Something went wrong while analyzing your career.\n\n" +
                    error.message
                );

            }

        });

    }

    // =====================================================
    // SET TEXT SAFELY
    // =====================================================

    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.textContent =
            value || "--";

    }

    // =====================================================
    // CAREER MATCH SCORE
    // =====================================================

    function calculateCareerScore(text) {

        let score = 0;

        const match =
            text.match(
                /Career\s*Match\s*Score\s*[:\-]?\s*(\d{1,3})\s*%/i
            );

        if (match) {

            score =
                Math.min(
                    parseInt(match[1]),
                    100
                );

        }

        const careerScore =
            document.getElementById("careerScore");

        const scoreProgress =
            document.getElementById("scoreProgress");

        const readinessCareer =
            document.getElementById(
                "readinessCareer"
            );

        const careerProgress =
            document.getElementById(
                "careerProgress"
            );

        // -------------------------------------------------
        // SCORE TEXT
        // -------------------------------------------------

        if (careerScore) {

            careerScore.textContent =
                score + "%";

        }

        // -------------------------------------------------
        // MAIN SCORE PROGRESS
        // -------------------------------------------------

        if (scoreProgress) {

            scoreProgress.style.width =
                score + "%";

        }

        // -------------------------------------------------
        // READINESS DASHBOARD
        // -------------------------------------------------

        if (readinessCareer) {

            readinessCareer.textContent =
                score + "%";

        }

        if (careerProgress) {

            careerProgress.style.width =
                score + "%";

        }

    }

    // =====================================================
    // CURRENT SKILLS
    // =====================================================

    function displayCurrentSkills(text) {

        const container =
            document.getElementById(
                "currentSkills"
            );

        const readinessSkills =
            document.getElementById(
                "readinessSkills"
            );

        const skillsProgress =
            document.getElementById(
                "skillsProgress"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        // -------------------------------------------------
        // FIND CURRENT SKILLS SECTION
        // -------------------------------------------------

        const match =
            text.match(
                /CURRENT\s+SKILLS\s*:?\s*([\s\S]*?)(?=\n\s*(?:SKILLS\s+TO\s+LEARN|MISSING\s+SKILLS|ROADMAP|PROJECTS|RESUME|AI\s+ANALYSIS|$))/i
            );

        if (!match) {

            container.innerHTML =
                "<p>No current skills detected.</p>";

            if (readinessSkills) {
                readinessSkills.textContent = "0%";
            }

            if (skillsProgress) {
                skillsProgress.style.width = "0%";
            }

            return;

        }

        const section =
            match[1].trim();

        const lines =
            section
                .split("\n")
                .map(function (line) {
                    return line
                        .replace(/^[-•*]\s*/, "")
                        .trim();
                })
                .filter(function (line) {
                    return line.length > 0;
                });

        // -------------------------------------------------
        // DISPLAY SKILLS
        // -------------------------------------------------

        lines.forEach(function (skill) {

            const item =
                document.createElement("div");

            item.className =
                "skill-item";

            item.textContent =
                "✓ " + skill;

            container.appendChild(item);

        });

        // -------------------------------------------------
        // CALCULATE TECHNICAL SKILL READINESS
        // -------------------------------------------------

        const score =
            Math.min(
                lines.length * 15,
                100
            );

        if (readinessSkills) {

            readinessSkills.textContent =
                score + "%";

        }

        if (skillsProgress) {

            skillsProgress.style.width =
                score + "%";

        }

    }

    // =====================================================
    // MISSING SKILLS
    // =====================================================

    function displayMissingSkills(text) {

        const container =
            document.getElementById(
                "missingSkills"
            );

        const readinessAI =
            document.getElementById(
                "readinessAI"
            );

        const aiProgress =
            document.getElementById(
                "aiProgress"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        // -------------------------------------------------
        // FIND SKILLS TO LEARN SECTION
        // -------------------------------------------------

        const match =
            text.match(
                /SKILLS\s+TO\s+LEARN\s*:?\s*([\s\S]*?)(?=\n\s*(?:ROADMAP|PROJECTS|RESUME|AI\s+ANALYSIS|$))/i
            );

        if (!match) {

            container.innerHTML =
                "<p>No missing skills detected.</p>";

            if (readinessAI) {
                readinessAI.textContent = "100%";
            }

            if (aiProgress) {
                aiProgress.style.width = "100%";
            }

            calculateOverallReadiness();

            return;

        }

        const section =
            match[1].trim();

        const lines =
            section
                .split("\n")
                .map(function (line) {
                    return line
                        .replace(/^[-•*]\s*/, "")
                        .trim();
                })
                .filter(function (line) {
                    return line.length > 0;
                });

        // -------------------------------------------------
        // DISPLAY MISSING SKILLS
        // -------------------------------------------------

        lines.forEach(function (skill) {

            const item =
                document.createElement("div");

            item.className =
                "skill-item missing";

            item.textContent =
                "→ " + skill;

            container.appendChild(item);

        });

        // -------------------------------------------------
        // AI READINESS
        // -------------------------------------------------

        const score =
            Math.max(
                100 - lines.length * 10,
                0
            );

        if (readinessAI) {

            readinessAI.textContent =
                score + "%";

        }

        if (aiProgress) {

            aiProgress.style.width =
                score + "%";

        }

        calculateOverallReadiness();

    }

    // =====================================================
    // OVERALL READINESS
    // =====================================================

    function calculateOverallReadiness() {

        const career =
            document.getElementById(
                "readinessCareer"
            );

        const skills =
            document.getElementById(
                "readinessSkills"
            );

        const ai =
            document.getElementById(
                "readinessAI"
            );

        const overall =
            document.getElementById(
                "readinessOverall"
            );

        const overallProgress =
            document.getElementById(
                "overallProgress"
            );

        if (!overall) {
            return;
        }

        const careerScore =
            parseInt(
                career?.textContent || "0"
            ) || 0;

        const skillsScore =
            parseInt(
                skills?.textContent || "0"
            ) || 0;

        const aiScore =
            parseInt(
                ai?.textContent || "0"
            ) || 0;

        const result =
            Math.round(
                (
                    careerScore +
                    skillsScore +
                    aiScore
                ) / 3
            );

        // -------------------------------------------------
        // OVERALL NUMBER
        // -------------------------------------------------

        overall.textContent =
            result + "%";

        // -------------------------------------------------
        // OVERALL PROGRESS BAR
        // -------------------------------------------------

        if (overallProgress) {

            overallProgress.style.width =
                result + "%";

        }

    }

    // =====================================================
    // ROADMAP
    // =====================================================

    function displayRoadmap(text) {

        const container =
            document.getElementById(
                "roadmapContainer"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const match =
            text.match(
                /ROADMAP\s*:?\s*([\s\S]*?)(?=\n\s*(?:PROJECTS|RESUME|AI\s+ANALYSIS|$))/i
            );

        if (!match) {

            container.innerHTML =
                "<p>Roadmap information unavailable.</p>";

            return;

        }

        const section =
            match[1].trim();

        const lines =
            section
                .split("\n")
                .map(function (line) {
                    return line.trim();
                })
                .filter(function (line) {
                    return line.length > 0;
                });

        lines.forEach(function (line, index) {

            const card =
                document.createElement("div");

            card.className =
                "roadmap-card";

            card.innerHTML = `
                <div class="roadmap-number">
                    ${index + 1}
                </div>

                <div class="roadmap-content">
                    ${formatRoadmapLine(line)}
                </div>
            `;

            container.appendChild(card);

        });

    }

    // =====================================================
    // ROADMAP FORMATTER
    // =====================================================

    function formatRoadmapLine(line) {

        return escapeHTML(
            line
                .replace(
                    /^[-•*]\s*/,
                    ""
                )
        );

    }

    // =====================================================
    // PROJECTS
    // =====================================================

    function displayProjects(text) {

        const container =
            document.getElementById(
                "projectsContainer"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const match =
            text.match(
                /PROJECTS?\s*:?\s*([\s\S]*?)(?=\n\s*(?:RESUME|AI\s+ANALYSIS|$))/i
            );

        if (!match) {

            container.innerHTML =
                "<p>Project suggestions unavailable.</p>";

            return;

        }

        const section =
            match[1].trim();

        const lines =
            section
                .split("\n")
                .map(function (line) {
                    return line
                        .replace(/^[-•*]\s*/, "")
                        .trim();
                })
                .filter(function (line) {
                    return line.length > 0;
                });

        lines.forEach(function (project) {

            const card =
                document.createElement("div");

            card.className =
                "project-card";

            card.innerHTML = `
                <h3>${escapeHTML(project)}</h3>
            `;

            container.appendChild(card);

        });

    }

    // =====================================================
    // RESUME
    // =====================================================

    function displayResume(text) {

        const container =
            document.getElementById(
                "resumeContainer"
            );

        if (!container) {
            return;
        }

        container.innerHTML = "";

        const match =
            text.match(
                /RESUME\s*:?\s*([\s\S]*?)(?=\n\s*(?:AI\s+ANALYSIS|$))/i
            );

        if (!match) {

            container.innerHTML =
                "<p>Resume recommendations unavailable.</p>";

            return;

        }

        const section =
            match[1].trim();

        const lines =
            section
                .split("\n")
                .map(function (line) {
                    return line.trim();
                })
                .filter(function (line) {
                    return line.length > 0;
                });

        lines.forEach(function (line) {

            const item =
                document.createElement("div");

            item.className =
                "resume-item";

            item.innerHTML =
                formatBulletText(line);

            container.appendChild(item);

        });

    }

    // =====================================================
    // AI RESULT
    // =====================================================

    function displayAIResult(text) {

        const container =
            document.getElementById(
                "aiResult"
            );

        if (!container) {
            return;
        }

        container.innerHTML =
            escapeHTML(text)
                .replace(/\n/g, "<br>");

    }

    // =====================================================
    // REMOVE DUPLICATE SECTIONS
    // =====================================================

    function removeDuplicateSections(text) {

        return text
            .replace(
                /CURRENT\s+SKILLS[\s\S]*?(?=SKILLS\s+TO\s+LEARN)/gi,
                ""
            )
            .trim();

    }

    // =====================================================
    // BULLET FORMATTER
    // =====================================================

    function formatBulletText(text) {

        return escapeHTML(
            text
                .replace(
                    /^[-•*]\s*/,
                    ""
                )
        );

    }

    // =====================================================
    // HTML ESCAPE
    // =====================================================

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }

});