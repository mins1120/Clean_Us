from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import UserUpdateForm
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from user.models import User
from django.http import HttpResponse

@login_required
def mypage_view(request):
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return redirect('user:mypage_success')
    else:
        form = UserUpdateForm(instance=request.user)
    return render(request, 'user/mypage.html', {'form': form})

@login_required
def mypage_success_view(request):
    return render(request, 'user/mypage_success.html')

def user_home(request):
    return render(request, 'user/home.html')

class CustomPasswordChangeView(PasswordChangeView):
    template_name = 'user/change_password.html'
    success_url = reverse_lazy('password_change_done')

MAX_LOGIN_ATTEMPTS = 5  # 최대 로그인 실패 횟수

def Login(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            messages.error(request, '존재하지 않는 이메일입니다.')
            return redirect('main')  # 실패해도 메인화면으로

        if user.is_locked:
            messages.error(request, '계정이 잠겼습니다. 관리자에게 문의하세요.')
            return redirect('main')

        # username 대신 user.username을 사용 (Django 기본 auth는 username을 사용함)
        user_auth = authenticate(request, username=user.username, password=password)

        if user_auth is not None:
            login(request, user_auth)
            user.failed_attempts = 0
            user.save()
            print("로그인 성공")
            return HttpResponse("로그인 성공 페이지 (임시)") # 메인 페이지 완성 시 수정해야함
        else:
            user.failed_attempts += 1
            if user.failed_attempts >= MAX_LOGIN_ATTEMPTS:
                user.lock_account()
                messages.error(request, '계정이 잠겼습니다.')
            else:
                user.save()
                messages.error(request, f'비밀번호가 틀렸습니다. ({user.failed_attempts}회 실패)')
            return redirect('main')

    return render(request, 'user/user_login.html')  # GET 요청 시 로그인 폼 보여주기

def Logout(request):
    logout(request)
    return redirect('main')