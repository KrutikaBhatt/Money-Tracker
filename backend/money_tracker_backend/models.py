from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings
from datetime import datetime    


# Create your models here.
class Friend(models.Model):
    friend1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name='friend1')
    friend2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE, related_name='friend2')
    money_owed = models.DecimalField(decimal_places=2, max_digits=10, default = 0)
    
    def __str__(self):
        return self.friend2.username


class Group(models.Model):
    mygroup =  models.CharField(max_length=50)
    no_transactions = models.IntegerField(default=0)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Membership')

    def __str__(self):
        return self.mygroup

class Membership(models.Model):
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete = models.CASCADE)
    group = models.ForeignKey(Group, on_delete = models.CASCADE)
    money_owed = models.DecimalField(decimal_places=2, max_digits=10, default=0)
    paid = models.BooleanField(default=False)
    
    def __str__(self):
        return self.friend.username + ' ' + self.group.mygroup

class Transaction(models.Model):
    group = models.ForeignKey(Group, on_delete = models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(default=0,decimal_places=2,max_digits=10)
    paid_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='paid_by',null=True)
    added_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE, related_name='added_by',null=True)
    description = models.CharField(max_length=30)
    date = models.DateTimeField(default=datetime.now)
    
    def __str__(self):
        return self.group.mygroup + ' amount -' + str(self.amount) + ' paid by -' + self.paid_by.username 

