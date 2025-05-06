from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # 기본 사용자 모델에는 username, password, email, first_name, last_name 등 기본적인 필드들이 포함.
    # username은 식별자
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 
    email = models.EmailField(unique=True)  # 이메일 중복 불가 설정
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',  # related_name 변경
        blank=True,
        help_text=('The groups this user belongs to. A user will get all permissions '
                   'granted to each of their groups.'),
        verbose_name=('groups'),
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',  # related_name 변경
        blank=True,
        help_text=('Specific permissions for this user.'),
        verbose_name=('user permissions'),
    )

    failed_attempts = models.IntegerField(default=0)  # 로그인 실패 횟수 저장
    is_locked = models.BooleanField(default=False)    # 계정 잠김 여부
    is_active = models.BooleanField(default=False)    # 인증 전까지 비활성 상태

    def lock_account(self): 
        self.is_locked = True
        self.save()


# Create your models here.
