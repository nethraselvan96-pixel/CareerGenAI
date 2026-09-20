from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


@app.route("/style.css")
def style():
    return send_from_directory(FRONTEND_DIR, "style.css")


@app.route("/script.js")
def script():
    return send_from_directory(FRONTEND_DIR, "script.js")

@app.route("/analyze", methods=["POST"])
def analyze_career():

    data = request.get_json()

    education = data.get("education", "")
    skills = data.get("skills", "")
    interests = data.get("interests", "")
    career_goal = data.get("careerGoal", "")
    experience = data.get("experience", "")

    prompt = f"""
You are CareerGenAI, an AI career guidance assistant.

Analyze this student's profile:

Education: {education}
Skills: {skills}
Interests: {interests}
Career Goal: {career_goal}
Experience: {experience}
Before generating the final answer:

1. Identify the student's current skills.
2. Identify the skills normally required for the recommended career.
3. Compare both lists.
4. Find the skills required for the career that the student does not currently have.
5. Use those skills as SKILLS TO LEARN.

Give practical career guidance.

Return the answer in this exact structure:

🎯 RECOMMENDED CAREER
Give one clear career recommendation.

📊 CAREER MATCH SCORE
Give a realistic percentage from 0 to 100 based on how well the student's current skills, interests, education, experience, and career goal align with the recommended career.

Format exactly like:
Career Match Score: 78%

💡 WHY THIS CAREER FITS
Give 2-3 short points.

💪 CURRENT SKILL STRENGTHS

CURRENT SKILLS:
- skill 1
- skill 2
- skill 3

📚 IMPORTANT SKILL GAPS

SKILLS TO LEARN:
1. [Specific missing skill]
2. [Specific missing skill]
3. [Specific missing skill]
4. [Specific missing skill]
5. [Specific missing skill]

IMPORTANT:
- Compare the student's CURRENT SKILLS with the skills required for the RECOMMENDED CAREER.
- Only list skills that the student does NOT already have.
- Never say "No missing skills detected".
- Always provide at least 3 missing skills unless the student genuinely has all the required skills.
- Use specific technical skills, not generic phrases.
- For a GenAI Engineer career, consider skills such as Machine Learning, Deep Learning, NLP, LLMs, Prompt Engineering, RAG, LangChain, Vector Databases, Hugging Face, APIs, Git/GitHub, Docker, and Cloud.
- Do not list a skill as missing if it is already present in the student's CURRENT SKILLS.
- Keep the list relevant to the recommended career.

IMPORTANT:
You MUST include the exact heading "SKILLS TO LEARN:".
Do not rename it.
Do not omit it.
Give 3-5 specific skills that the student should learn for the recommended career.
🗺️ LEARNING ROADMAP
Give exactly 6 steps.
For each step include:
- Skill to learn
- What to practice
- Expected outcome
🚀 SUGGESTED PROJECTS

Give exactly 3 practical projects that are relevant to the user's target career.

IMPORTANT:
Follow the exact format below.
Do not change the headings.
Do not combine projects.
Do not use tables.

Project 1: [Project Name]
What it does: [Brief explanation of what the project does]
Technologies: [Technologies and tools used]
Why it is useful: [How this project helps build career-ready skills]

Project 2: [Project Name]
What it does: [Brief explanation of what the project does]
Technologies: [Technologies and tools used]
Why it is useful: [How this project helps build career-ready skills]

Project 3: [Project Name]
What it does: [Brief explanation of what the project does]
Technologies: [Technologies and tools used]
Why it is useful: [How this project helps build career-ready skills]

RULES:
- Give exactly 3 projects.
- Start every project with "Project 1:", "Project 2:", or "Project 3:".
- Keep each project concise.
- Do not put multiple projects in the same paragraph.
- Do not use Markdown tables.
- Do not add another "Project 4".
📄 RESUME IMPROVEMENTS
Give 4 practical suggestions.

Keep the response concise, beginner-friendly, and practical.
Do not use Markdown headings such as ###.
Do not use tables.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )

        ai_result = response.text

    except Exception as e:

        print("Gemini API Error:", e)

        ai_result = """
Gemini is temporarily busy.

Please try the Career Analysis again in a few seconds.

Your CareerGenAI backend and API connection are working correctly.
"""

    return jsonify({
        "success": True,
        "ai_result": ai_result,
        "profile": {
            "education": education,
            "skills": skills,
            "interests": interests,
            "careerGoal": career_goal,
            "experience": experience
        }
    })
if __name__ == "__main__":
    app.run(debug=True)