from django.contrib import admin
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
# obtain_jwt_token contains the logic on how the token will be sent the user
from rest_framework_jwt.views import obtain_jwt_token
# the views related to this app is obtained
from accounts import views

urlpatterns = [
    # deals with the path name 'accounts/register-user'
    path('register-user', views.RegisterUser.as_view()),

    # deals with jwt token authentication, with the path name 'accounts/authenticate-user', where the
    # username and password is authenticated and authentication token is sent to the user
    path('authenticate-user', obtain_jwt_token)

]

urlpatterns = format_suffix_patterns(urlpatterns)
