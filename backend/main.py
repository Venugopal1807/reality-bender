# main.py
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import replicate
import os
from dotenv import load_dotenv
import base64

load_dotenv()

app = FastAPI()

# Allowing Frontend to talk to Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Editor API is running"}

@app.post("/edit-image")
async def edit_image(prompt: str = Form(...), image: UploadFile = File(...)):
    try:
        # Read image file
        image_bytes = await image.read()
        
        # Replicate expects a URI/Base64
        # Convert bytes to base64 string
        base64_img = base64.b64encode(image_bytes).decode('utf-8')
        data_uri = f"data:{image.content_type};base64,{base64_img}"

        print(f"Processing prompt: {prompt}")

        output = replicate.run(
            "timbrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
            input={
                "image": data_uri,
                "prompt": prompt,
                "num_inference_steps": 20,
                "image_guidance_scale": 1.5,
            }
        )
        
        # Output is in the form of a list of URLs
        return {"success": True, "imageUrl": output[0]}

    except Exception as e:
        print(f"Error: {str(e)}")
        return {"success": False, "error": str(e)}

# To run: uvicorn main:app --reload