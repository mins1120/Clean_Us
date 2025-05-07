"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),
    path('user/', include(('user.urls', 'user'), namespace='user')),  # ✅ 네임스페이스 등록
    path('preference/', include('preference.urls')),
    path('comment/', include('comment.urls')),
    # 루트(/) 요청 오면 user 앱의 로그인 페이지나 다른 페이지로 리디렉트
     path('', lambda request: redirect('user:main')),  # ✅ 네임스페이스 기반 리디렉트
]
