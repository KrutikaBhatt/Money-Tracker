# Generated by Django 4.1.5 on 2023-01-10 09:19

import datetime
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Group',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mygroup', models.CharField(max_length=50)),
                ('no_transactions', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('description', models.CharField(max_length=30)),
                ('date', models.DateTimeField(default=datetime.datetime.now)),
                ('added_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='added_by', to=settings.AUTH_USER_MODEL)),
                ('group', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='money_tracker_backend.group')),
                ('paid_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='paid_by', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Membership',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('money_owed', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('friend', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('group', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='money_tracker_backend.group')),
            ],
        ),
        migrations.AddField(
            model_name='group',
            name='members',
            field=models.ManyToManyField(through='money_tracker_backend.Membership', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='Friend',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('money_owed', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('friend1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='person1', to=settings.AUTH_USER_MODEL)),
                ('friend2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='person2', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
