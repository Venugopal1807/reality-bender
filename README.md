# 🔮 Reality Bender: AI Image Editor

Reality Bender is a full-stack generative AI application that allows users to edit images using natural language instructions (e.g., "Make it look like a futuristic city" or "Turn the day into night").

Unlike traditional editors that require complex masking or manual brushwork, this application leverages the InstructPix2Pix diffusion model to understand the semantic context of the image and the text prompt simultaneously.

# 🚀 Live Demo

[Insert Your Vercel/Render Link Here]

(Note: The live demo defaults to "Showcase Mode" to save API credits. Toggle "Live Backend" to use the real model.)

📄 Assignment Technical Write-up

Submitted as part of the AI + Full Stack Intern Assignment.

1. AI Model Selection

I chose timbrooks/instruct-pix2pix (hosted via Replicate).

Why: Standard Stable Diffusion generates new images from scratch. InstructPix2Pix is specifically designed to modify existing images based on text instructions. This fits the "Natural Language Editor" brief perfectly and offers high utility for creative workflows without the complexity of masking tools.

2. How AI is Used

The application follows a clean request-response flow:

User uploads an image and provides a text prompt.

Frontend (Next.js) sends the file to the Backend (FastAPI).

Backend converts the image to Base64 and queries the Replicate Inference API.

The AI model interprets the instruction and returns the modified image URL.

3. Architecture & Tech Stack

I architected this as a decoupled full-stack application to separate concerns:

Frontend: Next.js 14 (App Router) & Tailwind CSS. Chosen for server-side rendering performance, SEO, and the ability to maintain complex state (Dark Mode, Simulation toggles).

Backend: Python FastAPI. I choose Python over Node.js for the backend to align with standard AI engineering practices and to allow for future expansion into local inference (PyTorch/HuggingFace) if needed.

DevOps: The backend is containerized using Docker for reproducibility.

# ✨ Key Features

Dual-Mode Engine:

Showcase Mode: A mock-data layer that allows recruiters/users to test the UI flow instantly without needing a running backend or API keys.

Live Backend Mode: Connects to the local/deployed Python server for real-time inference.

Modern UX: Fully responsive UI with a custom Dark/Light theme toggle and loading states.

Secure: API keys are managed server-side (FastAPI), never exposed to the client.

# 🛠️ Local Setup Instructions

Prerequisites

Node.js & npm

Python 3.10 or higher

A Replicate API Token

Step 1: Clone the Repository

git clone [https://github.com/your-username/reality-bender.git](https://github.com/your-username/reality-bender.git)
cd reality-bender


Step 2: Backend Setup (The Brain)

cd backend

Create virtual environment (Python 3.11 recommended)
python -m venv venv

Activate (Windows)
venv\Scripts\activate
Activate (Mac/Linux)
source venv/bin/activate

Install dependencies
pip install -r requirements.txt

Create .env file
echo "REPLICATE_API_TOKEN=r8_your_key_here" > .env

Run Server
uvicorn main:app --reload --port 8000


Step 3: Frontend Setup (The Interface)

Open a new terminal in the root folder:

cd frontend
npm install
npm run dev


Open http://localhost:3000 in your browser.

🐳 Docker Support

The backend includes a Dockerfile for containerized deployment.

cd backend
docker build -t ai-reality-bender .
docker run -p 8000:8000 --env-file .env ai-reality-bender


👨‍💻 Development Notes

Hybrid Development: I used Gemini to get boilerplate generation (CSS/Components) while manually architecting the state management, API security, and deployment pipeline.