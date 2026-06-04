import os
from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import json

# Try importing SDKs - if missing during development, we'll mock them securely
try:
    from groq import Groq
    from openai import OpenAI
    SDK_AVAILABLE = True
except ImportError:
    SDK_AVAILABLE = False

load_dotenv()

app = FastAPI(title="BudgetEase AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Clients
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY", "mock_key")) if SDK_AVAILABLE else None
openai_client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY", "mock_key")) if SDK_AVAILABLE else None

class CategorizeRequest(BaseModel):
    natural_language_input: str
    categories: list[str] = [
        "Groceries", "Utilities", "Entertainment", "Transportation", 
        "Home", "Housing & Rent", "Other"
    ]

class ParseReceiptRequest(BaseModel):
    storage_url: str

@app.post("/categorize")
async def categorize_transaction(req: CategorizeRequest):
    if not os.environ.get("GROQ_API_KEY") or os.environ.get("GROQ_API_KEY") == "your_groq_api_key_here":
        # Return mock JSON if keys aren't set yet (for UI development)
        return {
            "amount": 45.0,
            "merchant": "Mocked Merchant",
            "category": "Transportation",
            "isRecurring": False
        }

    try:
        prompt = f"""
        Extract the expense details from the following user input: "{req.natural_language_input}"
        The available categories are: {', '.join(req.categories)}. 
        You MUST respond ONLY with a valid JSON object in this exact format:
        {{
            "amount": float,
            "merchant": "string",
            "category": "string (MUST exactly match one of the available categories)",
            "isRecurring": boolean
        }}
        """

        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a precise financial data extraction API. You output ONLY valid JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            model="llama3-8b-8192",
            temperature=0,
            response_format={"type": "json_object"}
        )

        response_text = chat_completion.choices[0].message.content
        return json.loads(response_text)

    except Exception as e:
        print(f"[Groq Error]: {e}")
        raise HTTPException(status_code=500, detail="Failed to categorize transaction")


@app.post("/parse-receipt")
async def parse_receipt(req: ParseReceiptRequest):
    if not os.environ.get("OPENAI_API_KEY") or os.environ.get("OPENAI_API_KEY") == "your_openai_api_key_here":
        # Mock response for UI development
        return {
            "amount": 125.50,
            "merchant": "Mocked Receipt Store",
            "category": "Groceries",
            "date": "2026-05-28"
        }

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Extract the total amount, the merchant name, and guess the best category from this receipt. Reply ONLY in JSON format: {\"amount\": float, \"merchant\": \"string\", \"category\": \"string\"}"},
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": req.storage_url,
                            },
                        },
                    ],
                }
            ],
            max_tokens=300,
        )
        response_text = response.choices[0].message.content
        # Ensure clean json parsing if markdown is wrapped
        if response_text.startswith("```json"):
            response_text = response_text[7:-3]
        return json.loads(response_text)
    
    except Exception as e:
        print(f"[OpenAI Error]: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse receipt")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
