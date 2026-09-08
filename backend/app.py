from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import PyPDF2

app = Flask(__name__)
CORS(app)

# Upload configuration
UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf"}

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


def extract_text_from_pdf(filepath):
    text = ""

    try:
        with open(filepath, "rb") as file:
            reader = PyPDF2.PdfReader(file)

            for page in reader.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

    except Exception as e:
        raise Exception(f"PDF extraction failed: {str(e)}")

    return text


@app.route("/")
def home():
    return jsonify({
        "message": "AI Resume Analyzer API is running",
        "status": "success"
    })


@app.route("/api/analyze", methods=["POST"])
def analyze_resume():

    if "resume" not in request.files:
        return jsonify({
            "error": "Please upload a resume PDF"
        }), 400

    resume = request.files["resume"]

    if resume.filename == "":
        return jsonify({
            "error": "No file selected"
        }), 400

    if not allowed_file(resume.filename):
        return jsonify({
            "error": "Only PDF files are allowed"
        }), 400

    job_description = request.form.get("job_description", "").strip()

    if not job_description:
        return jsonify({
            "error": "Please enter a job description"
        }), 400

    filename = secure_filename(resume.filename)
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)

    resume.save(filepath)

    try:
        resume_text = extract_text_from_pdf(filepath)

        if not resume_text.strip():
            return jsonify({
                "error": "Could not extract text from the resume PDF"
            }), 400

        return jsonify({
            "status": "success",
            "message": "Resume uploaded and analyzed successfully",
            "resume_text_length": len(resume_text),
            "resume_text": resume_text,
            "job_description": job_description
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
