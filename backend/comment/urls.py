from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.comment_list_view, name='comment_list'),
    path('offensive-page/', views.offensive_comment_page, name='offensive_comment_page'),
    path('realtime-filtered-comments/', views.get_recent_filtered_comments, name='recent_filtered_comments'),
    path('user-reason/<int:comment_id>/', views.set_user_offensive_reason, name='set_user_offensive_reason'),  # ← 추가
]