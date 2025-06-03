from django.shortcuts import render
from .models import Comment
from django.http import JsonResponse
from .ai_utils import check_offensive
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required
from .serializers import FilteredCommentSerializer

# 🔹 댓글 전체 조회 (일반 JSON)
@require_GET
@login_required
def comment_list_view(request):
    comments = Comment.objects.filter(user_id=request.user).order_by('-created_at')
    comment_data = [
        {
            'id': c.id,
            'content': c.content,
            'is_offensive': c.is_offensive,
            'offensive_keyword': c.offensive_reason,
            'created_at': c.created_at.strftime('%Y-%m-%d %H:%M')
        }
        for c in comments
    ]
    return JsonResponse({'comments': comment_data}, status=200)

# 🔹 악성 댓글 페이지용 조회
@require_GET
@login_required
def offensive_comment_page(request):
    comments = Comment.objects.filter(is_offensive=True, user_id=request.user).order_by('-created_at')
    data = [
        {
            'id': c.id,
            'content': c.content,
            'offensive_keyword': c.offensive_reason,
            'created_at': c.created_at.strftime('%Y-%m-%d %H:%M')
        }
        for c in comments
    ]
    return JsonResponse({'offensive_comments': data}, status=200)

# 🔹 리액트 연동용 최근 정상 댓글 API (DRF)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recent_filtered_comments(request):
    comments = Comment.objects.filter(
        is_offensive=False,
        user_id=request.user
    ).order_by('-created_at')[:20]

    serializer = FilteredCommentSerializer(comments, many=True)
    return Response(serializer.data)