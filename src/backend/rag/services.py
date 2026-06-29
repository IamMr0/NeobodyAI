from google import genai
from django.conf import settings
from fitness.models import Exercise
from chatbot.models import ChatMessage, ChatSession

def get_gemini_client():
    api_key = settings.GEMINI_API_KEY
    if not api_key:
        print("Warning: GEMINI_API_KEY is not set.")
    # Initialize the new google-genai client
    return genai.Client(api_key=api_key)

def build_context(user, session):
    context = "You are IRON AI, a Neubrutalist, high-energy, no-nonsense fitness assistant.\n\n"
    
    # Retrieve Exercises for context
    exercises = Exercise.objects.all()[:20] # Limit to avoid massive tokens
    if exercises.exists():
        context += "Available Exercises Context:\n"
        for ex in exercises:
            context += f"- {ex.name} (Equipment: {ex.equipment}, Muscles: {ex.muscle_groups})\n"
    
    context += "\nUser Profile Context:\n"
    context += f"Username: {user.username}\n\n"

    # Retrieve Chat History
    if session:
        history = ChatMessage.objects.filter(session=session).order_by('-timestamp')[:10]
        history = reversed(history) # Chronological order
        context += "Recent Chat History:\n"
        for msg in history:
            role = "User" if msg.sender == 'user' else "IRON AI"
            context += f"{role}: {msg.message}\n"
            
    context += "\nProvide actionable, direct, and energetic fitness advice. Keep it concise."
    return context

import base64
import json
from google.genai import types

def generate_chat_response(user, user_message, session, image_base64=None):
    client = get_gemini_client()
    system_instruction = build_context(user, session)
    
    if image_base64:
        try:
            # Decode base64 image
            if ',' in image_base64:
                header, base64_data = image_base64.split(',', 1)
            else:
                base64_data = image_base64
                header = "image/jpeg"
            
            mime_type = header.split(';')[0].split(':')[1] if ';' in header and ':' in header else 'image/jpeg'
            image_bytes = base64.b64decode(base64_data)
            
            # Structured prompt for Computer Vision form cues
            scan_prompt = (
                f"{system_instruction}\n\n"
                f"Analyze the exercise form in the attached image.\n"
                f"You MUST return your response as a valid JSON object with the following keys:\n"
                f"1. \"analysis_text\": A paragraph containing direct, actionable biomechanical coaching feedback.\n"
                f"2. \"joint_angles\": A dictionary mapping detected joints to estimated angles (e.g. \"Knee Flexion\": \"85 degrees\", \"Spine Tilt\": \"12 degrees\").\n"
                f"3. \"posture_check\": Safety status, choose exactly one of: \"Safe\", \"Warning\", \"Critical\".\n"
                f"4. \"suggestions\": An array of 2-3 specific correction recommendations.\n"
                f"Return ONLY the raw JSON object, no markdown code block backticks."
            )
            
            response = client.models.generate_content(
                model='gemini-3.5-flash',
                contents=[
                    types.Part.from_bytes(data=image_bytes, mime_type=mime_type),
                    scan_prompt
                ]
            )
            
            resp_text = response.text.strip()
            if resp_text.startswith("```json"):
                resp_text = resp_text[7:]
            if resp_text.endswith("```"):
                resp_text = resp_text[:-3]
            resp_text = resp_text.strip()
            
            parsed_data = json.loads(resp_text)
            ai_msg_text = parsed_data.get('analysis_text', '')
            ai_insight = {
                'joint_angles': parsed_data.get('joint_angles', {}),
                'posture_check': parsed_data.get('posture_check', 'Safe'),
                'suggestions': parsed_data.get('suggestions', [])
            }
            return ai_msg_text, ai_insight
        except Exception as img_err:
            print(f"Error parsing image form check: {img_err}")
            # Fallback to standard chat response below if parsing fails

    try:
        full_prompt = f"System Instructions:\n{system_instruction}\n\nUser Message:\n{user_message}"
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=full_prompt
        )
        return response.text, None
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "System error: Unable to connect to the central AI core. Try again later.", None

def generate_body_insight(user, weight, body_fat, muscle_mass):
    client = get_gemini_client()
    prompt = (
        f"You are IRON AI, a Neubrutalist, high-energy fitness assistant.\n"
        f"User {user.username} just logged a body scan.\n"
        f"Weight: {weight} kg\n"
        f"Body Fat: {body_fat}%\n"
        f"Muscle Mass: {muscle_mass} kg\n\n"
        f"Provide a very brief (2-3 sentences), punchy, and highly actionable metabolic insight. "
        f"Do not use generic greetings. Just pure, hard-hitting analysis of these numbers."
    )
    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Gemini Body Insight Error: {e}")
        return "METABOLIC DATA RECEIVED. AWAITING FURTHER CALIBRATION."

def generate_nutrition_insight(user, protein, carbs, fats, kcal_consumed, kcal_target):
    client = get_gemini_client()
    prompt = (
        f"You are IRON AI, a Neubrutalist, high-energy fitness assistant.\n"
        f"User {user.username} just logged their daily nutrition.\n"
        f"Consumed: {kcal_consumed} kcal (Target: {kcal_target} kcal)\n"
        f"Macros: {protein}g Protein, {carbs}g Carbs, {fats}g Fats\n\n"
        f"Provide a brief (2-3 sentences), punchy metabolic and glycogen status analysis. "
        f"Tell them exactly what they need to adjust or if they are perfectly dialed in. "
        f"No fluff. Use a commanding, technical tone."
    )
    try:
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Gemini Nutrition Insight Error: {e}")
        return "FUEL LEVELS RECORDED. MAINTAIN OPTIMAL INTAKE FOR PEAK PERFORMANCE."
