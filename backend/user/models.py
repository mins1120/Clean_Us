from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    name = models.CharField(max_length=100, blank=True, null=True)  # 추가

    # 기존 필드들 유지
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    email = models.EmailField(unique=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text=('The groups this user belongs to.'),
        verbose_name=('groups'),
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_permissions_set',
        blank=True,
        help_text=('Specific permissions for this user.'),
        verbose_name=('user permissions'),
    )
    
    failed_attempts = models.IntegerField(default=0)  # 로그인 실패 횟수 저장
    is_locked = models.BooleanField(default=False)    # 계정 잠김 여부

    def lock_account(self): 
        self.is_locked = True
        self.save()


# Create your models here.
