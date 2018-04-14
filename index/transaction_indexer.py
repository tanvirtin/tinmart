import csv
from models import Transaction
from mongoengine import connect
from threading import Thread, Lock
from elasticsearchcli import ElasticSearchCli
import logging
import random
import uuid

class TransactionIndexer(object):
    def __init__(self, file_name):
        connect('tinmart')
        self.esc = ElasticSearchCli('tinmart')
        self.num_docs_retrieval = 40
        self.csvTable = self.read_csv(file_name)
        self.simulate_transactions()
     
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
        num_transaction_generated = 0
        # lets do this 40 times!
        for i in range(self.num_docs_retrieval):
            for transaction in self.csvTable: 
                # will contain a simulated transaction
                simulated_transaction = []
                for item in transaction:
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

                    # we don't want the length int value to be included in the random pick as indexes start from 0
                    total_documents = len(documents) - 1
                    
                    random_index = random.randint(0, total_documents)

                    document = documents[random_index]
                    
                    doc_source = document['_source']

                    # get the doc_id from the document returned by elastic search
                    doc_id = doc_source['docId']

                    # add the doc_id to the transaction list
                    simulated_transaction.append(doc_id)

                # create the thread                                     # remember a tuple with a single element in it will need to have a syntax like this (single_element, ) the , needs to be there!
                archive_thread = Thread(target = self.__archive, args = (simulated_transaction, ))
                # start the thread
                archive_thread.start()

                num_transaction_generated += 1

                logging.debug('Generated {} simulated transactions so far: \n'.format(num_transaction_generated))



                




