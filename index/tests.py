from models import Transaction, CrawlerDocument
from apyori import apriori
from mongoengine import register_connection
from searchresultoptimizer import SearchResultOptimizer
from elasticsearchcli import ElasticSearchCli
import time

def train_apriori():
    print('Training apriori...')
    # get all transactions
    transactions = Transaction.objects.all()
    apriori_transactions = [[product for product in transaction['products']] for transaction in transactions]
    
    rules = apriori(apriori_transactions, min_support = 0.003, min_confidence = 0.2, min_lift = 3, min_length = 2)

    results = list(rules)

    print('Apriori training complete...')

    return results

def format_query(query):
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

def get_document(query):
    esc = ElasticSearchCli('tinmart')

    res_object = esc.search('products', query, 40)

    time.sleep(1)
    
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


def recommend_for_item(doc_id, results):
    recommended_items = []

    for result in results:
        frozen_set = result[0]

        # if the document is in the frozen set then we found some associations
        if doc_id in frozen_set:
            elements = list(frozen_set)
            elements.remove(elements[0])

            recommended_items += elements

    # remove duplicates, by converting into a set and converting it back into a list
    recommended_items = list(set(recommended_items))

    return recommended_items

if __name__ == '__main__':
    register_connection('tinmart', 'tinmart')
    register_connection('fillmyfridge', 'fillmyfridge')
    
    # will contain all the suggested items
    suggestion_dict = {
        'similarProducts': [],
        'complementaryProducts': []
    }

    sro = SearchResultOptimizer()

    results = train_apriori()

    query_id = 915

    result = recommend_for_item(query_id, results)

    if not result:
        document = CrawlerDocument.objects(docId = query_id)

        doc_title = document[0]['title']

        # format the query
        query = format_query(doc_title)

        # get the documents
        documents = get_document(query)

        # if array of hits is empty that means elastic search could not find anything with this query
        if documents:
            product_list_for_category = sro.filter_search_documents_by_category(documents)
            
            # get the list of filtered products with emphasis on the noun words in the query
            sro.filter_meaningful_products(doc_title, product_list_for_category)

            # populate the simlarItems key
            suggestion_dict['similarProducts'] = product_list_for_category


            for product in product_list_for_category:
                # now for each item find the apriori results
                # if one of the result is not an empty list return that result
                result = recommend_for_item(product['docId'], results)
                
                if result:
                    suggestion_dict['complementaryProducts'] = result
                    # no need to continue the loop if a result has been found
                    break

    print(suggestion_dict)
