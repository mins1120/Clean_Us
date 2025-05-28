from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .forms import UserUpdateForm, CustomUserCreationForm
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy, reverse 
from django.contrib.auth import authenticate, login, logout, get_user_model, update_session_auth_hash
from django.contrib import messages
from .models import User
from django.http import HttpResponse, JsonResponse 
from django.conf import settings
from django.core.mail import send_mail   #메일 전송
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode   #사용자 ID를 URL-safe하게 인코딩
from django.utils.encoding import force_bytes   
from django.contrib.auth.tokens import default_token_generator   #인증 토큰 생성 & 검증
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie, csrf_protect
import json
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.contrib.auth.forms import PasswordChangeForm
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@csrf_exempt 
@login_required
def mypage_view(request):
    if request.method == 'POST':
        form = UserUpdateForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            return JsonResponse({'message': '회원 정보가 성공적으로 수정되었습니다.'}, status=200)
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    else:
        # GET 요청 시 현재 사용자 정보 전달
        user = request.user
        return JsonResponse({
            'username': user.username,
            'email': user.email,
            'name': user.name,
        }, status=200)

@login_required
def mypage_success_view(request):
    return render(request, 'user/mypage_success.html')

def user_home(request):
    return render(request, 'user/home.html')


class CustomPasswordChangeView(PasswordChangeView):  # ✅ 사용자에게 보여줄 비밀번호 변경 HTML 템플릿 경로 지정
    template_name = 'user/change_password.html'
    #  비밀번호 변경 성공 후 이동할 URL (urls.py에서 이름 설정한 경로)
    success_url = reverse_lazy('password_change_done')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_api(request):
    form = PasswordChangeForm(user=request.user, data=request.data)
    if form.is_valid():
        user = form.save()
        update_session_auth_hash(request, user)  # 비밀번호 바꿔도 세션 유지
        return Response({'message': '비밀번호가 성공적으로 변경되었습니다.'}, status=200)
    else:
        return Response({'errors': form.errors}, status=400)

# 🔹 [PUT] 사용자 이름 수정 처리
@csrf_exempt
@login_required
def api_mypage_update(request):
    if request.method == 'PUT':
        try:
            data = json.loads(request.body)
            user = request.user
            user.username = data.get('name', user.username)
            user.save()
            return JsonResponse({'message': '정보 수정 완료'})
        except Exception as e:
            return JsonResponse({'error': '정보 수정 실패'}, status=500)

    return JsonResponse({'error': 'PUT 요청만 허용됩니다.'}, status=405)

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
            return JsonResponse({'message': '로그인 성공'}) # 메인 페이지 완성 시 수정해야함
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
    print(uid, token, verify_url, subject, message)

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
    

# def test_email(request):
#     send_mail(
#         subject='[CleanUs] 이메일 테스트입니다.',
#         message='이 메일은 SMTP 설정이 제대로 되었는지 확인하기 위한 테스트입니다.',
#         from_email=settings.EMAIL_HOST_USER,  # settings의 DEFAULT_FROM_EMAIL 사용
#         recipient_list=['peter8656@naver.com'],  # 너가 직접 받을 이메일로 바꾸기!
#         fail_silently=False,
#     )
#     return HttpResponse("이메일 전송 완료!")

@csrf_exempt
def api_signup_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            password = data.get('password')

            if not all([name, email, password]):
                return JsonResponse({'error': '누락된 필드가 있습니다.'}, status=400)

            if User.objects.filter(email=email).exists():
                return JsonResponse({'error': '이미 존재하는 이메일입니다.'}, status=400)

            user = User.objects.create_user(
                username=name,
                email=email,
                password=password,
                is_active=False
            )
            print("✅ 유저 생성됨:", user.email)

        
            send_verification_email(user, request)
            print("📧 이메일 전송 완료")  # ⭐️ 이게 안 뜨면 메일 문제!
            return JsonResponse({'message': '회원가입 성공. 이메일 인증 필요.'}, status=201)

        except Exception as e:
            import traceback
            print("❌ 회원가입 전체 에러 발생:")
            traceback.print_exc()
            return JsonResponse({'error': '회원가입 처리 중 오류 발생'}, status=500)

    return JsonResponse({'error': 'POST 요청만 허용됩니다.'}, status=405)


