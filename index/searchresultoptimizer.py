from textblob import TextBlob
import sys

class SearchResultOptimizer(object):

    # the search filter documents gets filterd by category
    def filter_search_documents_by_category(self, documents):
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