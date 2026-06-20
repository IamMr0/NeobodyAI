from django.urls import path
from .views import ChatMessageView, ChatHistoryView

urlpatterns = [
    path('message/', ChatMessageView.as_view(), name='chat-message'),
    path('history/<int:session_id>/', ChatHistoryView.as_view(), name='chat-history'),
]
