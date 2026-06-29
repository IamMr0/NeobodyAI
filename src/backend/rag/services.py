from groq import Groq
from django.conf import settings
from fitness.models import Exercise
from chatbot.models import ChatMessage, ChatSession

def get_groq_client():
    api_key = settings.GROQ_API_KEY
    if not api_key:
        print("Warning: GROQ_API_KEY is not set.")
    return Groq(api_key=api_key)

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

import json

def generate_chat_response(user, user_message, session, image_base64=None):
    client = get_groq_client()
    system_instruction = build_context(user, session)
    
    if image_base64:
        try:
            # Structured prompt for Computer Vision form cues
            scan_prompt = (
                f"{system_instruction}\n\n"
                f"Analyze the exercise form in the attached image.\n"
                f"You MUST return your response as a valid JSON object with the following keys:\n"
                f"1. \"analysis_text\": A paragraph containing direct, actionable biomechanical coaching feedback.\n"
                f"2. \"joint_angles\": A dictionary mapping detected joints to estimated angles (e.g. \"Knee Flexion\": \"85 degrees\", \"Spine Tilt\": \"12 degrees\").\n"
                f"3. \"posture_check\": Safety status, choose exactly one of: \"Safe\", \"Warning\", \"Critical\".\n"
                f"4. \"suggestions\": An array of 2-3 specific correction recommendations."
            )
            
            # Groq multimodal call using llama-3.2-11b-vision-preview (or other configured vision model)
            chat_completion = client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": scan_prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": image_base64,
                                },
                            },
                        ],
                    }
                ],
                model=settings.GROQ_VISION_MODEL,
                response_format={"type": "json_object"}
            )
            
            resp_text = chat_completion.choices[0].message.content.strip()
            parsed_data = json.loads(resp_text)
            ai_msg_text = parsed_data.get('analysis_text', '')
            ai_insight = {
                'joint_angles': parsed_data.get('joint_angles', {}),
                'posture_check': parsed_data.get('posture_check', 'Safe'),
                'suggestions': parsed_data.get('suggestions', [])
            }
            return ai_msg_text, ai_insight
        except Exception as img_err:
            print(f"Error parsing image form check via Groq: {img_err}")
            # Fallback to standard chat response below if parsing fails

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_instruction
                },
                {
                    "role": "user",
                    "content": user_message
                }
            ],
            model=settings.GROQ_TEXT_MODEL
        )
        return chat_completion.choices[0].message.content, None
    except Exception as e:
        print(f"Groq API Chat Error: {e}")
        return "System error: Unable to connect to the central AI core. Try again later.", None

def generate_body_insight(user, weight, body_fat, muscle_mass):
    client = get_groq_client()
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
        response = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model=settings.GROQ_TEXT_MODEL
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq Body Insight Error: {e}")
        return "METABOLIC DATA RECEIVED. AWAITING FURTHER CALIBRATION."

def generate_nutrition_insight(user, protein, carbs, fats, kcal_consumed, kcal_target):
    client = get_groq_client()
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
        response = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model=settings.GROQ_TEXT_MODEL
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Groq Nutrition Insight Error: {e}")
        return "FUEL LEVELS RECORDED. MAINTAIN OPTIMAL INTAKE FOR PEAK PERFORMANCE."
