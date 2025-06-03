from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, JsonResponse
from django.shortcuts import redirect
from .forms import UserUpdateForm
from django.contrib.auth import authenticate, login, logout, get_user_model, update_session_auth_hash
from .models import User
from django.conf import settings
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
import json
from django.middleware.csrf import get_token
from django.views.decorators.http import require_POST
from django.contrib.auth.forms import PasswordChangeForm
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.urls import reverse
from comment.models import Comment



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_api(request):
    form = PasswordChangeForm(user=request.user, data=request.data)
    if form.is_valid():
        user = form.save()
        update_session_auth_hash(request, user) # 비밀번호 바꿔도 세션 유지
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

MAX_LOGIN_ATTEMPTS = 5 # 최대 로그인 실패 횟수

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
            print("📧 이메일 전송 완료")
            return JsonResponse({'message': '회원가입 성공. 이메일 인증 필요.'}, status=201)

        except Exception as e:
            import traceback
            print("❌ 회원가입 전체 에러 발생:")
            traceback.print_exc()
            return JsonResponse({'error': '회원가입 처리 중 오류 발생'}, status=500)

    return JsonResponse({'error': 'POST 요청만 허용됩니다.'}, status=405)

@csrf_exempt
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
        logout(request)
        request.session.modified = False

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
    return Response({
        'email': None,
        'name': None
    })

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
    logout(request)  # 로그아웃 먼저
    user.delete()    # 유저 삭제
    return JsonResponse({'message': '회원 탈퇴가 완료되었습니다.'}, status=200)

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
