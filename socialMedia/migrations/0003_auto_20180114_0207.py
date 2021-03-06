# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-01-14 01:07
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('socialMedia', '0002_post_likes'),
    ]

    operations = [
        migrations.CreateModel(
            name='Chat',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('fromHidden', models.BooleanField(default=False, editable=False)),
                ('toHidden', models.BooleanField(default=False, editable=False)),
                ('fromProfile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='fromChatProfileSet', to='socialMedia.Profile')),
                ('toProfile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='toChatProfileSet', to='socialMedia.Profile')),
            ],
        ),
        migrations.RemoveField(
            model_name='chatmessage',
            name='toProfile',
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='read',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='chatmessage',
            name='chat',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='messages', to='socialMedia.Chat'),
            preserve_default=False,
        ),
        migrations.AlterUniqueTogether(
            name='chat',
            unique_together=set([('fromProfile', 'toProfile')]),
        ),
    ]
