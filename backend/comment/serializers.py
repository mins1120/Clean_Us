from .models import Comment
from rest_framework import serializers

class FilteredCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'is_offensive', 'created_at', 'content', 'offensive_reason']
