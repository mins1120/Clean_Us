from django.shortcuts import render
from .models import Comment
from django.http import JsonResponse
from .ai_utils import check_offensive
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import FilteredCommentSerializer
import random
from preference.models import UserFeedback

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

# 🔹 최근 정상 댓글 조회 (최근 20개)
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_restore_comment(request, comment_id):
    user = request.user
    reason = request.data.get("reason", "").strip()

    try:
        # 🔑 여기 수정됨 (user → user_id)
        comment = Comment.objects.get(id=comment_id, is_offensive=True, user_id=user)
    except Comment.DoesNotExist:
        return Response({"error": "해당 악성 댓글이 없습니다."}, status=404)

    # 상태 변경 (악성 → 정상)
    comment.is_offensive = False
    comment.save()

    # 피드백 기록
    UserFeedback.objects.create(
        comment=comment,
        user=user,
        result=2,   # 복원 요청
        reason=reason
    )

    return Response({
        "detail": "댓글이 정상으로 복원되었습니다.",
        "reason": reason if reason else "사유 없음"
    }, status=200)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_report_offensive(request, comment_id):
    """
    POST /comment/report/<comment_id>/
    요청: { "reason": "욕설이 심합니다." }
    동작:
      - Comment.is_offensive = True 로 변경
      - UserFeedback 에 신고 기록 저장
    """
    user = request.user
    reason = request.data.get("reason", "").strip()

    try:
        # 정상 댓글만 신고 가능
        comment = Comment.objects.get(id=comment_id, is_offensive=False, user_id=user)
    except Comment.DoesNotExist:
        return Response({"error": "해당 정상 댓글을 찾을 수 없습니다."}, status=404)

    # 상태 변경 (정상 → 악성)
    comment.is_offensive = True
    comment.offensive_reason = "사용자 피드백"
    comment.save()

    # 피드백 기록 (악성 신고 요청)
    UserFeedback.objects.create(
        comment=comment,
        user=user,
        result=1,   # 1 = 악성댓글 삭제 요청
        reason=reason
    )

    return Response({
        "detail": "댓글이 악성으로 신고되었습니다.",
        "reason": reason if reason else "사유 없음"
    }, status=200)