from django.shortcuts import render
from .models import YoutubeComment
from .youtube_comments import get_youtube_comments
import os

API_KEY = os.getenv('YOUTUBE_API_KEY')
VIDEO_ID = os.getenv('YOUTUBE_VIDEO_ID')

def fetch_youtube_comments(request):
    comments = get_youtube_comments(VIDEO_ID, API_KEY)

    for c in comments:
        if not YoutubeComment.objects.filter(content=c['content'], author=c['author']).exists():
            YoutubeComment.objects.create(
                content=c['content'],
                author=c['author'],
                published_at=c['published_at'],
            )

    all_comments = YoutubeComment.objects.all().order_by('-published_at')
    return render(request, 'comment/youtube_comments.html', {'comments': all_comments})
