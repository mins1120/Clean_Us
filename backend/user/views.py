from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import UserUpdateForm
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from user.models import User
from django.http import HttpResponse
from user.forms import CustomUserCreationForm  # 아까 만든 폼
from django.conf import settings
from django.core.mail import send_mail   #메일 전송
from django.utils.http import urlsafe_base64_encode   #사용자 ID를 URL-safe하게 인코딩
from django.utils.encoding import force_bytes   
from django.contrib.auth.tokens import default_token_generator   #인증 토큰 생성 & 검증
from django.urls import reverse    #인증 링크 생성용
from django.contrib.auth import get_user_model  # verify_email용
from django.utils.http import urlsafe_base64_decode



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
            return redirect('login')  # 에러시 login으로

        if user.is_locked:
            messages.error(request, '계정이 잠겼습니다. 관리자에게 문의하세요.')
            return redirect('main')
        
        if not user.is_active:
            messages.error(request, '이메일 인증이 완료되지 않았습니다.')
            return redirect('login')

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



def signup_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)       # 저장 전 유저 객체 생성
            user.is_active = False               # 이메일 인증 전까지 로그인 비활성화
            user.save()                          # 유저 저장
            send_verification_email(user, request)  #  이메일 인증 링크 전송
            return render(request, 'user/email_check_notice.html')  # 이메일 확인 안내 페이지
        else:
            return render(request, 'user/signup.html', {'form': form})
    else:
        form = CustomUserCreationForm()
        return render(request, 'user/signup.html', {'form': form})

    
    
def send_verification_email(user, request):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    verify_url = request.build_absolute_uri(
        reverse('user:verify_email', kwargs={'uidb64': uid, 'token': token})
    )

    subject = "CleanUs 회원가입 이메일 인증"
    message = (
        f"{user.username}님, CleanUs에 가입해주셔서 감사합니다.\n\n"
        f"아래 링크를 클릭하여 이메일 인증을 완료해주세요:\n\n"
        f"{verify_url}\n\n"
        f"해당 링크는 일정 시간 후 만료되니 빠르게 인증을 완료해주세요."
    )

    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[user.email],
        fail_silently=False,
    )

def verify_email(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = get_user_model().objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return HttpResponse("이메일 인증이 완료되었습니다. 로그인해주세요.")
    else:
        return HttpResponse("인증 링크가 유효하지 않거나 만료되었습니다.")
    

def test_email(request):
    send_mail(
        subject='[CleanUs] 이메일 테스트입니다.',
        message='이 메일은 SMTP 설정이 제대로 되었는지 확인하기 위한 테스트입니다.',
        from_email=settings.EMAIL_HOST_USER,  # settings의 DEFAULT_FROM_EMAIL 사용
        recipient_list=['peter8656@naver.com'],  # 너가 직접 받을 이메일로 바꾸기!
        fail_silently=False,
    )
    return HttpResponse("이메일 전송 완료!")



 

    

       