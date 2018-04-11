from django.shortcuts import render

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
from .serializers import ErrorSerializer

import sys
# appending the parent directory to the list of directory that this file has access to
# this means that the folder and all its sub folders where the django folder lives is now accessible to this file
sys.path.append('..')
# import the elastic search client object with which products are looked up
from index.elasticsearchcli import ElasticSearchCli


# This is just a test logic
# This decorator added here gives this view the ability to access requests from clients without an authentication token, as
# the user doesn't need to authenticate themselves when they are registering to the service.
@permission_classes((AllowAny, ))
class Search(APIView):
    # term is the part of the query string that is tynamic, here term is the query string
    # that will be used to query the lucene indexer to get the results
    def get(self, request, term):
        
        esc = ElasticSearchCli('tinmart')

        res_object = esc.search('products', term)

        # the documents returned by elastic search is very nested
        # rest_object['hits'] returns an object which contains an attribute called hits
        # this hits attribute is an array containing objects which will have an attribute called _source
        # which is the luecene document that gets indexed
        documents = res_object['hits']['hits']

        # if array of hits is empty that means elastic search could not find anything with this query
        if not documents:
            # Since we have an error an error object is created, but notice that the error object is never saved< I don't want to clutter the database
            error = Error()
            error.status = 404
            # specifiy the message if both username and email already exits
            error.message = 'product not found'
            
            # serialize the error by turning it into a json object using the ErrorSerializer class
            serialized_error = ErrorSerializer(error);
            
            # get the data from the serialized error object
            serialized_data = serialized_error.data

            return Response(serialized_data, status = status.HTTP_404_NOT_FOUND)

        return Response(status = status.HTTP_200_OK)
