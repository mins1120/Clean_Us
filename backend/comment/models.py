from django.db import models
from django.conf import settings

class Comment(models.Model):
    content = models.TextField()
    user_id = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField()
    is_offensive = models.BooleanField(default=False)
    offensive_reason = models.CharField(max_length=100, blank=True, null=True)
    user_offensive_reason = models.TextField(blank=True, null=True)  # 사용자 입력 추가 ← 요거 추가! #이지형
    