from django.shortcuts import render
from .models import Comment
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .ai_utils import check_offensive

def comment_list_view(request):
    comments = Comment.objects.all().order_by('-created_at')
    return render(request, 'comment/comment_list.html', {'comments': comments})

# Create your views here.

@csrf_exempt
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
        })
    
def offensive_comment_page(request):
    comments = Comment.objects.filter(is_offensive=True).order_by('-created_at')
    return render(request, 'comment/offensive_list.html', {'comments': comments})