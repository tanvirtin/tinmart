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

import sys
# appending the parent directory to the list of directory that this file has access to
# this means that the folder and all its sub folders where the django folder lives is now accessible to this file
sys.path.append('..')
# import the elastic search client object with which products are looked up
from index.elasticsearchcli import ElasticSearchCli

# This decorator added here gives this view the ability to access requests from clients without an authentication token, as
# the user doesn't need to authenticate themselves when they are registering to the service.
@permission_classes((AllowAny, ))
class Search(APIView):

    # the search filter documents gets filterd by category
    def filter_search_documents(self, documents):
        category_map = {}
        for document in documents:
            doc_source = document['_source']
            # get the category
            category = doc_source['category']

            if category not in category_map:
                category_map[category] = []
                category_map[category].append(document)

            else:
                category_map[category].append(document)

        for key in category_map:
            value = category_map[key]                

            print('Category: {}'.format(key.encode('utf-8')))
            print('Category count: {}'.format(len(value)))


    # term is the part of the query string that is tynamic, here term is the query string
    # that will be used to query the lucene indexer to get the results
    def get(self, request, term):
        
        esc = ElasticSearchCli('tinmart')

        # number of top documents
        num_hits = 40
        
        res_object = esc.search('products', term, num_hits)

        #res_object = esc.search_with_boost('products', term, 'title', 2)

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

        # this will be the json response object
        json_dict = {
            'products': []
        }

        for document in documents:
            doc_source = document['_source']
            doc_id = doc_source['docId']

            # model.objects.filter() will always returne a list of model objects
            # since each document is uniquely identified with the doc_id then the assumption is
            # we will get a list back with only 1 element in it which is our document
            crawler_document = CrawlerDocument.objects.filter(docId = doc_id)[0]
            serialized_crawler_document = CrawlerDocumentSerializer(crawler_document)
            serialized_data = serialized_crawler_document.data
            # add the serialized model document data to the response json object which has an attribute
            # called products which will contain all the array of serialized_data 
            json_dict['products'].append(serialized_data)
            
        json_response = json.dumps(json_dict)

        return Response(json_response, status = status.HTTP_200_OK)
