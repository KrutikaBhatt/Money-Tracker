from django.contrib import admin
from .models import Friend
from .models import Group
from .models import Membership
from .models import Transaction
from .models import *

# Register your models here.
admin.site.register(Friend)
admin.site.register(Group)
admin.site.register(Membership)
admin.site.register(Transaction)