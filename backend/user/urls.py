from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

app_name = 'user'
urlpatterns = [
   path('login/', views.Login, name='login'),
   path('logout/', views.Logout, name='logout'),
   path('mypage/', views.mypage_view, name='mypage'),
   path('success/', views.mypage_success_view, name='mypage_success'),
   path('password/', views.CustomPasswordChangeView.as_view(), name='password_change'),
   path('password/done/', auth_views.PasswordChangeDoneView.as_view(
   template_name='mypage1/change_password_done.html'
   ), name='password_change_done'),
   path('user/home/', views.user_home, name='user_home'),
]