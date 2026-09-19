document.addEventListener("DOMContentLoaded", function () {

    // =====================================================
    // GET HTML ELEMENTS
    // =====================================================

    const startBtn = document.getElementById("startBtn");
    const careerForm = document.getElementById("careerForm");
    const careerSection = document.getElementById("career-analysis");
    const careerResult = document.getElementById("careerResult");

    const aiLoading = document.getElementById("aiLoading");
    const loadingText = document.getElementById("loadingText");


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

        careerForm.addEventListener("submit", async function (event) {

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

            const education =
                document.getElementById("education").value;

            const skills =
                document.getElementById("skills").value;

            const interests =
                document.getElementById("interests").value;

            const careerGoal =
                document.getElementById("careerGoal").value;

            const experience =
                document.getElementById("experience").value;


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


            console.log("Sending data:", careerData);


            // =================================================
            // SEND DATA TO FLASK
            // =================================================

            try {

                const response = await fetch(
                    "http://127.0.0.1:5000/analyze",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(careerData)
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
                // CAREER SCORE
                // =================================================

                calculateCareerScore(aiText);


                // =================================================
                // CURRENT SKILLS
                // =================================================

                displayCurrentSkills(aiText);


                // =================================================
                // SKILLS TO LEARN
                // =================================================

                displayMissingSkills(aiText);


                // =================================================
                // ROADMAP
                // =================================================

                displayRoadmap(aiText);


                // =================================================
                // PROJECTS
                // =================================================

                displayProjects(aiText);


                // =================================================
                // RESUME
                // =================================================

                displayResume(aiText);


                // =================================================
                // FULL AI RESULT
                // =================================================

                displayAIResult(aiText);


                // =================================================
                // HIDE LOADING
                // =================================================

                if (aiLoading) {
                    aiLoading.style.display = "none";
                }


                // =================================================
                // SHOW RESULT
                // =================================================

                if (careerResult) {

                    careerResult.style.display = "block";

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
                    aiLoading.style.display = "none";
                }


                alert(
                    "Unable to connect to CareerGenAI backend.\n\n" +
                    "Please make sure Flask is running."
                );

            }

        });

    }


    // =====================================================
    // SET TEXT
    // =====================================================

    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = value;
        }

    }


    // =====================================================
    // CAREER SCORE
    // =====================================================

    function calculateCareerScore(aiText) {

        const careerScore =
            document.getElementById("careerScore");

        const scoreProgress =
            document.getElementById("scoreProgress");

        const readinessCareer =
            document.getElementById("readinessCareer");


        const match =
            aiText.match(
                /Career Match Score\s*:?\s*\**\s*(\d+)\s*%/i
            );


        if (match) {

            const score =
                parseInt(match[1], 10);


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
                careerScore.textContent = "--%";
            }

            if (scoreProgress) {
                scoreProgress.style.width = "0%";
            }

            if (readinessCareer) {
                readinessCareer.textContent = "--%";
            }

        }

    }


    // =====================================================
    // CURRENT SKILLS
    // =====================================================

    function displayCurrentSkills(aiText) {

        const currentSkills =
            document.getElementById("currentSkills");

        const readinessSkills =
            document.getElementById("readinessSkills");


        if (!currentSkills) {
            return;
        }


        const match =
            aiText.match(
                /CURRENT SKILLS\s*:?\s*\**\s*([\s\S]*?)(?=SKILLS TO LEARN|🗺️|🚀|📄|$)/i
            );


        if (match) {

            currentSkills.innerHTML =
                formatBulletText(match[1]);


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
                readinessSkills.textContent = "0%";
            }

        }

    }


    // =====================================================
    // MISSING SKILLS
    // =====================================================

    function displayMissingSkills(aiText) {

        const missingSkills =
            document.getElementById("missingSkills");

        const readinessAI =
            document.getElementById("readinessAI");


        if (!missingSkills) {
            return;
        }


        const match =
            aiText.match(
                /SKILLS TO LEARN\s*:?\s*\**\s*([\s\S]*?)(?=🗺️|🚀|📄|$)/i
            );


        if (match) {

            missingSkills.innerHTML =
                formatBulletText(match[1]);


            const lines =
                match[1]
                    .split(/\r?\n/)
                    .filter(function (line) {

                        return line.trim() !== "";

                    });


            const score =
                Math.max(
                    100 - (lines.length * 10),
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
                readinessAI.textContent = "0%";
            }

        }


        calculateOverallReadiness();

    }


    // =====================================================
    // OVERALL READINESS
    // =====================================================

    function calculateOverallReadiness() {

        const overall =
            document.getElementById("readinessOverall");

        const career =
            document.getElementById("readinessCareer");

        const skills =
            document.getElementById("readinessSkills");

        const ai =
            document.getElementById("readinessAI");


        if (!overall || !career || !skills || !ai) {
            return;
        }


        const careerValue =
            parseInt(career.textContent, 10);

        const skillsValue =
            parseInt(skills.textContent, 10);

        const aiValue =
            parseInt(ai.textContent, 10);


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


        const match =
            aiText.match(
                /🗺️\s*\**\s*LEARNING ROADMAP\s*\**\s*([\s\S]*?)(?=🚀\s*\**\s*SUGGESTED PROJECTS|📄\s*\**\s*RESUME IMPROVEMENTS|$)/i
            );


        if (!match) {
            return;
        }


        const steps =
            match[1]
                .split(
                    /(?=Step\s+\d+\s*[:\-–—])/i
                )
                .map(function (step) {

                    return step.trim();

                })
                .filter(function (step) {

                    return /^Step\s+\d+\s*[:\-–—]/i.test(
                        step
                    );

                });


        container.innerHTML = "";


        steps.forEach(function (step, index) {

            const lines =
                step
                    .split(/\r?\n/)
                    .filter(function (line) {

                        return line.trim() !== "";

                    });


            let title =
                lines[0] || "";


            title =
                title
                    .replace(
                        /^Step\s+\d+\s*[:\-–—]\s*/i,
                        ""
                    )
                    .replace(/\*\*/g, "")
                    .trim();


            let skill =
                lines.find(function (line) {

                    return /Skill to learn:/i.test(
                        line
                    );

                });


            if (skill) {

                skill =
                    skill
                        .replace(
                            /^.*Skill to learn:\s*/i,
                            ""
                        )
                        .replace(/\*\*/g, "")
                        .trim();

            }

            else {

                skill =
                    title ||
                    "Roadmap Step " +
                    (index + 1);

            }


            const details =
                lines
                    .slice(1)
                    .filter(function (line) {

                        return !/Skill to learn:/i.test(
                            line
                        );

                    })
                    .map(function (line) {

                        return line
                            .replace(
                                /^[-•*]\s*/,
                                "• "
                            )
                            .replace(
                                /\*\*/g,
                                ""
                            );

                    })
                    .join("<br>");


            const card =
                document.createElement("div");


            card.className =
                "roadmap-card";


            card.innerHTML =
                '<div class="roadmap-number">' +
                    (index + 1) +
                '</div>' +

                '<div class="roadmap-content">' +

                    '<h4>' +
                        skill +
                    '</h4>' +

                    '<p>' +
                        details +
                    '</p>' +

                '</div>';


            container.appendChild(card);

        });

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
                /🚀\s*\**\s*SUGGESTED PROJECTS\s*\**\s*([\s\S]*?)(?=📄\s*\**\s*RESUME IMPROVEMENTS|$)/i
            );


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

                    return /^Project\s+\d+\s*[:\-–—]/i.test(
                        project
                    );

                });


        container.innerHTML = "";


        projects
            .slice(0, 3)
            .forEach(function (project, index) {

                const lines =
                    project
                        .split(/\r?\n/)
                        .filter(function (line) {

                            return line.trim() !== "";

                        });


                let projectName =
                    lines[0] || "";


                projectName =
                    projectName
                        .replace(
                            /^Project\s+\d+\s*[:\-–—]\s*/i,
                            ""
                        )
                        .replace(/\*\*/g, "")
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

                            return line
                                .replace(
                                    /^[-•*]\s*/,
                                    "• "
                                )
                                .replace(
                                    /\*\*/g,
                                    ""
                                );

                        })
                        .join("<br>");


                const card =
                    document.createElement("div");


                card.className =
                    "project-card";


                card.innerHTML =
                    '<div class="project-number">' +
                        (index + 1) +
                    '</div>' +

                    '<div class="project-content">' +

                        '<h4>' +
                            '🚀 ' + projectName +
                        '</h4>' +

                        '<p>' +
                            details +
                        '</p>' +

                    '</div>';


                container.appendChild(card);

            });

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
                /📄\s*\**\s*RESUME IMPROVEMENTS\s*\**\s*([\s\S]*)$/i
            );


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


        container.innerHTML = "";


        suggestions
            .slice(0, 4)
            .forEach(function (suggestion, index) {

                const card =
                    document.createElement("div");


                card.className =
                    "resume-card";


                card.innerHTML =
                    '<div class="resume-number">' +
                        '📌 ' + (index + 1) +
                    '</div>' +

                    '<p>' +
                        suggestion +
                    '</p>';


                container.appendChild(card);

            });

    }


    // =====================================================
    // FULL AI RESULT
    // =====================================================

    function displayAIResult(aiText) {

        const aiResult =
            document.getElementById("aiResult");


        if (!aiResult) {
            return;
        }


        let result =
            escapeHTML(aiText);


        result =
            result.replace(
                /🎯\s*\**\s*RECOMMENDED CAREER\s*\**/gi,
                "<h2>🎯 Recommended Career</h2>"
            );


        result =
            result.replace(
                /💡\s*\**\s*WHY THIS CAREER FITS\s*\**/gi,
                "<h2>💡 Why This Career Fits</h2>"
            );


        result =
            result.replace(
                /💪\s*\**\s*CURRENT SKILL STRENGTHS\s*\**/gi,
                "<h2>💪 Current Skill Strengths</h2>"
            );


        result =
            result.replace(
                /📚\s*\**\s*IMPORTANT SKILL GAPS\s*\**/gi,
                "<h2>📚 Important Skill Gaps</h2>"
            );


        result =
            result.replace(
                /🗺️\s*\**\s*LEARNING ROADMAP\s*\**/gi,
                "<h2>🗺️ Learning Roadmap</h2>"
            );


        result =
            result.replace(
                /🚀\s*\**\s*SUGGESTED PROJECTS\s*\**/gi,
                "<h2>🚀 Suggested Projects</h2>"
            );


        result =
            result.replace(
                /📄\s*\**\s*RESUME IMPROVEMENTS\s*\**/gi,
                "<h2>📄 Resume Improvements</h2>"
            );


        result =
            result.replace(
                /\*\*(.*?)\*\*/g,
                "<strong>$1</strong>"
            );


        result =
            result.replace(
                /^[-•]\s+(.*?)$/gm,
                "• $1"
            );


        result =
            result.replace(
                /\n/g,
                "<br>"
            );


        aiResult.innerHTML =
            result;

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


                return "• " + line;

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
            document.createElement("div");


        div.textContent =
            text;


        return div.innerHTML;

    }


});