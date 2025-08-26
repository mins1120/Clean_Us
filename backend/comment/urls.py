from django.urls import path
from . import views
from .views import user_restore_comment, user_report_offensive

urlpatterns = [
    path('list/', views.comment_list_view, name='comment_list'),
    path('offensive-page/', views.offensive_comment_page, name='offensive_comment_page'),
    path('realtime-filtered-comments/', views.get_recent_filtered_comments, name='recent_filtered_comments'),
    path('restore/<int:comment_id>/', user_restore_comment, name='user_restore_comment'),
    path('report/<int:comment_id>/', user_report_offensive, name='user_report_offensive'),

    # 🔹 새로 추가된 AI 분석 API
    path('analyze/', views.analyze_comment, name='analyze_comment'),
]
