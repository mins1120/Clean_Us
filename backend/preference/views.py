from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import KeywordPreference, UserFeedback
from .serializers import KeywordPreferenceSerializer, UserFeedbackSerializer
from comment.models import Comment

User = get_user_model()
### 로그인 이후 해야할 것들
# - @csrf_exempt
# - @permission_classes([AllowAny])
# + @permission_classes([IsAuthenticated])

@ensure_csrf_cookie
@api_view(['GET'])
@permission_classes([AllowAny]) # 로그인 기능 이후 IsAuthenticated로 변경
def csrf(request):
    """
    React 앱에서 CSRF 토큰을 쿠키로 발급받기 위한 엔드포인트.
    """
    return Response({'detail': 'CSRF cookie set'})


@csrf_exempt # 로그인 기능 이후 삭제
@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny]) # 로그인 기능 이후 IsAuthenticated로 변경
def keyword_list_or_delete(request):
    """
    GET  /preference/keywords/       → 사용자(또는 테스트유저)의 키워드 목록 반환
    DELETE /preference/keywords/     → { id } 로 전달된 키워드 삭제
    """
    # 인증된 유저가 아니면 첫 번째 User를 테스트용으로 사용
    user = request.user if request.user.is_authenticated else User.objects.first()

    if request.method == 'GET':
        qs = KeywordPreference.objects.filter(user=user)
        serializer = KeywordPreferenceSerializer(qs, many=True)
        return Response(serializer.data)

    # DELETE
    keyword_id = request.data.get('id')
    try:
        obj = KeywordPreference.objects.get(id=keyword_id, user=user)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except KeywordPreference.DoesNotExist:
        return Response({'error': 'Keyword not found'}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt # 로그인 기능 이후 삭제
@api_view(['POST'])
@permission_classes([AllowAny]) # 로그인 기능 이후 IsAuthenticated로 변경
def keyword_create(request):
    """
    POST /preference/keywords/add/  → { keyword, sensitive } 로 새로운 키워드 생성
    """
    # 인증된 유저가 아니면 첫 번째 User를 테스트용으로 사용
    user = request.user if request.user.is_authenticated else User.objects.first()

    serializer = KeywordPreferenceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny])  # → 나중에 IsAuthenticated 로 변경
def user_feedback_list_or_delete(request):
    """
    GET    /preference/feedbacks/  → 내(또는 테스트) 피드백 목록 조회
      - 로그인된 user가 없으면 첫 번째 User를 대신 사용 (개발용)
      - 시간 내림차순(submitted_at) 정렬

    DELETE /preference/feedbacks/  → { id } 로 전달된 피드백 삭제
      1) UserFeedback 레코드를 조회·삭제
      2) 삭제하는 피드백의 'result' 값에 따라 원본 Comment.is_filtered 상태 복구
         - result == 1 (차단 요청 철회) → is_filtered = False
         - result == 2 (복원 요청 철회) → is_filtered = True
    """
    # 1) 개발 중 테스트용 user 지정
    user = request.user if request.user.is_authenticated else User.objects.first()

    # 2) GET → 목록 반환
    if request.method == 'GET':
        feedback_qs = UserFeedback.objects.filter(user=user).order_by('-submitted_at')
        serializer  = UserFeedbackSerializer(feedback_qs, many=True)
        return Response(serializer.data)

    # 3) DELETE → 피드백 삭제 + 댓글 상태 복구
    feedback_id = request.data.get('id')
    try:
        fb = UserFeedback.objects.get(id=feedback_id, user=user)

        # 3a) 원본 Comment 상태 복구
        comment = fb.comment
        if fb.result == 1:
            # ‘악성 댓글 차단 요청’ 철회 → 댓글 정상화
            comment.is_offensive = False
        elif fb.result == 2:
            # ‘차단 복원 요청’ 철회 → 댓글 다시 차단
            comment.is_offensive = True
        comment.save()

        # 3b) 피드백 레코드 삭제
        fb.delete()
        return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)

    except UserFeedback.DoesNotExist:
        return Response({'error': 'Feedback not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # 로그인한 사용자만 가능
def feedback_restore_comment(request):
    """
    POST /preference/feedbacks/restore/
    → 악성 댓글을 정상 댓글로 표시하고 사용자 피드백(reason) 저장

    요청 JSON 예시:
    {
        "comment_id": 123,
        "reason": "욕설이 아니라 친구끼리 쓰는 농담입니다."
    }
    """
    user = request.user

    comment_id = request.data.get('comment_id')
    reason = request.data.get('reason', '').strip()

    # comment_id가 없을 경우
    if not comment_id:
        return Response({"error": "comment_id가 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)

    # 댓글이 존재하고 악성으로 표시된 경우만 처리
    try:
        comment = Comment.objects.get(id=comment_id, is_offensive=True)
    except Comment.DoesNotExist:
        return Response({"error": "해당 악성 댓글을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND)

    # 이미 복원 피드백 기록이 있다면 중복 저장 방지
    if UserFeedback.objects.filter(comment=comment, user=user).exists():
        return Response({"detail": "이미 이 댓글에 대해 피드백을 제출하셨습니다."}, status=status.HTTP_409_CONFLICT)

    # 댓글을 정상으로 복원
    comment.is_offensive = False
    comment.save()

    # 피드백 레코드 생성 (reason만 저장, result는 보류)
    UserFeedback.objects.create(
        comment=comment,
        user=user,
        reason=reason  # ✅ 사용자가 입력한 사유 저장
    )

    return Response({
        "detail": "댓글이 정상으로 복구되었고, 피드백이 저장되었습니다.",
        "reason": reason if reason else "사유 없음"
    }, status=status.HTTP_200_OK)