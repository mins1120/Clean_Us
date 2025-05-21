from django.shortcuts import render
from .models import Comment
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .ai_utils import check_offensive
from django.views.decorators.http import require_GET

@require_GET
def comment_list_view(request):
    comments = Comment.objects.all().order_by('-created_at')
    comment_data = [
        {
            'id': c.id,
            'author': c.author.username if c.author else None,
            'content': c.content,
            'is_offensive': c.is_offensive,
            'offensive_keyword': c.offensive_reason,
            'created_at': c.created_at.strftime('%Y-%m-%d %H:%M')
        }
        for c in comments
    ]
    return JsonResponse({'comments': comment_data}, status=200)
# Create your views here.

""" @csrf_exempt
def create_comment(request):
    if request.method == 'POST':
        content = request.POST.get("content")
        user = request.user  # 로그인 기반이라면, 아니면 따로 author_id 받기
        is_bad, keyword = check_offensive(content)

        Comment.objects.create(
            author=user,
            content=content,
            is_offensive=is_bad,
            offensive_keyword=keyword
        )

        return JsonResponse({
            'result': 'ok',
            'is_offensive': is_bad,
            'keyword': keyword
        }) """
    
@require_GET
def offensive_comment_page(request):
    comments = Comment.objects.filter(is_offensive=True).order_by('-created_at')
    data = [
        {
            'id': c.id,
            'author': c.author.username if c.author else None,
            'content': c.content,
            'offensive_keyword': c.offensive_reason,
            'created_at': c.created_at.strftime('%Y-%m-%d %H:%M')
        }
        for c in comments
    ]
    return JsonResponse({'offensive_comments': data}, status=200)