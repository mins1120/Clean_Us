from django import forms
from .models import User

class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['email', 'name']

    def __init__(self, *args, **kwargs):
        super(UserUpdateForm, self).__init__(*args, **kwargs)
        self.fields['email'].disabled = True