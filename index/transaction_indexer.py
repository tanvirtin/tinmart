import csv
import random
import uuid
import time
import sys

from models import Transaction
from mongoengine import register_connection
from threading import Thread, Lock
from textblob import TextBlob
from elasticsearchcli import ElasticSearchCli


class TransactionIndexer(object):
    def __init__(self, file_name):
        register_connection('tinmart', 'tinmart')
        self.esc = ElasticSearchCli('tinmart')
        self.num_docs_retrieval = 15
        self.csvTable = self.read_csv(file_name)
     
    def __generate_transaction_id(self):
        # generate the unique doc_id
        unique_id = uuid.uuid4()
        transaction_id = str(unique_id)
        return transaction_id

    def read_csv(self, file_name):
        csvTable = []
        with open(file_name, 'r') as file:
            reader = csv.reader(file)
            for row in reader:
                csvTable.append(row)
        return csvTable

    def __archive(self, simulated_transaction):
        transaction_id = self.__generate_transaction_id()
        transaction = Transaction(transactionId = transaction_id, products = simulated_transaction)
        transaction.save()


    # the search filter documents gets filterd by category
    def __filter_search_documents_by_category(self, documents):
        category_score_map = {}
        category_map = {}
        for document in documents:
            doc_source = document['_source']
            doc_score = document['_score']
            # get the category
            category = doc_source['category']

            if category not in category_score_map:
                category_score_map[category] = doc_score
                category_map[category] = [doc_source]
            else:
                category_score_map[category] += doc_score
                category_map[category].append(doc_source)

        max_key = ''
        max_val = -sys.maxsize
        for key in category_score_map:
            score = category_score_map[key]
            if score > max_val:
                max_key = key
                max_val = score

        return category_map[max_key]

    def __get_document(self, item, item_representation):
        res_object = self.esc.search('products', item, self.num_docs_retrieval)
        
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

    def simulate_transactions(self):
        # create key value pairs so that each item unique item in the csv file represents the same item in the list of products in the database
        item_representation = {}

        for transaction in self.csvTable: 
            # will contain a simulated transaction
            simulated_transaction = []
            for item in transaction:
                if item in item_representation:
                    break

                # get the documents
                documents = self.__get_document(item, item_representation)

                # if array of hits is empty that means elastic search could not find anything with this query
                if not documents:
                    continue

                category_count = {}

                print('For item: {}'.format(item))

                product_list_for_category = self.__filter_search_documents_by_category(documents)

                print([product['title'].encode('utf-8') for product in product_list_for_category])

                print('')

                time.sleep(3)

                # we don't want the length int value to be included in the random pick as indexes start from 0
                total_documents = len(documents) - 1
                
                # randomly pick an index
                random_index = random.randint(0, total_documents)

                document = documents[random_index]
                
                doc_source = document['_source']

                # get the doc_id from the document returned by elastic search
                doc_id = doc_source['docId']

                title = doc_source['title'].encode('utf-8')


                if item not in item_representation:
                    item_representation[item] = title

                # add the doc_id to the transaction list
                simulated_transaction.append(doc_id)

            # # if simulated_transaction is empty then theres no point            
            # if simulated_transaction:
            #     # create the thread                                     # remember a tuple with a single element in it will need to have a syntax like this (single_element, ) the , needs to be there!
            #     archive_thread = Thread(target = self.__archive, args = (simulated_transaction, ))
            #     # start the thread
            #     archive_thread.start()


        print(item_representation)


            




