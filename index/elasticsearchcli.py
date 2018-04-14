import requests
import json

'''
    Class is responsible CRUD procedures on elastic search
'''
class ElasticSearchCli(object):
    '''
        Takes in one id parameter which is the name of the index that will get manipulated
    '''
    def __init__(self, index_name):
        self.index_name = index_name
        self.base_url = 'http://localhost:9200/' + self.index_name + '/'


    '''
        Indexes a given document in elasticsearch to a given category in the index

        :param str category: the category that this document will belong to
        :param str document_identifier: the unique identifier for the document
        :param str doc: The body of the message
        :return: if indexes returns true, false otherwise
        :rtype: boolean
        :raises ValueError: if category and document_identifier is not a string
    '''
    def index_document(self, category, document_identifier, doc):
        if type(category) != str:
            raise ValueError('category must be a string')

        if type(document_identifier) != str:
            raise ValueError('document_identifier must be a string')


        url = self.base_url + category + '/' + document_identifier
        payload = json.dumps(doc)
        headers = {
            'content-type': 'application/json'
        }
        request = requests.put(url, data = payload, headers = headers)

        status_code = request.status_code

        # if status code is greater than 201 it means the request failed
        if status_code > 201:
            return False

        # if otherwise always return true indicating that it was successful
        return True

    '''
        Deletes a document using an identifier in elasticsearch from given category in the index

        :param str category: the category that this document will belong to
        :param str document_identifier: the unique identifier for the document
        :return: if delete is successful returns true, false otherwise
        :rtype: boolean
        :raises ValueError: if category and document_identifier is not a string
    '''
    def delete_document(self, category, document_identifier):
        if type(category) != str:
            raise ValueError('category must be a string')

        if type(document_identifier) != str:
            raise ValueError('document_identifier must be a string')

        url = self.base_url + category + '/' + document_identifier
        
        request = requests.delete(url)

        status_code = request.status_code

        # if status code is greater than 201 it means the request failed
        if status_code > 201:
            return False

        # if otherwise always return true indicating that it was successful
        return True
    
    '''
        serches a document using a query string in elasticsearch from given category in the index

        :param str category: the category that this document will belong to
        :param str query_string: the string with which the index is searched
        :param int num_int: the number of hits that elastic search returns
        :return: json response from the elasticsearch server converted into a dictionary
        :rtype: dict
        :raises ValueError: if category and query_string is not a string
    '''
    def search(self, category, query_string, num_hits):
        if type(category) != str:
            raise ValueError('category must be a string')

        if type(query_string) != str:
            raise ValueError('query_string must be a string')
        
        if type(num_hits) != int:
            raise ValueError('num_hits must be an int')

        num_hits = str(num_hits)

        url = self.base_url + category + '/' + '_search?' + 'size=' + num_hits + '&q=' + query_string
        request = requests.get(url)
        return request.json()

    '''
        retrieves a document using a document identifier in elasticsearch from given category in the index

        :param str category: the category that this document will belong to
        :param str document_identifier: the identifier with which the index is searched
        :return: json response from the elasticsearch server
        :rtype: dict
        :raises ValueError: if category and document_identifier is not a string
    '''
    def get_document(self, category, document_identifier):
        if type(category) != str:
            raise ValueError('category must be a string')

        if type(document_identifier) != str:
            raise ValueError('document_identifier must be a string')

        url = self.base_url + category + '/' + document_identifier

        request = requests.get(url)

        return request.json()
    '''
        deletes an existing index from the elastic search servers

        :return: returns true if the deletion is successful, false otherwise
        :rtype: boolean
    '''
    def delete_index(self):
        request = requests.delete(self.base_url)
        
        status_code = request.status_code

        # if status code is greater than 201 this means the request was not successful
        if status_code > 201:
            return False

        # otherwise the removal was succesful
        return True