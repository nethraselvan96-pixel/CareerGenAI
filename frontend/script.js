document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // GET HTML ELEMENTS
    // =====================================================

    const startBtn =
        document.getElementById("startBtn");

    const careerForm =
        document.getElementById("careerForm");

    const careerSection =
        document.getElementById("career-analysis");

    const careerResult =
        document.getElementById("careerResult");

    const aiLoading =
        document.getElementById("aiLoading");

    const loadingText =
        document.getElementById("loadingText");


    // =====================================================
    // START CAREER ANALYSIS BUTTON
    // =====================================================

    if (startBtn && careerSection) {

        startBtn.addEventListener("click", function () {

            careerSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    }


    // =====================================================
    // CAREER FORM SUBMIT
    // =====================================================

    if (careerForm) {

        careerForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();

                console.log("Career form submitted");


                // =================================================
                // SHOW LOADING
                // =================================================

                if (aiLoading) {
                    aiLoading.style.display = "block";
                }

                if (careerResult) {
                    careerResult.style.display = "none";
                }

                if (loadingText) {

                    loadingText.textContent =
                        "🤖 CareerGenAI is analyzing your profile...";

                }


                // =================================================
                // GET FORM VALUES
                // =================================================

                const educationElement =
                    document.getElementById("education");

                const skillsElement =
                    document.getElementById("skills");

                const interestsElement =
                    document.getElementById("interests");

                const careerGoalElement =
                    document.getElementById("careerGoal");

                const experienceElement =
                    document.getElementById("experience");


                const education =
                    educationElement
                        ? educationElement.value
                        : "";

                const skills =
                    skillsElement
                        ? skillsElement.value
                        : "";

                const interests =
                    interestsElement
                        ? interestsElement.value
                        : "";

                const careerGoal =
                    careerGoalElement
                        ? careerGoalElement.value
                        : "";

                const experience =
                    experienceElement
                        ? experienceElement.value
                        : "";


                // =================================================
                // CREATE DATA
                // =================================================

                const careerData = {

                    education: education,

                    skills: skills,

                    interests: interests,

                    careerGoal: careerGoal,

                    experience: experience

                };


                console.log(
                    "Sending data:",
                    careerData
                );


                // =================================================
                // SEND DATA TO FLASK
                // =================================================

                try {

                    const response =
                        await fetch(
                            "/analyze",
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        careerData
                                    )
                            }
                        );


                    console.log(
                        "Backend response status:",
                        response.status
                    );


                    // =================================================
                    // CHECK SERVER
                    // =================================================

                    if (!response.ok) {

                        throw new Error(
                            "Server error: " +
                            response.status
                        );

                    }


                    // =================================================
                    // GET JSON
                    // =================================================

                    const data =
                        await response.json();


                    console.log(
                        "Backend data:",
                        data
                    );


                    // =================================================
                    // CHECK SUCCESS
                    // =================================================

                    if (!data.success) {

                        throw new Error(
                            data.message ||
                            "Career analysis failed."
                        );

                    }


                    // =================================================
                    // DISPLAY PROFILE
                    // =================================================

                    setText(
                        "resultCareer",
                        data.profile &&
                        data.profile.careerGoal
                            ? data.profile.careerGoal
                            : careerGoal
                    );


                    setText(
                        "resultExperience",
                        data.profile &&
                        data.profile.experience
                            ? data.profile.experience
                            : experience
                    );


                    setText(
                        "resultSkills",
                        data.profile &&
                        data.profile.skills
                            ? data.profile.skills
                            : skills
                    );


                    setText(
                        "resultInterests",
                        data.profile &&
                        data.profile.interests
                            ? data.profile.interests
                            : interests
                    );


                    // =================================================
                    // AI TEXT
                    // =================================================

                    const aiText =
                        data.ai_result || "";


                    console.log(
                        "AI result:",
                        aiText
                    );


                    // =================================================
                    // DISPLAY RESULTS
                    // =================================================

                    calculateCareerScore(
                        aiText
                    );

                    displayCurrentSkills(
                        aiText
                    );

                    displayMissingSkills(
                        aiText
                    );

                    displayRoadmap(
                        aiText
                    );

                    displayProjects(
                        aiText
                    );

                    displayResume(
                        aiText
                    );

                    displayAIResult(
                        aiText
                    );


                    // =================================================
                    // HIDE LOADING
                    // =================================================

                    if (aiLoading) {

                        aiLoading.style.display =
                            "none";

                    }


                    // =================================================
                    // SHOW RESULT
                    // =================================================

                    if (careerResult) {

                        careerResult.style.display =
                            "block";

                        careerResult.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                    }

                }

                catch (error) {

                    console.error(
                        "CareerGenAI Error:",
                        error
                    );


                    if (aiLoading) {

                        aiLoading.style.display =
                            "none";

                    }


                    alert(
                        "Unable to connect to CareerGenAI backend.\n\n" +
                        "Please make sure Flask is running."
                    );

                }

            }

        );

    }


    // =====================================================
    // SET TEXT
    // =====================================================

    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {

            element.textContent =
                value;

        }

    }


    // =====================================================
    // CAREER SCORE
    // =====================================================

    function calculateCareerScore(aiText) {

        const careerScore =
            document.getElementById(
                "careerScore"
            );

        const scoreProgress =
            document.getElementById(
                "scoreProgress"
            );

        const readinessCareer =
            document.getElementById(
                "readinessCareer"
            );


        const match =
            aiText.match(
                /Career Match Score\s*:?\s*\**\s*(\d+)\s*%/i
            );


        if (match) {

            const score =
                parseInt(
                    match[1],
                    10
                );


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

        }

        else {

            if (careerScore) {

                careerScore.textContent =
                    "--%";

            }


            if (scoreProgress) {

                scoreProgress.style.width =
                    "0%";

            }


            if (readinessCareer) {

                readinessCareer.textContent =
                    "--%";

            }

        }

    }


    // =====================================================
    // CURRENT SKILLS
    // =====================================================

    function displayCurrentSkills(aiText) {

        const currentSkills =
            document.getElementById(
                "currentSkills"
            );

        const readinessSkills =
            document.getElementById(
                "readinessSkills"
            );


        if (!currentSkills) {
            return;
        }


        const match =
            aiText.match(
                /CURRENT\s+SKILLS\s*:?\s*\**\s*([\s\S]*?)(?=📚|SKILLS\s+TO\s+LEARN|🗺️|🚀|📄|$)/i
            );


        if (match) {

            currentSkills.innerHTML =
                formatBulletText(
                    match[1]
                );


            const lines =
                match[1]
                    .split(/\r?\n/)
                    .filter(function (line) {

                        return line.trim() !== "";

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

        }

        else {

            currentSkills.textContent =
                "No current skill information found.";


            if (readinessSkills) {

                readinessSkills.textContent =
                    "0%";

            }

        }

    }


    // =====================================================
    // MISSING SKILLS
    // =====================================================

    function displayMissingSkills(aiText) {

        const missingSkills =
            document.getElementById(
                "missingSkills"
            );

        const readinessAI =
            document.getElementById(
                "readinessAI"
            );


        if (!missingSkills) {
            return;
        }


        const match =
            aiText.match(
                /SKILLS\s+TO\s+LEARN\s*:?\s*\**\s*([\s\S]*?)(?=🗺️|🚀|📄|$)/i
            );


        if (match) {

            missingSkills.innerHTML =
                formatBulletText(
                    match[1]
                );


            const lines =
                match[1]
                    .split(/\r?\n/)
                    .filter(function (line) {

                        return line.trim() !== "";

                    });


            const score =
                Math.max(
                    100 -
                    (lines.length * 10),
                    0
                );


            if (readinessAI) {

                readinessAI.textContent =
                    score + "%";

            }

        }

        else {

            missingSkills.textContent =
                "No skill gaps found.";


            if (readinessAI) {

                readinessAI.textContent =
                    "0%";

            }

        }


        calculateOverallReadiness();

    }


    // =====================================================
    // OVERALL READINESS
    // =====================================================

    function calculateOverallReadiness() {

        const overall =
            document.getElementById(
                "readinessOverall"
            );

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


        if (
            !overall ||
            !career ||
            !skills ||
            !ai
        ) {

            return;

        }


        const careerValue =
            parseInt(
                career.textContent,
                10
            );

        const skillsValue =
            parseInt(
                skills.textContent,
                10
            );

        const aiValue =
            parseInt(
                ai.textContent,
                10
            );


        if (
            !isNaN(careerValue) &&
            !isNaN(skillsValue) &&
            !isNaN(aiValue)
        ) {

            const result =
                Math.round(
                    (
                        careerValue +
                        skillsValue +
                        aiValue
                    ) / 3
                );


            overall.textContent =
                result + "%";

        }

    }


    // =====================================================
    // ROADMAP
    // =====================================================

    function displayRoadmap(aiText) {

        const container =
            document.getElementById(
                "roadmapContainer"
            );


        if (!container) {
            return;
        }


        // -------------------------------------------------
        // FIND LEARNING ROADMAP
        // -------------------------------------------------

        const match =
            aiText.match(
                /🗺️?\s*\**\s*LEARNING\s+ROADMAP\s*\**\s*:?\s*([\s\S]*?)(?=🚀\s*\**\s*SUGGESTED\s+PROJECTS|📄\s*\**\s*RESUME\s+IMPROVEMENTS|$)/i
            );


        // Clear previous roadmap cards

        container.innerHTML = "";


        if (!match) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "roadmap-card";


            card.innerHTML =
                '<div class="roadmap-number">1</div>' +

                '<div class="roadmap-content">' +

                    '<h4>Career Roadmap</h4>' +

                    '<p>' +
                        'AI roadmap information was not found.' +
                    '</p>' +

                '</div>';


            container.appendChild(
                card
            );

            return;

        }


        const roadmapText =
            match[1].trim();


        // -------------------------------------------------
        // SPLIT STEPS
        // -------------------------------------------------

        const steps =
            roadmapText
                .split(
                    /(?=Step\s+\d+\s*[:\-–—])/i
                )
                .map(function (step) {

                    return step.trim();

                })
                .filter(function (step) {

                    return /^Step\s+\d+\s*[:\-–—]/i
                        .test(step);

                });


        // -------------------------------------------------
        // CREATE CARDS
        // -------------------------------------------------

        steps.forEach(
            function (step, index) {

                const lines =
                    step
                        .split(/\r?\n/)
                        .map(function (line) {

                            return line.trim();

                        })
                        .filter(function (line) {

                            return line !== "";

                        });


                // -------------------------------------------------
                // STEP TITLE
                // -------------------------------------------------

                let title =
                    lines[0] || "";


                title =
                    title
                        .replace(
                            /^Step\s+\d+\s*[:\-–—]\s*/i,
                            ""
                        )
                        .replace(
                            /\*\*/g,
                            ""
                        )
                        .trim();


                // -------------------------------------------------
                // FIND SKILL
                // -------------------------------------------------

                let skillLine =
                    lines.find(
                        function (line) {

                            return /Skill\s+to\s+learn:/i
                                .test(line);

                        }
                    );


                let skill = "";


                if (skillLine) {

                    skill =
                        skillLine
                            .replace(
                                /^.*Skill\s+to\s+learn:\s*/i,
                                ""
                            )
                            .replace(
                                /\*\*/g,
                                ""
                            )
                            .trim();

                }


                // If no skill line exists

                if (!skill) {

                    skill =
                        title ||
                        "Roadmap Step " +
                        (index + 1);

                }


                // -------------------------------------------------
                // DETAILS
                // -------------------------------------------------

                const detailLines =
                    lines
                        .slice(1)
                        .filter(function (line) {

                            return !/Skill\s+to\s+learn:/i
                                .test(line);

                        });


                const details =
                    detailLines
                        .map(function (line) {

                            return formatRoadmapLine(
                                line
                            );

                        })
                        .join("<br>");


                // -------------------------------------------------
                // CREATE CARD
                // -------------------------------------------------

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "roadmap-card";


                card.innerHTML =

                    '<div class="roadmap-number">' +

                        (index + 1) +

                    '</div>' +

                    '<div class="roadmap-content">' +

                        '<h4>' +

                            escapeHTML(skill) +

                        '</h4>' +

                        '<p>' +

                            details +

                        '</p>' +

                    '</div>';


                container.appendChild(
                    card
                );

            }
        );

    }


    // =====================================================
    // FORMAT ROADMAP LINE
    // =====================================================

    function formatRoadmapLine(line) {

        line =
            line
                .replace(
                    /^[-•*]\s*/,
                    ""
                )
                .replace(
                    /\*\*/g,
                    ""
                )
                .trim();


        if (!line) {
            return "";
        }


        return "• " +
            escapeHTML(line);

    }


    // =====================================================
    // PROJECTS
    // =====================================================

    function displayProjects(aiText) {

        const container =
            document.getElementById(
                "projectsContainer"
            );


        if (!container) {
            return;
        }


        const match =
            aiText.match(
                /🚀\s*\**\s*SUGGESTED\s+PROJECTS\s*\**\s*([\s\S]*?)(?=📄\s*\**\s*RESUME\s+IMPROVEMENTS|$)/i
            );


        container.innerHTML = "";


        if (!match) {
            return;
        }


        const projects =
            match[1]
                .split(
                    /(?=Project\s+\d+\s*[:\-–—])/i
                )
                .map(function (project) {

                    return project.trim();

                })
                .filter(function (project) {

                    return /^Project\s+\d+\s*[:\-–—]/i
                        .test(project);

                });


        projects
            .slice(0, 3)
            .forEach(
                function (project, index) {

                    const lines =
                        project
                            .split(/\r?\n/)
                            .map(function (line) {

                                return line.trim();

                            })
                            .filter(function (line) {

                                return line !== "";

                            });


                    let projectName =
                        lines[0] || "";


                    projectName =
                        projectName
                            .replace(
                                /^Project\s+\d+\s*[:\-–—]\s*/i,
                                ""
                            )
                            .replace(
                                /\*\*/g,
                                ""
                            )
                            .trim();


                    if (!projectName) {

                        projectName =
                            "AI Project " +
                            (index + 1);

                    }


                    const details =
                        lines
                            .slice(1)
                            .map(function (line) {

                                return formatRoadmapLine(
                                    line
                                );

                            })
                            .join("<br>");


                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "project-card";


                    card.innerHTML =

                        '<div class="project-number">' +

                            (index + 1) +

                        '</div>' +

                        '<div class="project-content">' +

                            '<h4>' +

                                '🚀 ' +

                                escapeHTML(
                                    projectName
                                ) +

                            '</h4>' +

                            '<p>' +

                                details +

                            '</p>' +

                        '</div>';


                    container.appendChild(
                        card
                    );

                }
            );

    }


    // =====================================================
    // RESUME
    // =====================================================

    function displayResume(aiText) {

        const container =
            document.getElementById(
                "resumeContainer"
            );


        if (!container) {
            return;
        }


        const match =
            aiText.match(
                /📄\s*\**\s*RESUME\s+IMPROVEMENTS\s*\**\s*([\s\S]*)$/i
            );


        container.innerHTML = "";


        if (!match) {
            return;
        }


        const suggestions =
            match[1]
                .split(/\r?\n/)
                .map(function (line) {

                    return line
                        .trim()
                        .replace(
                            /^[-•*]\s*/,
                            ""
                        )
                        .replace(
                            /^\d+\.\s*/,
                            ""
                        )
                        .replace(
                            /\*\*/g,
                            ""
                        );

                })
                .filter(function (line) {

                    return line !== "";

                });


        suggestions
            .slice(0, 4)
            .forEach(
                function (
                    suggestion,
                    index
                ) {

                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "resume-card";


                    card.innerHTML =

                        '<div class="resume-number">' +

                            '📌 ' +

                            (index + 1) +

                        '</div>' +

                        '<p>' +

                            escapeHTML(
                                suggestion
                            ) +

                        '</p>';


                    container.appendChild(
                        card
                    );

                }
            );

    }


    // =====================================================
    // FULL AI RESULT
    // =====================================================

    function displayAIResult(aiText) {

        const aiResult =
            document.getElementById(
                "aiResult"
            );


        if (!aiResult) {
            return;
        }


        // =================================================
        // IMPORTANT
        //
        // Remove sections that already have their own
        // beautiful cards above.
        //
        // This prevents duplicate:
        // - Learning Roadmap
        // - Suggested Projects
        // - Resume Improvements
        // =================================================

        let result =
            removeDuplicateSections(
                aiText
            );


        // Escape HTML first

        result =
            escapeHTML(result);


        // =================================================
        // SECTION HEADINGS
        // =================================================

        result =
            result.replace(
                /🎯\s*\**\s*RECOMMENDED\s+CAREER\s*\**/gi,
                "<h2>🎯 Recommended Career</h2>"
            );


        result =
            result.replace(
                /💡\s*\**\s*WHY\s+THIS\s+CAREER\s+FITS\s*\**/gi,
                "<h2>💡 Why This Career Fits</h2>"
            );


        result =
            result.replace(
                /💪\s*\**\s*CURRENT\s+SKILL\s+STRENGTHS\s*\**/gi,
                "<h2>💪 Current Skill Strengths</h2>"
            );


        result =
            result.replace(
                /📚\s*\**\s*IMPORTANT\s+SKILL\s+GAPS\s*\**/gi,
                "<h2>📚 Important Skill Gaps</h2>"
            );


        // =================================================
        // REMOVE ANY LEFTOVER ROADMAP HEADING
        // =================================================

        result =
            result.replace(
                /🗺️\s*\**\s*LEARNING\s+ROADMAP\s*\**/gi,
                ""
            );


        result =
            result.replace(
                /🚀\s*\**\s*SUGGESTED\s+PROJECTS\s*\**/gi,
                ""
            );


        result =
            result.replace(
                /📄\s*\**\s*RESUME\s+IMPROVEMENTS\s*\**/gi,
                ""
            );


        // =================================================
        // BOLD TEXT
        // =================================================

        result =
            result.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
            );


        // =================================================
        // BULLETS
        // =================================================

        result =
            result.replace(
                /^[-•]\s+(.*?)$/gm,
                "• $1"
            );


        // =================================================
        // NEW LINES
        // =================================================

        result =
            result.replace(
                /\n/g,
                "<br>"
            );


        // =================================================
        // DISPLAY
        // =================================================

        aiResult.innerHTML =
            result;

    }


    // =====================================================
    // REMOVE DUPLICATE SECTIONS
    // =====================================================

    function removeDuplicateSections(aiText) {

        let text =
            aiText;


        // -------------------------------------------------
        // REMOVE LEARNING ROADMAP
        // -------------------------------------------------

        text =
            text.replace(
                /🗺️\s*\**\s*LEARNING\s+ROADMAP\s*\**[\s\S]*?(?=🚀\s*\**\s*SUGGESTED\s+PROJECTS|📄\s*\**\s*RESUME\s+IMPROVEMENTS|$)/i,
                ""
            );


        // -------------------------------------------------
        // REMOVE SUGGESTED PROJECTS
        // -------------------------------------------------

        text =
            text.replace(
                /🚀\s*\**\s*SUGGESTED\s+PROJECTS\s*\**[\s\S]*?(?=📄\s*\**\s*RESUME\s+IMPROVEMENTS|$)/i,
                ""
            );


        // -------------------------------------------------
        // REMOVE RESUME IMPROVEMENTS
        // -------------------------------------------------

        text =
            text.replace(
                /📄\s*\**\s*RESUME\s+IMPROVEMENTS\s*\**[\s\S]*$/i,
                ""
            );


        return text.trim();

    }


    // =====================================================
    // FORMAT BULLETS
    // =====================================================

    function formatBulletText(text) {

        return text
            .trim()
            .split(/\r?\n/)
            .map(function (line) {

                line =
                    line
                        .trim()
                        .replace(
                            /^[-•*]\s*/,
                            ""
                        )
                        .replace(
                            /\*\*/g,
                            ""
                        );


                if (!line) {
                    return "";
                }


                return "• " +
                    escapeHTML(line);

            })
            .filter(function (line) {

                return line !== "";

            })
            .join("<br>");

    }


    // =====================================================
    // ESCAPE HTML
    // =====================================================

    function escapeHTML(text) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            text;


        return div.innerHTML;

    }


});