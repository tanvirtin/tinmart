# import the Django user model
from django.contrib.auth.models import User
# all the views will inherit APIView
from rest_framework.views import APIView
# used to send response back to the client side
from rest_framework.response import Response
# import the Error object which is not a model
from .error import Error
# imports the serializer class to transform model data to JSON
from .serializers import UserSerializer, ErrorSerializer
# to generate unique id
import uuid
# used to send the status which can be 200, 404, 403, etc
from rest_framework import status

# AllowAny will be put inside a tuple and passed inside the permission_classes decorator function
from rest_framework.permissions import AllowAny
# this decorator function dictates whether a view will require a token to be accessed or not
from rest_framework.decorators import permission_classes


from django.contrib.auth import get_user_model

'''
The problem is that  User refers to django.contrib.auth.models.User and now I have got a Custom User account.User and I have in settings.py

AUTH_USER_MODEL = "account.User"

I have to define User with the Custom User model and you can do this with get_user_model at the top of the file where you use User

'''

User = get_user_model()

# this class will deal with adding a user to the database
# This decorator added here gives this view the ability to access requests from clients without an authentication token, as
# the user doesn't need to authenticate themselves when they are registering to the service.
# RegiterUser class gets passed inside permiss_classes function with AllowAny and then gets created and used inside of permission_classes function/class
@permission_classes((AllowAny, ))
class RegisterUser(APIView):

    # checks if the email already exists in the database
    def email_check(self, received_email):
        # returns list of objects with the email that matches the email provided
        query_set = User.objects.filter(email = received_email)
        if len(query_set) == 0:
            return True
        return False

    # checks if the username already exists in the database
    def username_check(self, received_username):
        # returns list of objects with the username that matches the username provided
        query_set = User.objects.filter(username = received_username)
        if len(query_set) == 0:
            return True
        return False

    # adds a user with the data_received to the database
    def add_user(self, data_received):
        # unique id for the user is created
        unique_id = uuid.uuid4()
        unique_id = str(unique_id)

        User.objects.create_user(
            user_id = unique_id,
            username = data_received['userName'],
            password = data_received['password'],
            email = data_received['email'],
            first_name = data_received['firstName'],
            last_name = data_received['lastName'],
            phone = data_received['phone'],
            dob = data_received['dob']
        )


    def check_data_validity(self, data_received):
        # retrieve the keys from the JSON data sent by the client
        data_received_keys = list(data_received.keys())

        # list of valid keys for the JSON data
        valid_keys = ['userName', 'password', 'email', 'firstName', 'lastName', 'phone', 'dob']
        valid_keys_user_model = ['username', 'password', 'email', 'first_name', 'last_name', 'phone', 'dob']

        # if any value for the keys in data_received is an empty string False will be returned
        for key in data_received_keys:
            # any nonsense data sent by the user will immedietly be rejected and a bad request code will be sent back which is a 400 code
            if data_received[key] == '':
                return False

        # I loop over the valid keys and check if the valid keys are in the list of keys in the data provided
        # if they are not I immedietly return false
        for key in valid_keys:
            if key not in data_received_keys:
                return False

        # next check if any of the form attributes sent from the client exceeds the max length allowed for attributes in the model
        for i in range(len(valid_keys_user_model)):
            if len(data_received[valid_keys[i]]) > User.get_field_max_length(valid_keys_user_model[i]):
                return False

        # if all the checks get passed the code has successfully made it till this part and we return true
        return True

    # deals with post http request, as the url doesn't specify an exact resource to be saved
    def post(self, request):
        # JSON data sent from the server aliased by a variable
        data_received = request.data

        # check if the data received is valid or bad request
        if not self.check_data_validity(data_received):
            return Response(status = status.HTTP_400_BAD_REQUEST)

        # check if the email already checks in the database, returns false if it already exists
        e_check = self.email_check(data_received['email'])

        # check if the username already checks in the database, returns false if it already exists
        u_check = self.username_check(data_received['userName'])

        # both the statement needs to be true in order for the entire statement to be true
        # either one of the statement being false will result in the model not being added to the database
        if e_check and u_check:

            # add the user to the database
            self.add_user(data_received)

            # send back a 200 request to the client
            return Response(status = status.HTTP_200_OK)

        # Since we have an error an error object is created, but notice that the error object is never saved< I don't want to clutter the database
        error = Error()
        error.status = 409

        # Both the condition must be true in order for the entire statement to be true
        if not e_check and u_check:
            # if only email is wrong then an error object is sent with the error code and the message to the client

            # specify the message for this specific condition
            error.message = 'email already exists';

            # serialize the error object to transoform it into a JSON object
            serialized_error = ErrorSerializer(error);

            return Response(serialized_error.data, status = status.HTTP_409_CONFLICT)

        # Both the condition must be true in order for the entire statement to be true
        elif e_check and not u_check:
            # if only username is wrong then and object along with the status is sent where the error code and the error message is encapsulated in the error object

            # specifiy the message for this specific condition
            error.message = 'username already exists'

            # serialize the error object to transoform it in a JSON object
            serialized_error = ErrorSerializer(error);

            return Response(serialized_error.data, status = status.HTTP_409_CONFLICT)

        # specifiy the message if both username and email already exits
        error.message = 'username and email already exists'

        # serialize the error object to transform it in to a JSON object
        serialized_error = ErrorSerializer(error);

        # if both email and username is wrong then 409 error code is returned and an object also containing the code and error message
        return Response(serialized_error.data, status = status.HTTP_409_CONFLICT)
