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

    def __print_product_titles(self, products):
        print('Product list: {}\n'.format([product['title'].encode('utf-8') for product in products]))

    def __check_word_similarity(self, word_a, word_b):
        word_a = word_a.lower()
        word_b = word_b.lower()

        counter = 0
        for word in word_a:
            if word in word_b:
                counter += 1

        num_chars_a = len(word_a)

        similariy_count = counter / num_chars_a

        return similariy_count * 100

    # Lets say you have a word called weat and a sentance called wheat flour good stuff
    # then it will find the similarity for each word in whweat flour good stuff and a similarity score over 90 indicates that the product was just mispelled
    def __check_similarity(self, word_a, sentance):
        word_a = word_a.lower()
        sentance = sentance.lower()

        sentance_words = sentance.split(' ')

        similarity_scores = []

        for word in sentance_words:
            similarity_score = self.__check_word_similarity(word_a, word)

            similarity_scores.append(similarity_score)
            
        return similarity_scores

        

    def filter_meaningful_products(self, item_query, products):
        # find the noun in the query with which search is made
        blob = TextBlob(item_query)
        blob_tags = blob.tags

        # get the list of noun words in the query
        noun_words_in_query = []
        
        # loop over the tags associated with each word in the query
        for blob in blob_tags:
            word = blob[0]
            tag = blob[1]
            
            # Singular nouns are NN and plural nouns are NNS in the tags, any tag other then that is not a noun
            if tag == 'NN' or tag == 'NNS':
                noun_words_in_query.append(word)


        # will contain the list of products removed
        products_removed = []

        for product in products:
            product_title = product['title']
            

            noun_not_in_product_counter = 0
            # if the noun word doesn't appear in the title of the product then remove that product from the list of products
            # this solves the problem where when you want green grapes you get green pepperes instead
            for noun in noun_words_in_query:
                # if noun is not in the list of products then find the similarity that the noun has to the product
                if noun not in product_title.lower():
                    scores = self.__check_similarity(noun, product_title)

                    noun_not_in_product_counter += 1
            
                    for score in scores:
                        if score > 90:
                            # if a score is greater than 90 then the process is undone
                            noun_not_in_product_counter -=1
                            break

            # if the noun not in product counter equals the length of the list of query nouns then the search product result is invalid
            # we remove this product as it is not relevant and it was based on adjectives like green or sparkling
            if noun_not_in_product_counter == len(noun_words_in_query):
                products_removed.append(product)
                products.remove(product)
                

        return products_removed
                



    def simulate_transactions(self):
        # create key value pairs so that each item unique item in the csv file represents the same item in the list of products in the database
        item_representation = {}

        for transaction in self.csvTable: 
            # will contain a simulated transaction
            simulated_transaction = []
            # loop over each item in the transaction and find the best item from lucene that identifies with that item
            for item in transaction:
                if item in item_representation:
                    # then add the item that already represents that item from the list of items in the transaction
                    simulated_transaction.append(item_representation[item])
                    break

                # get the documents
                documents = self.__get_document(item, item_representation)

                # if array of hits is empty that means elastic search could not find anything with this query
                if documents:
                    category_count = {}

                    print('For item: {}'.format(item))

                    
                    product_list_for_category = self.__filter_search_documents_by_category(documents)

                    old_num_product = len(product_list_for_category)

                    self.__print_product_titles(product_list_for_category)
                    
                    # get the list of filtered products with emphasis on the noun words in the query
                    products_removed = self.filter_meaningful_products(item, product_list_for_category)

                    new_num_product = len(product_list_for_category)

                    self.__print_product_titles(products_removed)

                    print('Products removed: {}'.format(old_num_product - new_num_product))

                    #time.sleep(2)

                    # we don't want the length int value to be included in the random pick as indexes start from 0
                    total_documents = len(product_list_for_category) - 1
                    
                    # randomly pick an index
                    random_index = random.randint(0, total_documents)

                    document = product_list_for_category[random_index]
                
                    # get the doc_id from the document returned by elastic search
                    doc_id = document['docId']

                    title = document['title'].encode('utf-8')


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


            




