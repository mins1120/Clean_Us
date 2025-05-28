from django.urls import path
from . import views

app_name = 'comment'
urlpatterns = [
    #path('youtube-comment/', views.fetch_youtube_comments, name='youtube_comment'),
    path('list/', views.comment_list_view, name='comment_list'),
    path('offensive-page/', views.offensive_comment_page, name='offensive_comment_page'),
    #path('create/', views.create_comment, name='create_comment'),  # 댓글 저장용 (POST)
    path('realtime-filtered-comments/', views.get_recent_filtered_comments, name='get_recent_filtered_comments'),
]