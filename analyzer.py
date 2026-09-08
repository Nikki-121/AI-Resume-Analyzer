import re


# Common technical skills
SKILLS = {
    "python",
    "java",
    "c++",
    "javascript",
    "typescript",
    "html",
    "css",
    "react",
    "angular",
    "node.js",
    "flask",
    "django",
    "fastapi",
    "spring",
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "aws",
    "azure",
    "docker",
    "kubernetes",
    "git",
    "github",
    "rest api",
    "rest apis",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "ai",
    "nlp",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
    "scikit-learn",
    "data structures",
    "algorithms",
    "power bi",
    "excel",
}


def normalize_text(text):
    """
    Convert text into a consistent format for skill matching.
    """
    text = text.lower()
    text = re.sub(r"\s+", " ", text)
    return text


def extract_skills(text):
    """
    Extract known technical skills from text.
    """
    normalized_text = normalize_text(text)

    found_skills = set()

    for skill in SKILLS:
        if skill in normalized_text:
            found_skills.add(skill)

    return sorted(found_skills)


def calculate_match(resume_skills, job_skills):
    """
    Calculate percentage of job-required skills
    that are present in the resume.
    """

    if not job_skills:
        return 0

    matched = set(resume_skills).intersection(set(job_skills))

    score = (len(matched) / len(set(job_skills))) * 100

    return round(score)


def analyze_resume(resume_text, job_description):
    """
    Analyze resume against a job description.
    """

    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_description)

    matched_skills = sorted(
        set(resume_skills).intersection(set(job_skills))
    )

    missing_skills = sorted(
        set(job_skills) - set(resume_skills)
    )

    match_score = calculate_match(
        resume_skills,
        job_skills
    )

    suggestions = []

    if missing_skills:
        suggestions.append(
            "Consider learning or highlighting the missing job-related skills."
        )

    if len(resume_text.strip()) < 500:
        suggestions.append(
            "Your resume appears short. Consider adding relevant projects, "
            "internship experience, certifications, and technical skills."
        )

    if not suggestions:
        suggestions.append(
            "Your resume contains several skills relevant to this job."
        )

    if match_score >= 80:
        recommendation = "Strong Match — Apply"
    elif match_score >= 60:
        recommendation = "Good Match — Consider Applying"
    elif match_score >= 40:
        recommendation = "Moderate Match — Improve Skills"
    else:
        recommendation = "Low Match — Build Required Skills"

    return {
        "match_score": match_score,
        "resume_skills": resume_skills,
        "job_skills": job_skills,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "recommendation": recommendation,
    }
