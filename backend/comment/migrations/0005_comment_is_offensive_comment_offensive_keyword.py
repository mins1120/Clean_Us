# Generated by Django 5.2 on 2025-05-20 12:22

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("comment", "0004_alter_comment_created_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="comment",
            name="is_offensive",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="comment",
            name="offensive_keyword",
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