@csrf_exempt  # CSRF 검사 생략 (프론트에서 쿠키 기반 세션인증 시 필요)
def api_login_view(request):
    # [POST] 로그인 요청 처리
    if request.method == 'POST':
        try:
            # JSON 데이터 파싱
            data = json.loads(request.body)
            email = data.get('email')
            password = data.get('password')

            # 이메일로 사용자 조회
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return JsonResponse({'message': '존재하지 않는 이메일입니다.'}, status=400)

            # 계정이 잠겨있는 경우
            if user.is_locked:
                return JsonResponse({'message': '계정이 잠겼습니다. 관리자에게 문의하세요.'}, status=403)

            # 이메일 인증이 안 된 경우
            if not user.is_active:
                return JsonResponse({'message': '이메일 인증이 완료되지 않았습니다.'}, status=403)

            # username 기반으로 인증 시도
            user_auth = authenticate(request, username=user.username, password=password)

            if user_auth is not None:
                # 로그인 성공: 세션에 사용자 등록 + 실패 횟수 초기화
                login(request, user_auth)
                user.failed_attempts = 0
                user.save()
                #return redirect('user:mypage')  # ← 마이페이지로 리디렉션
                return JsonResponse({'message': '로그인 성공'}, status=200)
            else:
                # 로그인 실패: 실패 횟수 증가
                user.failed_attempts += 1
                if user.failed_attempts >= MAX_LOGIN_ATTEMPTS:
                    # 최대 실패 횟수 초과 → 계정 잠금
                    user.lock_account()
                    return JsonResponse({'message': '계정이 잠겼습니다.'}, status=403)
                else:
                    user.save()
                    return JsonResponse({'message': f'비밀번호가 틀렸습니다. ({user.failed_attempts}회 실패)'}, status=401)

        except Exception as e:
            # 서버 내부 오류 처리
            print('로그인 중 오류:', e)
            return JsonResponse({'message': '서버 오류'}, status=500)

    # POST가 아닌 경우 허용 안 함
    return JsonResponse({'message': 'POST 요청만 허용됩니다.'}, status=405)


@csrf_exempt
def api_logout_view(request):
    if request.method == 'POST':
        # 사용자 로그아웃 & 세션 비우기
        logout(request)           # 내부적으로 session.flush() 까지 해 줍니다
        request.session.modified = False  
        # → 이 한 줄이 없으면 Django가 새 세션 키를 만들어 쿠키를 재발행해 버립니다

        # 응답 생성 & 쿠키 삭제
        response = JsonResponse({'message': '로그아웃 성공'})
        # 호스트 전용 쿠키 삭제
        response.delete_cookie(settings.SESSION_COOKIE_NAME, path='/')
        response.delete_cookie(settings.SESSION_COOKIE_NAME, path='/', domain='localhost')
        response.delete_cookie(settings.CSRF_COOKIE_NAME,   path='/', domain='localhost')
        print("request.COOKIES:", request.COOKIES)
        print(response)
        return response

    return JsonResponse({'message': 'POST 요청만 허용됩니다.'}, status=405)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def api_mypage_detail(request):
    if request.user:
        user = request.user
        print(user.email, user.username)
        return Response({
        'email': user.email,
        'name': user.username
        })
    print('로그인 X ')
    return Response({
        'email': None,
        'name': None
    })

# ✅ [PUT] React에서 마이페이지 수정 요청 처리
@csrf_exempt
@login_required
def api_mypage_update(request):
    if request.method == 'PUT':
        try:
            # 요청 body에서 JSON 데이터 파싱
            data = json.loads(request.body)
            
            # 현재 로그인한 유저 가져오기
            user = request.user
            
            # username(이름)을 수정 (값이 없으면 기존 값 유지)
            user.username = data.get('name', user.username)
            
            # 수정된 정보 저장
            user.save()
            
            # 성공 응답 반환
            return JsonResponse({'message': '정보 수정 완료'})
        
        except Exception as e:
            # 에러 발생 시 500 응답
            return JsonResponse({'error': '정보 수정 실패'}, status=500)

    # PUT 이외의 요청은 허용하지 않음   
    return JsonResponse({'error': 'PUT 요청만 허용됩니다.'}, status=405)

#@ensure_csrf_cookie
#def csrf_token_view(request):
 #   return JsonResponse({'message': 'CSRF cookie set'})

# def csrf_token_view(request):
#     csrf_token = get_token(request)
#     print('📦 CSRF 토큰 (서버에서 발급):', csrf_token)

#     response = JsonResponse({
#         'message': 'CSRF 쿠키 설정 완료',
#         'csrftoken': csrf_token
#     })
#     print(response)
#     response.set_cookie(
#         'csrftoken',
#         csrf_token,
#         samesite='None',     
#         secure=False,       # HTTPS 쓸 땐 True
#         httponly=False      # JS에서 읽어야 하므로 False
#     )
#     print(response)

#     return response

@ensure_csrf_cookie
def csrf_token_view(request):
    csrf_token = get_token(request)
    print("📦 서버에서 발급된 CSRF:", csrf_token)
    
    request.session.accessed = False
    request.session.modified = False
    return JsonResponse({
        "message": "CSRF 쿠키 설정 완료"
    })



 
       
@require_POST
@login_required
def delete_account_view(request):
    user = request.user
    logout(request)        # 로그아웃 먼저
    user.delete()          # 유저 삭제
    return JsonResponse({'message': '회원 탈퇴가 완료되었습니다.'}, status=200)
