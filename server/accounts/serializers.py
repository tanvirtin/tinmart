from rest_framework import serializers

# import the Django user model
from django.contrib.auth.models import User

from django.contrib.auth import get_user_model

'''
The problem is that  User refers to django.contrib.auth.models.User and now I have got a Custom User account.User and I have in settings.py

AUTH_USER_MODEL = "account.User"

I have to define User with the Custom User model and you can do this with get_user_model at the top of the file where you use User

'''

User = get_user_model()

# the error python object also needs to be serialized into a JSON object
from .error import Error

class UserSerializer(serializers.ModelSerializer):
    # syntax to rename the User model's attributes to the desired attribute to be shown in the JSON object
    userId = serializers.CharField(source = 'user_id') # source indicates which attribute variable name we are replacing
    userName =  serializers.CharField(source = 'username')
    firstName = serializers.CharField(source = 'first_name')
    lastName = serializers.CharField(source = 'last_name')

    class Meta:
        model = User
        fields = ('userId', 'userName', 'email', 'firstName', 'lastName', 'dob', 'phone')


# syntax taken from -> http://www.django-rest-framework.org/api-guide/serializers/
# this is not a model serializer but only a python object serializer
class ErrorSerializer(serializers.Serializer):
    status = serializers.IntegerField()
    message = serializers.CharField()
