from django.urls import path
from . import views

app_name = 'comment'
urlpatterns = [
    path('api/comments/', views.comment_list_view, name='comment_list'),
    path('api/comments/offensive/', views.offensive_comment_list_view, name='offensive_comment_list'),
]