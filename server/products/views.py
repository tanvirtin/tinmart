# all the views will inherit APIView
from rest_framework.views import APIView

# used to send response back to the client side
from rest_framework.response import Response

# used to send the status which can be 200, 404, 403, etc
from rest_framework import status

# AllowAny will be put inside a tuple and passed inside the permission_classes decorator function
from rest_framework.permissions import AllowAny

# this decorator function dictates whether a view will require a token to be accessed or not
from rest_framework.decorators import permission_classes

# import the Error object which is not a model
from .error import Error

# imports the serializer class to transform model data to JSON
from .serializers import ErrorSerializer, CrawlerDocumentSerializer

# import the mongodb database model
from .models import CrawlerDocument

# import the json object which will convert a dictionary to a json object
import json


# This decorator added here gives this view the ability to access requests from clients without an authenticateion token, as
# the user doesn't need to authenticate themselves when they are registering to the service.
@permission_classes((AllowAny, ))
class Product(APIView):
    # this class is responsible for retrieving a specific product with a specific product id

    def get(self, request, product_id):
        pass