from django.db import models
from django.conf import settings

class Comment(models.Model):
    content = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField()
    is_offensive = models.BooleanField(default=False)
    offensive_reason = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.author.username}: {self.content[:20]}"