from django.urls import path
from . import views

urlpatterns = [
    path('list/', views.comment_list_view, name='comment_list'),
    path('offensive-page/', views.offensive_comment_page, name='offensive_comment_page'),
    path('realtime-filtered-comments/', views.get_recent_filtered_comments, name='recent_filtered_comments'),
]