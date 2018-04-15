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
from searchresultoptimizer import SearchResultOptimizer


class TransactionIndexer(object):
    def __init__(self, file_name):
        db = register_connection('tinmart', 'tinmart')
        self.esc = ElasticSearchCli('tinmart')
        self.num_docs_retrieval = 15
        self.csvTable = self.read_csv(file_name)
        self.search_result_optm = SearchResultOptimizer()

    def get_unique_items_in_table(self, table):
        unique_items = []
        for transaction in table:
            for item in transaction:
                if item not in unique_items:
                    unique_items.append(item)

        return unique_items
     
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

    def __print_product_titles(self, products):
        print('Product list: {}\n'.format([product['title'].encode('utf-8') for product in products]))

    def __get_document(self, item):
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

    def __format_query(self, query):
        # contains the new query string with which the item gets searched
        new_query = ''

        # split the query by a space to get all the words in the query
        sentance = query.split(' ')
        
        for word in sentance:
            if word != '':
                new_query += word + ' '

                if word[-1] != 's':
                    new_query += word + 's '
                
                elif word[-1] == 's':
                    new_query += word[:-1]

        return new_query

    def __get_doc_id(self, product_list_for_category):
        # we don't want the length int value to be included in the random pick as indexes start from 0
        total_documents = len(product_list_for_category) - 1

        # randomly pick an index
        random_index = random.randint(0, total_documents)

        document = product_list_for_category[random_index]

        # get the doc_id from the document returned by elastic search
        doc_id = document['docId']

        return doc_id

    def simulate_transactions(self):
        # create key value pairs so that each item unique item in the csv file represents the same item in the list of products in the database
        item_representation = {}

        # contains a list of all the simulated transactions
        simulated_transactions = []

        items_in_csv_not_found = {}

        for transaction in self.csvTable: 
            # will contain a simulated transaction
            simulated_transaction = []
            # loop over each item in the transaction and find the best item from lucene that identifies with that item
            for item in transaction:
                if item == ' asparagus':
                    item = 'asparagus'

                if item in item_representation:
                    # then add the item that already represents that item from the list of items in the transaction
                    simulated_transaction.append(item_representation[item])
                    # continue the code by skipping the code below
                    continue

                # the query needs to be formatted to include plurals in order for the documents to be found
                query = self.__format_query(item)

                # get the documents
                documents = self.__get_document(query)

                # if array of hits is empty that means elastic search could not find anything with this query
                if documents:
                    product_list_for_category = self.search_result_optm.filter_search_documents_by_category(documents)
                    
                    # get the list of filtered products with emphasis on the noun words in the query
                    self.search_result_optm.filter_meaningful_products(item, product_list_for_category)

                    doc_id = self.__get_doc_id(product_list_for_category)

                    if item not in item_representation:
                        for key in item_representation:
                            value = item_representation[key]

                            if value == doc_id:
                                # generate a new doc_id which is unique
                                while value == doc_id:
                                    doc_id = self.__get_doc_id(product_list_for_category)
                                
                        item_representation[item] = doc_id

                    # add the doc_id to the transaction list
                    simulated_transaction.append(doc_id)
                    

            # if simulated_transaction is empty then theres no point            
            if simulated_transaction:
                # create the thread                                     # remember a tuple with a single element in it will need to have a syntax like this (single_element, ) the , needs to be there!
                archive_thread = Thread(target = self.__archive, args = (simulated_transaction, ))
                # start the thread
                archive_thread.start()

            else:
                items_in_csv_not_found[item] = 'not found'

            if simulated_transaction:
                simulated_transactions.append(simulated_transaction)
    
        # return the simulated transactions for association rule mining
        return simulated_transactions
            


if __name__ == '__main__':
    transaction_indexer = TransactionIndexer('./data/transactions.csv')
    transactions = transaction_indexer.simulate_transactions()

