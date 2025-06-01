from django.urls import path
from . import views
#rom .views import fetch_youtube_comments, comment_list_view 병재코드, 아것도 오류있어서 안됨

app_name = 'comment'

urlpatterns = [
    #path('youtube-comment/', fetch_youtube_comments, name='youtube_comment'), 병재 코드
    #path('list/', comment_list_view, name='comment_list'), 병재 코드
    path('list/', views.comment_list_view, name='comment_list'),# 05-26 병재께 안돼서 내가 수정한 코드
    path('offensive-page/', views.offensive_comment_page, name='offensive_comment_page'),
    #path('create/', views.create_comment, name='create_comment'),  # 댓글 저장용 (POST)
    path('realtime-filtered-comments/', views.get_recent_filtered_comments, name='get_recent_filtered_comments'),
]
