from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView  # ✅ 추가됨
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
@permission_classes([AllowAny])  # 로그인 기능 이후 IsAuthenticated로 변경
def csrf(request):
    """React 앱에서 CSRF 토큰을 쿠키로 발급받기 위한 엔드포인트."""
    return Response({'detail': 'CSRF cookie set'})


@csrf_exempt
@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny])
def keyword_list_or_delete(request):
    """GET/DELETE 키워드 관리"""
    user = request.user if request.user.is_authenticated else User.objects.first()
    if request.method == 'GET':
        qs = KeywordPreference.objects.filter(user=user)
        serializer = KeywordPreferenceSerializer(qs, many=True)
        return Response(serializer.data)

    keyword_id = request.data.get('id')
    try:
        obj = KeywordPreference.objects.get(id=keyword_id, user=user)
        obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except KeywordPreference.DoesNotExist:
        return Response({'error': 'Keyword not found'}, status=status.HTTP_404_NOT_FOUND)


@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def keyword_create(request):
    """POST /preference/keywords/add/ → 키워드 추가"""
    user = request.user if request.user.is_authenticated else User.objects.first()
    serializer = KeywordPreferenceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'DELETE'])
@permission_classes([AllowAny])
def user_feedback_list_or_delete(request):
    """사용자 피드백 조회/삭제"""
    user = request.user if request.user.is_authenticated else User.objects.first()

    if request.method == 'GET':
        feedback_qs = UserFeedback.objects.filter(user=user).order_by('-submitted_at')
        serializer = UserFeedbackSerializer(feedback_qs, many=True)
        return Response(serializer.data)

    feedback_id = request.data.get('id')
    try:
        fb = UserFeedback.objects.get(id=feedback_id, user=user)
        comment = fb.comment
        if fb.result == 1:
            comment.is_offensive = False
        elif fb.result == 2:
            comment.is_offensive = True
        comment.save()
        fb.delete()
        return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)
    except UserFeedback.DoesNotExist:
        return Response({'error': 'Feedback not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def feedback_restore_comment(request):
    """악성 댓글 복원 + 피드백 저장"""
    user = request.user
    comment_id = request.data.get('comment_id')
    reason = request.data.get('reason', '').strip()

    if not comment_id:
        return Response({"error": "comment_id가 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        comment = Comment.objects.get(id=comment_id, is_offensive=True)
    except Comment.DoesNotExist:
        return Response({"error": "해당 악성 댓글을 찾을 수 없습니다."}, status=status.HTTP_404_NOT_FOUND)

    if UserFeedback.objects.filter(comment=comment, user=user).exists():
        return Response({"detail": "이미 이 댓글에 대해 피드백을 제출하셨습니다."}, status=status.HTTP_409_CONFLICT)

    comment.is_offensive = False
    comment.save()

    UserFeedback.objects.create(
        comment=comment,
        user=user,
        reason=reason
    )

    return Response({
        "detail": "댓글이 정상으로 복구되었고, 피드백이 저장되었습니다.",
        "reason": reason if reason else "사유 없음"
    }, status=status.HTTP_200_OK)


# ✅ -------------------------------
# ✅ AI 모델 예측 API 추가
# ✅ -------------------------------
class PredictAPIView(APIView):
    """
    POST /preference/predict/
    body 예시:
    {
      "text": "이건 예시 문장입니다.",
      "sensitivity": 2,
      "blocked_keywords": ["병신"]
    }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        text = request.data.get("text", "")
        if not text:
            return Response({"error": "text 필드는 필수입니다."}, status=status.HTTP_400_BAD_REQUEST)

        sensitivity = request.data.get("sensitivity", 2)
        blocked_keywords = request.data.get("blocked_keywords", None)

        from .services.ai_service import predict
        try:
            result = predict(text=text, sensitivity=sensitivity, blocked_keywords=blocked_keywords)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
