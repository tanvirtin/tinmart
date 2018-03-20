from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

# stores registration form data of a user
# User class inherits the AbstractUser, which is the Django built in User model which has authentication already implemented
class User(AbstractUser):
    # unique user identifier
    user_id = models.CharField(max_length = 36)
    dob = models.CharField(max_length = 10)
    phone = models.CharField(max_length = 200)

    # these attributes must be intialized in order to instantiate this object, username and password is mandatory and doesn't
    # need to be in required fields as they are implicitly necessary
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'phone', 'dob']

    # Not an instance method meaning this method is a class method, just like all the attributes declared above which are all
    # class variables. Both this function and the variables above have no reference to self making it class variables and method.
    def get_field_max_length(field_name):
        return User._meta.get_field(field_name).max_length
