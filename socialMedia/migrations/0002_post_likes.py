# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-01-13 18:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('socialMedia', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='likes',
            field=models.PositiveIntegerField(default=0, editable=False),
        ),
    ]
