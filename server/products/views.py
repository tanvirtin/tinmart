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
from .serializers import ErrorSerializer, CrawlerDocumentSerializer, TransactionSerializer

# import the mongodb database model
from .models import CrawlerDocument, Transaction

# import the json object which will convert a dictionary to a json object
import json

# unique id generator
import uuid

# for sleeping
import time

# apriori algorithm imports
from apyori import apriori

import sys
# appending the parent directory to the list of directory that this file has access to
# this means that the folder and all its sub folders where the django folder lives is now accessible to this file
sys.path.append('..')
# import the elastic search client object with which products are looked up
from index.elasticsearchcli import ElasticSearchCli
# import the search optmizer class
from index.searchresultoptimizer import SearchResultOptimizer

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
    
    def format_query(self, query):
        # contains the new query string with which the item gets searched
        new_query = ''

        # split the query by a space to get all the words in the query
        sentance = query.split(' ')
        
        for word in sentance:
            for letter in word:
                if letter == '%':
                    word = ''
                    break

            if word != '':
                new_query += word + ' '

                if word[-1] != 's':
                    new_query += word + 's '
                
                elif word[-1] == 's':
                    new_query += word[:-1]

        return new_query


    def get_document(self, query):
        esc = ElasticSearchCli('tinmart')
        res_object = esc.search('products', query, 40)
        
        # bunch of checks for undefined objects
        if not res_object:
            return None

        list_of_keys = res_object.keys()

        if 'hits' not in list_of_keys:
            return None

        hits = res_object['hits']
        
        list_of_hits_keys = hits.keys()

        if 'hits' not in list_of_hits_keys:
            return None
        # the documents returned by elastic search is very nested
        # rest_object['hits'] returns an object which contains an attribute called hits
        # this hits attribute is an array containing objects which will have an attribute called _source
        # which is the luecene document that gets indexed
        documents = hits['hits']

        return documents


    def recommend_for_item(self, doc_id, results):
        recommended_items = []

        for result in results:
            frozen_set = result[0]

            # if the document is in the frozen set then we found some associations
            if doc_id in frozen_set:
                elements = list(frozen_set)

                # remove the docId from the from the list of recommendeation
                elements.remove(doc_id)

                recommended_items += elements

        # remove duplicates, by converting into a set and converting it back into a list
        recommended_items = list(set(recommended_items))

        return recommended_items


    def compute_apriori(self):
        # get all transactions
        transactions = Transaction.objects.all()
        apriori_transactions = [[product for product in transaction['products']] for transaction in transactions]
        
        rules = apriori(apriori_transactions, min_support = 0.003, min_confidence = 0.2, min_length = 2)

        results = list(rules)

        return results

    def serialize_similar_products(self, product_list_for_category):
        json_products = []
        for docs in product_list_for_category:
            id = docs['docId']
            product = CrawlerDocument.objects(docId = id)[0]
            serialized_product = CrawlerDocumentSerializer(product)
            json_product = serialized_product.data
            json_products.append(json_product)

        return json_products
        
    def serialize_complementary_products(self, complemantary_products):
        json_products = []
        for id in complemantary_products:
            product = CrawlerDocument.objects(docId = id)[0]
            serialized_product = CrawlerDocumentSerializer(product)
            json_product = serialized_product.data
            json_products.append(json_product)
            
        return json_products
    
    def get(self, request, product_id):
        # check if the product exists
        document = CrawlerDocument.objects(docId = product_id)

        # if product is not found then simply return a 404 message
        if not document:
            # create the error object and give it as a response to a failed request
            error = Error()
            error.status = 404
            error.message = 'product not found'
            serialized_error = ErrorSerializer(error);
            serialized_data = serialized_error.data
            return Response(serialized_data, status = status.HTTP_404_NOT_FOUND)

        # get the document title
        doc_title = document[0]['title']

        # will contain all the suggested items
        suggestion_dict = {
            'similarProducts': [],
            'complementaryProducts': []
        }

        sro = SearchResultOptimizer()

        results = self.compute_apriori()

        result = self.recommend_for_item(product_id, results)

        if not result:

            # format the query
            query = self.format_query(doc_title)

            # get the documents
            documents = self.get_document(query)

            # if array of hits is empty that means elastic search could not find anything with this query
            if documents:
                product_list_for_category = sro.filter_search_documents_by_category(documents)
                
                # get the list of filtered products with emphasis on the noun words in the query
                sro.filter_meaningful_products(doc_title, product_list_for_category)

                # populate the similarProducts key with docIds of recommended products
                suggestion_dict['similarProducts'] = self.serialize_similar_products(product_list_for_category)

                for product in product_list_for_category:
                    # now for each item find the apriori results
                    # if one of the result is not an empty list return that result
                    result = self.recommend_for_item(product['docId'], results)
                    
                    if result:
                        suggestion_dict['complementaryProducts'] = self.serialize_complementary_products(result)
                        # no need to continue the loop if a result has been found
                        break

        # else results are the complementary products        
        else:
            suggestion_dict['complementaryProducts'] = self.serialize_complementary_products(result)

            # format the query
            query = self.format_query(doc_title)

            # get the documents
            documents = self.get_document(query)

            # if array of hits is empty that means elastic search could not find anything with this query
            if documents:
                product_list_for_category = sro.filter_search_documents_by_category(documents)
                
                # get the list of filtered products with emphasis on the noun words in the query
                sro.filter_meaningful_products(doc_title, product_list_for_category)
                    
                # populate the similarProducts key with docIds of recommended products
                suggestion_dict['similarProducts'] = self.serialize_similar_products(product_list_for_category)

        suggestion_json = json.dumps(suggestion_dict)

        return Response(suggestion_json, status = status.HTTP_200_OK)

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




