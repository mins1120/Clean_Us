from django.urls import path
from . import views
from .views import fetch_youtube_comments

app_name = 'comment'
urlpatterns = [
    path('youtube-comment/', fetch_youtube_comments, name='youtube_comment'),

]