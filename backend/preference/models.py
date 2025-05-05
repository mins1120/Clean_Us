from django.db import models
from django.conf import settings

class KeywordPreference(models.Model):
    SENSITIVITY_LEVELS = (
        (1, '약한 필터링'),
        (2, '기본 필터링'),
        (3, '강한 필터링'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    keyword = models.CharField(max_length=100, db_index=True)
    sensitive = models.PositiveSmallIntegerField(choices=SENSITIVITY_LEVELS)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'keyword')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.keyword} (민감도 {self.sensitive})"

class UserFeedback(models.Model):
    """
    사용자가 댓글에 대해 제공하는 피드백
    - comment: 어떤 댓글에 대한 피드백인지 (Comment 앱 모델 참조)
    - user: 피드백을 제공한 사용자
    - result: 피드백 유형 (삭제 요청, 잘못 차단된 신고 등)
    - submitted_at: 피드백 제출 시각
    """
    FEEDBACK_CHOICES = (
        (1, '악성 댓글에서의 삭제 요청'),       # 사용자가 이 댓글을 악성이라 판단해 삭제를 요청
        (2, '악성으로 잘못 판명난 댓글 복원 요청'), # 이미 차단된 댓글을 사용자가 정상 댓글이라 판단해 복원을 요청   
    )

    comment      = models.ForeignKey('comment.Comment',on_delete=models.CASCADE, related_name='user_feedbacks')
    user         = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE)
    result       = models.PositiveSmallIntegerField(choices=FEEDBACK_CHOICES)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('comment', 'user')
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.user.username} → {self.get_result_display()}"