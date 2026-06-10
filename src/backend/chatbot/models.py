from django.db import models
from django.conf import settings

class ChatSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chat_sessions')
    start_time = models.DateTimeField(auto_now_add=True)
    topic = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Session {self.id} - {self.user.username}"

class ChatMessage(models.Model):
    SENDER_CHOICES = (
        ('user', 'User'),
        ('ai', 'AI'),
    )
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    insight_data = models.JSONField(blank=True, null=True)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        return f"{self.sender} at {self.timestamp}"
