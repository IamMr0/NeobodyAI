from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ChatSession, ChatMessage
from rag.services import generate_chat_response

class ChatMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_text = request.data.get('message')
        session_id = request.data.get('session_id')
        image_base64 = request.data.get('image') # Base64 string for image attachment
        
        if not user_text:
            return Response({'error': 'Message is required'}, status=400)
            
        # Get or create session
        if session_id:
            try:
                session = ChatSession.objects.get(id=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                return Response({'error': 'Session not found'}, status=404)
        else:
            session = ChatSession.objects.create(user=request.user, topic=user_text[:50])
            
        # Save user message (including image if uploaded)
        user_insight = None
        if image_base64:
            user_insight = {'image': image_base64}

        ChatMessage.objects.create(
            session=session,
            sender='user',
            message=user_text,
            insight_data=user_insight
        )
        
        # Call RAG / Gemini with optional image
        ai_response_text, ai_insight = generate_chat_response(
            request.user, user_text, session, image_base64=image_base64
        )
        
        # Save AI message with biomechanical analysis insights
        ai_msg = ChatMessage.objects.create(
            session=session,
            sender='ai',
            message=ai_response_text,
            insight_data=ai_insight
        )
        
        return Response({
            'session_id': session.id,
            'message': ai_msg.message,
            'timestamp': ai_msg.timestamp,
            'insight_data': ai_msg.insight_data
        })

class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request, session_id):
        try:
            session = ChatSession.objects.get(id=session_id, user=request.user)
            messages = session.messages.all().order_by('timestamp')
            data = [{
                'id': m.id,
                'sender': m.sender,
                'message': m.message,
                'timestamp': m.timestamp,
                'insight_data': m.insight_data
            } for m in messages]
            return Response(data)
        except ChatSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=404)

class ChatSessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        sessions = ChatSession.objects.filter(user=request.user).order_by('-start_time')
        data = [{
            'id': s.id,
            'start_time': s.start_time,
            'topic': s.topic
        } for s in sessions]
        return Response(data)
