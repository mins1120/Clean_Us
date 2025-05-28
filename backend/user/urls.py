from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'user'
urlpatterns = [
   path('login/', views.Login, name='login'),  # 너가 만든 커스텀 로그인 뷰
   path('logout/', views.Logout, name='logout'),
   path('api/mypage/', views.mypage_view, name='api_mypage'),
   path('api/password/', views.change_password_api, name='api_change_password'),
   path('user/home/', views.user_home, name='user_home'),
   path('verify-email/<uidb64>/<token>/', views.verify_email, name='verify_email'),
   path('test_signup/', views.test_signup_view, name='test_signup'),
   path('signup/', views.signup_view, name='signup'),
   path('api/login/', views.api_login_view, name='api_login'),
   path('api/logout/', views.api_logout_view, name='api_logout'),
   path('delete/', views.delete_account_view, name='delete_account'),
]