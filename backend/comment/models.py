from django.db import models

class Comment(models.Model):
    comment_id   = models.CharField(max_length=100, unique=True, db_index=True)
    content      = models.TextField()
    collected_at = models.DateTimeField(auto_now_add=True)
    is_filtered  = models.BooleanField(default=False)

    class Meta:
        # 시간 내림차순으로 조회할 때 편리
        ordering = ['-collected_at']

    def __str__(self):
        return f"{self.comment_id}: {self.content[:20]}"