from django.shortcuts import render
from comment.models import Comment
from django.http import JsonResponse
from .ai_utils import check_offensive
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import FilteredCommentSerializer
import random

# 🔹 전체 댓글 조회 (Serializer 사용)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def comment_list_view(request):
    comments = Comment.objects.filter(user_id=request.user).order_by('-created_at')
    serializer = FilteredCommentSerializer(comments, many=True)
    return Response({'comments': serializer.data}, status=200)

# 🔹 악성 댓글만 조회 (Serializer 사용)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def offensive_comment_page(request):
    comments = Comment.objects.filter(is_offensive=True, user_id=request.user).order_by('-created_at')
    serializer = FilteredCommentSerializer(comments, many=True)
    return Response({'offensive_comments': serializer.data}, status=200)

# 🔹 최근 정상 댓글 조회 (Serializer 사용, 최근 20개)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_filtered_comments(request):
    comments = Comment.objects.filter(
        is_offensive=False,
        user_id=request.user
    ).order_by('-created_at')[:20]
    
    serializer = FilteredCommentSerializer(comments, many=True)
    return Response(serializer.data)

# 🔹 AI Mock API: 입력된 텍스트 분석
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def analyze_comment(request):
    text = request.data.get("text", "")
    if not text:
        return Response({"error": "text field is required"}, status=400)

    # ai_utils.py 함수 사용
    is_offensive, reason = check_offensive(text)

    # confidence는 랜덤으로 (0.7~0.99)
    confidence = round(random.uniform(0.7, 0.99), 2)

    return Response({
        "is_offensive": is_offensive,
        "reason": reason if reason else None,
        "confidence": confidence
    }, status=200)
