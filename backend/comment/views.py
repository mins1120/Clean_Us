from django.shortcuts import render
from comment.models import Comment
from django.http import JsonResponse
from .ai_utils import check_offensive
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import FilteredCommentSerializer
from rest_framework import status
from .models import Comment

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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_user_offensive_reason(request, comment_id):
    try:
        comment = Comment.objects.get(id=comment_id, user_id=request.user)
        reason = request.data.get('user_offensive_reason', '')
        comment.user_offensive_reason = reason
        comment.save()
        return Response({'message': '사용자 의견이 저장되었습니다.'}, status=200)
    except Comment.DoesNotExist:
        return Response({'error': '댓글을 찾을 수 없습니다.'}, status=404)