from django.urls import path
from . import views
from .views import comment_list_view

app_name = 'comment'
urlpatterns = [
    path('list/', comment_list_view, name='comment_list'),
    path('offensive-page/', views.offensive_comment_page, name='offensive_comment_page'),
    path('create/', views.create_comment, name='create_comment'),  # 댓글 저장용 (POST)

]