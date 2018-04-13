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
from .models import CrawlerDocument, Transaction

# import the json object which will convert a dictionary to a json object
import json

# unique id generator
import uuid

# This decorator added here gives this view the ability to access requests from clients without an authenticateion token, as
# the user doesn't need to authenticate themselves when they are registering to the service.
@permission_classes((AllowAny, ))
class Product(APIView):
    # this class is responsible for retrieving a specific product with a specific product id

    def get(self, request, product_id):
        products = CrawlerDocument.objects(docId = product_id)

        # if products are not found 404 status is sent back
        if not products:
            # create the error object and give it as a response to a failed request
            error = Error()
            error.status = 404
            error.message = 'product not found'
            serialized_error = ErrorSerializer(error);
            serialized_data = serialized_error.data
            return Response(serialized_data, status = status.HTTP_404_NOT_FOUND)

        # the assumption here is that product_ids/docIds are absolutely unique so the list that
        # gets returned is actually a list with a single element, now accessing the first element in the list should
        # give us the document back
        product = products[0]

        serialized_crawler_document = CrawlerDocumentSerializer(product)
        serialized_data = serialized_crawler_document.data

        return Response(serialized_data, status = status.HTTP_200_OK)


# This decorater added here gives this view the ability to access requests from clients with an authentication header token
# as the user doesn't need to authenticate themselves when they are registering to the service.
@permission_classes((AllowAny, ))
class Suggest(APIView):
    # this class is responsible for suggesting similar products
    pass



# This decorator added here gives this view the ability to access requests from clients without an authentication token, as
# the user doesn't need to authenticate themselves when they are registering to the service.
@permission_classes((AllowAny, ))
class Purchase(APIView):
    # this class is responsible for all the transactions

    # filters an array of duplicate values
    def filter_duplicates(self, lis):
        newList = []        

        for element in lis:
            if not element in newList:
                newList.append(element)

        return newList

    def put(self, request):
        # JSON data sent from the server aliased by a variable
        data_received = request.data
        
        # get the list of products purchased from the json object
        products = data_received['products']

        # filter the products by removing duplicate values
        products = self.filter_duplicates(products)

        # generate the unique transaction id
        transaction_id_uuid = uuid.uuid4()
        transaction_id = str(transaction_id_uuid)

        # save the transaction and return the status http ok
        transaction = Transaction(transactionId = transaction_id, products = products)
        transaction.save()

        return Response(status = status.HTTP_200_OK)




