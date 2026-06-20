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
            
        # Save user message
        ChatMessage.objects.create(
            session=session,
            sender='user',
            message=user_text
        )
        
        # Call RAG / Gemini
        ai_response_text = generate_chat_response(request.user, user_text, session)
        
        # Save AI message
        ai_msg = ChatMessage.objects.create(
            session=session,
            sender='ai',
            message=ai_response_text
        )
        
        return Response({
            'session_id': session.id,
            'message': ai_msg.message,
            'timestamp': ai_msg.timestamp
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
                'timestamp': m.timestamp
            } for m in messages]
            return Response(data)
        except ChatSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=404)
