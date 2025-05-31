from django.shortcuts import render
# Create your views here.
from .models import Comment
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .ai_utils import check_offensive
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view
from django.contrib.auth.decorators import login_required
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .serializers import FilteredCommentSerializer

@require_GET
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



@api_view(['GET'])
@login_required
def get_recent_filtered_comments(request):
    comments = Comment.objects.filter(
        is_offensive=False,
        user_id=request.user
    ).order_by('-created_at')[:20]  # 최신 20개까지만

    serializer = FilteredCommentSerializer(comments, many=True)
    return Response(serializer.data) # REACT에 데이터 보내는 코드
    # return render(request, 'comment/recent_filtered_comments.html', { # Django에서 테스트하려면 이거 주석 풀고 하기
    #     'comments': serializer.data 
    # })


