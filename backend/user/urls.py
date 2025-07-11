from django.urls import path
from . import views

app_name = 'user'
urlpatterns = [
   path('verify-email/<uidb64>/<token>/', views.verify_email, name='verify_email'),
   path('signup/', views.api_signup_view, name='signup'),
   path('api/login/', views.api_login_view, name='api_login'),
   path('api/logout/', views.api_logout_view, name='api_logout'),
   path('api/mypage/detail/', views.api_mypage_detail, name='api_mypage_detail'),
   path('api/mypage/update/', views.api_mypage_update, name='api_mypage_update'),
   path('api/password/', views.change_password_api, name='api_change_password'),
   path('csrf/', views.csrf_token_view, name='csrf_token'),
   path('delete/', views.delete_account_view, name='delete_account'),
   # ✅ 비밀번호 재설정용 API 추가
   path('api/password-reset-request/', views.password_reset_request_view, name='password_reset_request'),
   path('api/password-reset-confirm/', views.password_reset_confirm_view, name='password_reset_confirm'),
]
