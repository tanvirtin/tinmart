import csv
from models import Transaction
from mongoengine import register_connection
from threading import Thread, Lock
from elasticsearchcli import ElasticSearchCli
import random
import uuid
import time

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


    def simulate_transactions(self):
        # create key value pairs so that each item unique item in the csv file represents the same item in the list of products in the database
        item_representation = {}

        for transaction in self.csvTable: 
            # will contain a simulated transaction
            simulated_transaction = []
            for item in transaction:

                if item in item_representation:
                    break

                res_object = self.esc.search('products', item, self.num_docs_retrieval)
                
                # bunch of checks for undefined objects

                if not res_object:
                    continue

                list_of_keys = res_object.keys()

                if 'hits' not in list_of_keys:
                    continue

                hits = res_object['hits']
                
                list_of_hits_keys = hits.keys()

                if 'hits' not in list_of_hits_keys:
                    continue

                # the documents returned by elastic search is very nested
                # rest_object['hits'] returns an object which contains an attribute called hits
                # this hits attribute is an array containing objects which will have an attribute called _source
                # which is the luecene document that gets indexed
                documents = hits['hits']

                # if array of hits is empty that means elastic search could not find anything with this query
                if not documents:
                    continue

                category_count = {}

                print('For item: {}'.format(item))
                for document in documents:
                    category = document['_source']['category']

                    if category in category_count:
                        category_count[category] = category_count[category] + 1

                    else:
                        category_count[category] = 1

                print(category_count)
                    
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


            




