from django.urls import path
from . import views
from .views import feedback_restore_comment

app_name = 'preference'
urlpatterns = [
    path('keywords/', views.keyword_list_or_delete, name='keyword-list-or-delete'),
    path('keywords/add/', views.keyword_create, name='keyword-create'),
    path('csrf/', views.csrf, name='csrf-cookie'),
    path('feedbacks/', views.user_feedback_list_or_delete, name='user-feedback-list-or-delete'),
    path('feedbacks/restore/', feedback_restore_comment, name='feedback_restore_comment'),
]
