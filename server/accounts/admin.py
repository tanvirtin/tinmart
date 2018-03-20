from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Register your models here.

# registering the User model and telling django that this User model will be the UserAdmin, or the model responsible for holding users
admin.site.register(User, UserAdmin)
