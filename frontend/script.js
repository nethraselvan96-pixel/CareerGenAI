document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // ELEMENTS
    // =====================================================

    const startBtn = document.getElementById("startBtn");
    const careerForm = document.getElementById("careerForm");
    const careerSection = document.getElementById("career-analysis");
    const careerResult = document.getElementById("careerResult");
    const loading = document.getElementById("aiLoading");


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

                const aiText = data.ai_result || "";


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

            } catch (error) {

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


        const match = text.match(
            /Career\s+Match\s+Score\s*[:\-]?\s*(\d{1,3})\s*%/i
        );


        if (match) {
            score = Math.min(
                parseInt(match[1]),
                100
            );
        }


        const careerScore =
            document.getElementById("careerScore");

        const scoreProgress =
            document.getElementById("scoreProgress");

        const readinessCareer =
            document.getElementById("readinessCareer");

        const careerProgress =
            document.getElementById("careerProgress");


        if (careerScore) {
            careerScore.textContent =
                score + "%";
        }


        if (scoreProgress) {
            scoreProgress.style.width =
                score + "%";
        }


        if (readinessCareer) {
            readinessCareer.textContent =
                score + "%";
        }


        if (careerProgress) {
            careerProgress.style.width =
                score + "%";
        }


        calculateOverallReadiness();
    }


    // =====================================================
    // CURRENT SKILLS
    // =====================================================

    function displayCurrentSkills(text) {

        const container =
            document.getElementById("currentSkills");

        const readinessSkills =
            document.getElementById("readinessSkills");

        const skillsProgress =
            document.getElementById("skillsProgress");


        if (!container) {
            return;
        }


        container.innerHTML = "";


        const match = text.match(
            /CURRENT\s+SKILLS\s*:?\s*([\s\S]*?)(?=\n\s*(?:SKILLS\s+TO\s+LEARN|MISSING\s+SKILLS|LEARNING\s+ROADMAP|ROADMAP|SUGGESTED\s+PROJECTS|PROJECTS|RESUME\s+IMPROVEMENTS|RESUME|$))/i
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

            calculateOverallReadiness();

            return;
        }


        const section =
            match[1].trim();


        const lines = section
            .split("\n")
            .map(function (line) {

                return line
                    .replace(/^[-•*]\s*/, "")
                    .trim();

            })
            .filter(function (line) {

                return line.length > 0;

            });


        lines.forEach(function (skill) {

            const item =
                document.createElement("div");

            item.className =
                "skill-item";

            item.textContent =
                "✓ " + skill;

            container.appendChild(item);

        });


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


        calculateOverallReadiness();
    }


    // =====================================================
    // MISSING SKILLS
    // =====================================================

    function displayMissingSkills(text) {

        const container =
            document.getElementById("missingSkills");

        const readinessAI =
            document.getElementById("readinessAI");

        const aiProgress =
            document.getElementById("aiProgress");


        if (!container) {
            return;
        }


        container.innerHTML = "";


        const match = text.match(
            /SKILLS\s+TO\s+LEARN\s*:?\s*([\s\S]*?)(?=\n\s*(?:LEARNING\s+ROADMAP|ROADMAP|SUGGESTED\s+PROJECTS|PROJECTS|RESUME\s+IMPROVEMENTS|RESUME|AI\s+ANALYSIS|$))/i
        );


        if (!match) {

            container.innerHTML =
                "<p>No missing skills detected.</p>";

            if (readinessAI) {
                readinessAI.textContent =
                    "100%";
            }

            if (aiProgress) {
                aiProgress.style.width =
                    "100%";
            }

            calculateOverallReadiness();

            return;
        }


        const section =
            match[1].trim();


        const lines = section
            .split("\n")
            .map(function (line) {

                return line
                    .replace(/^[-•*]\s*/, "")
                    .trim();

            })
            .filter(function (line) {

                return line.length > 0;

            });


        lines.forEach(function (skill) {

            const item =
                document.createElement("div");

            item.className =
                "skill-item missing";

            item.textContent =
                "→ " + skill;

            container.appendChild(item);

        });


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


        overall.textContent =
            result + "%";


        if (overallProgress) {

            overallProgress.style.width =
                result + "%";

        }

    }


    // =====================================================
    // LEARNING ROADMAP
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


        const match = text.match(
            /LEARNING\s+ROADMAP\s*:?\s*([\s\S]*?)(?=SUGGESTED\s+PROJECTS|RESUME\s+IMPROVEMENTS|$)/i
        );


        if (!match) {

            container.innerHTML =
                "<p>Roadmap information unavailable.</p>";

            return;
        }


        let section =
            match[1].trim();


        if (!/^Step\s+1/i.test(section)) {
            section =
                "Step 1\n" + section;
        }


        const steps =
            section
                .split(
                    /(?=Step\s+\d+\s*:?\s*)/i
                )
                .map(function (step) {
                    return step.trim();
                })
                .filter(function (step) {
                    return /^Step\s+\d+/i.test(step);
                });


        steps.forEach(function (step, index) {

            const lines =
                step
                    .split("\n")
                    .map(function (line) {
                        return line.trim();
                    })
                    .filter(function (line) {
                        return line.length > 0;
                    });


            const stepNumber =
                index + 1;


            const details = {
                skill: "",
                practice: "",
                outcome: ""
            };


            lines.forEach(function (line) {

                const cleanLine =
                    line
                        .replace(/^[-•*]\s*/, "")
                        .replace(/\*\*/g, "")
                        .trim();


                if (
                    /skill\s+to\s+learn/i.test(
                        cleanLine
                    )
                ) {

                    details.skill =
                        cleanLine
                            .replace(
                                /^.*?skill\s+to\s+learn\s*:?\s*/i,
                                ""
                            )
                            .trim();

                }

                else if (
                    /what\s+to\s+practice/i.test(
                        cleanLine
                    )
                ) {

                    details.practice =
                        cleanLine
                            .replace(
                                /^.*?what\s+to\s+practice\s*:?\s*/i,
                                ""
                            )
                            .trim();

                }

                else if (
                    /expected\s+outcome/i.test(
                        cleanLine
                    )
                ) {

                    details.outcome =
                        cleanLine
                            .replace(
                                /^.*?expected\s+outcome\s*:?\s*/i,
                                ""
                            )
                            .trim();

                }

            });


            const card =
                document.createElement("div");


            card.className =
                "roadmap-card";


            card.innerHTML = `
                <div class="roadmap-number">
                    ${stepNumber}
                </div>

                <div class="roadmap-content">

                    <h3>
                        Step ${stepNumber}
                    </h3>

                    <div class="roadmap-detail">

                        <strong>
                            🎯 Skill to learn
                        </strong>

                        <span>
                            ${escapeHTML(
                                details.skill ||
                                "Not specified"
                            )}
                        </span>

                    </div>

                    <div class="roadmap-detail">

                        <strong>
                            🛠️ What to practice
                        </strong>

                        <span>
                            ${escapeHTML(
                                details.practice ||
                                "Not specified"
                            )}
                        </span>

                    </div>

                    <div class="roadmap-detail">

                        <strong>
                            ✅ Expected outcome
                        </strong>

                        <span>
                            ${escapeHTML(
                                details.outcome ||
                                "Not specified"
                            )}
                        </span>

                    </div>

                </div>
            `;


            container.appendChild(card);

        });

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


        const match = text.match(
            /SUGGESTED\s+PROJECTS\s*:?\s*([\s\S]*?)(?=RESUME\s+IMPROVEMENTS|$)/i
        );


        if (!match) {

            container.innerHTML =
                "<p>Project suggestions unavailable.</p>";

            return;
        }


        const section =
            match[1].trim();


        const projects =
            section
                .split(
                    /(?=Project\s+\d+\s*:?\s*)/i
                )
                .map(function (project) {
                    return project.trim();
                })
                .filter(function (project) {
                    return /^Project\s+\d+/i.test(project);
                });


        projects.forEach(function (project, index) {

            const lines =
                project
                    .split("\n")
                    .map(function (line) {

                        return line
                            .replace(/^[-•*]\s*/, "")
                            .replace(/\*\*/g, "")
                            .trim();

                    })
                    .filter(function (line) {

                        return line.length > 0;

                    });


            if (lines.length === 0) {
                return;
            }


            const title =
                lines[0]
                    .replace(
                        /^Project\s+\d+\s*:?\s*/i,
                        ""
                    )
                    .trim();


            let description = "";
            let technologies = "";
            let useful = "";


            lines.slice(1).forEach(function (line) {

                if (
                    /what\s+it\s+does/i.test(line)
                ) {

                    description =
                        line
                            .replace(
                                /^.*?what\s+it\s+does\s*:?\s*/i,
                                ""
                            )
                            .trim();

                }

                else if (
                    /technologies/i.test(line)
                ) {

                    technologies =
                        line
                            .replace(
                                /^.*?technologies\s*:?\s*/i,
                                ""
                            )
                            .trim();

                }

                else if (
                    /why\s+it\s+is\s+useful/i.test(line)
                ) {

                    useful =
                        line
                            .replace(
                                /^.*?why\s+it\s+is\s+useful\s*:?\s*/i,
                                ""
                            )
                            .trim();

                }

            });


            const card =
                document.createElement("div");


            card.className =
                "project-card";


            card.innerHTML = `
                <div class="project-number">
                    PROJECT ${index + 1}
                </div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <div class="project-detail">

                    <strong>
                        💡 What it does
                    </strong>

                    <p>
                        ${escapeHTML(
                            description ||
                            "Not specified"
                        )}
                    </p>

                </div>

                <div class="project-detail">

                    <strong>
                        🛠️ Technologies
                    </strong>

                    <p>
                        ${escapeHTML(
                            technologies ||
                            "Not specified"
                        )}
                    </p>

                </div>

                <div class="project-detail">

                    <strong>
                        🚀 Why it is useful
                    </strong>

                    <p>
                        ${escapeHTML(
                            useful ||
                            "Not specified"
                        )}
                    </p>

                </div>
            `;


            container.appendChild(card);

        });

    }


    // =====================================================
    // RESUME IMPROVEMENTS
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


        const match = text.match(
            /RESUME\s+IMPROVEMENTS\s*:?\s*([\s\S]*?)(?=Career\s+Readiness\s+Dashboard|$)/i
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


        lines.forEach(function (line, index) {

            const cleanLine =
                line
                    .replace(/^[-•*]\s*/, "")
                    .replace(/^\d+[\.\)]\s*/, "")
                    .replace(/\*\*/g, "")
                    .trim();


            if (!cleanLine) {
                return;
            }


            let title =
                cleanLine;

            let description =
                "";


            const colonIndex =
                cleanLine.indexOf(":");


            if (colonIndex !== -1) {

                title =
                    cleanLine
                        .substring(
                            0,
                            colonIndex
                        )
                        .trim();

                description =
                    cleanLine
                        .substring(
                            colonIndex + 1
                        )
                        .trim();

            }


            const card =
                document.createElement("div");


            card.className =
                "resume-flashcard";


            card.innerHTML = `
                <div class="resume-card-top">

                    <div class="resume-card-number">
                        ${String(
                            index + 1
                        ).padStart(2, "0")}
                    </div>

                    <div class="resume-card-badge">
                        RESUME TIP
                    </div>

                </div>

                <div class="resume-card-icon">
                    📄
                </div>

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(
                        description ||
                        "Improve this section of your resume to make your profile clearer and more professional."
                    )}
                </p>

                <div class="resume-card-footer">

    
            `;


            container.appendChild(card);

        });

    }


    // =====================================================
    // AI CAREER INSIGHT
    // =====================================================

    function displayAIResult(text) {

        const container =
            document.getElementById(
                "aiResult"
            );


        if (!container) {
            return;
        }


        container.innerHTML = "";


        const careerMatch =
            text.match(
                /RECOMMENDED\s+CAREER\s*:?\s*([\s\S]*?)(?=CAREER\s+MATCH\s+SCORE|$)/i
            );


        const scoreMatch =
            text.match(
                /CAREER\s+MATCH\s+SCORE\s*[:\-]?\s*(\d{1,3})\s*%/i
            );


        const whyMatch =
            text.match(
                /WHY\s+THIS\s+CAREER\s+FITS\s*:?\s*([\s\S]*?)(?=CURRENT\s+SKILL\s+STRENGTHS|CURRENT\s+SKILLS|IMPORTANT\s+SKILL\s+GAPS|SKILLS\s+TO\s+LEARN|LEARNING\s+ROADMAP|SUGGESTED\s+PROJECTS|RESUME\s+IMPROVEMENTS|$)/i
            );


        const career =
            careerMatch
                ? careerMatch[1]
                    .trim()
                    .replace(/\*\*/g, "")
                : "Career recommendation unavailable";


        const score =
            scoreMatch
                ? scoreMatch[1]
                : "0";


        const why =
            whyMatch
                ? whyMatch[1]
                    .trim()
                    .replace(/\*\*/g, "")
                : "Career fit analysis unavailable.";


        const whyPoints =
            why
                .split("\n")
                .map(function (line) {

                    return line
                        .replace(/^[-•*]\s*/, "")
                        .trim();

                })
                .filter(function (line) {

                    return line.length > 0;

                });


        let whyHTML = "";


        whyPoints.forEach(function (point) {

            whyHTML += `
                <div class="ai-insight-point">

                    <span>
                        ✓
                    </span>

                    <p>
                        ${escapeHTML(point)}
                    </p>

                </div>
            `;

        });


        container.innerHTML = `
            <div class="ai-summary-card">

                <div class="ai-summary-header">

                    <div>

                        <span class="ai-label">
                            🤖 AI CAREER INSIGHT
                        </span>

                        <h3>
                            ${escapeHTML(career)}
                        </h3>

                    </div>

                    <div class="ai-match-score">

                        <span>
                            ${escapeHTML(score)}%
                        </span>

                        <small>
                            Match
                        </small>

                    </div>

                </div>


                <div class="ai-summary-divider"></div>


                <div class="ai-fit-section">

                    <h4>
                        💡 Why this career fits you
                    </h4>

                    <div class="ai-insight-list">
                        ${whyHTML}
                    </div>

                </div>

            </div>
        `;

    }


    // =====================================================
    // ESCAPE HTML
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