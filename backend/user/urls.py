from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'user'
urlpatterns = [
   path('login/', views.Login, name='login'),  # 너가 만든 커스텀 로그인 뷰
   path('logout/', views.Logout, name='logout'),
   path('mypage/', views.mypage_view, name='mypage'),
   path('success/', views.mypage_success_view, name='mypage_success'),
   path('password/', views.CustomPasswordChangeView.as_view(), name='password_change'),
   path('password/done/', auth_views.PasswordChangeDoneView.as_view(
       template_name='mypage1/change_password_done.html'
   ), name='password_change_done'),
   path('user/home/', views.user_home, name='user_home'),
   path('verify-email/<uidb64>/<token>/', views.verify_email, name='verify_email'),
   path('signup/', views.signup_view, name='signup'),
   path('api/login/', views.api_login_view, name='api_login'),
   path('api/logout/', views.api_logout_view, name='api_logout'),
   path('delete/', views.delete_account_view, name='delete_account'),
]