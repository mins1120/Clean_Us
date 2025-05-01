from django import forms
from django.contrib.auth.forms import UserCreationForm
from user.models import User  # 너의 커스텀 유저 모델

class CustomUserCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2']
