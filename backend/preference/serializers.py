from rest_framework import serializers
from .models import KeywordPreference, UserFeedback

class KeywordPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = KeywordPreference
        fields = ['id', 'keyword', 'sensitive', 'created_at']

class UserFeedbackSerializer(serializers.ModelSerializer):
    comment_content = serializers.CharField(source='comment.content', read_only=True)

    class Meta:
        model = UserFeedback
        fields = ['id', 'comment', 'comment_content', 'result', 'submitted_at', 'reason']