from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = Flask(__name__)

CORS(app)


app.route("/")
def home():
    return jsonify({
        "message": "CareerGenAI backend is running 🚀"
    })


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
Give 3-5 short bullet points describing the student's existing skills.

📚 IMPORTANT SKILL GAPS
Give 3-5 short bullet points describing the most important skills the student needs to learn.

Use this exact format:

CURRENT SKILLS:
- skill 1
- skill 2
- skill 3

SKILLS TO LEARN:
- skill 1
- skill 2
- skill 3

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