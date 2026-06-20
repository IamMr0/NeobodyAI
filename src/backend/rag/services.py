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

def generate_chat_response(user, user_message, session):
    client = get_gemini_client()
    system_instruction = build_context(user, session)
    
    try:
        full_prompt = f"System Instructions:\n{system_instruction}\n\nUser Message:\n{user_message}"
        response = client.models.generate_content(
            model='gemini-3.5-flash',
            contents=full_prompt
        )
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return "System error: Unable to connect to the central AI core. Try again later."

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
