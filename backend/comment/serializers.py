from .models import Comment
from rest_framework import serializers

class FilteredCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [
            'id', 'content', 'is_offensive',
            'offensive_reason', 'user_offensive_reason',  # ✅ 문자열 오류 수정됨
            'created_at', 'updated_at'
        ]