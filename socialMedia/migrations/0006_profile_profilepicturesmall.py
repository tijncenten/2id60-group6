# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-01-14 14:24
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('socialMedia', '0005_profile_profilepicture'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='profilePictureSmall',
            field=models.ImageField(blank=True, editable=False, upload_to='uploads/%Y/%m/%d/'),
        ),
    ]
