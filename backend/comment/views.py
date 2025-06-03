from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from .models import Comment

# 공통 직렬화 함수
def serialize_comment(comment):
    return {
        'id': comment.id,
        'author': comment.author.username if comment.author else None,
        'content': comment.content,
        'is_offensive': comment.is_offensive,
        'offensive_keyword': comment.offensive_reason,
        'created_at': comment.created_at.strftime('%Y-%m-%d %H:%M'),
    }

# 댓글 목록 조회만 (생성 없음)
@require_http_methods(["GET"])
def comment_list_view(request):
    comments = Comment.objects.all().order_by('-created_at')
    data = [serialize_comment(c) for c in comments]
    return JsonResponse({'comments': data}, status=200)

# 악성 댓글 목록 조회
@require_http_methods(["GET"])
def offensive_comment_list_view(request):
    comments = Comment.objects.filter(is_offensive=True).order_by('-created_at')
    data = [serialize_comment(c) for c in comments]
    return JsonResponse({'offensive_comments': data}, status=200)