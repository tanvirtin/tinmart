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
        self.base_url = 'http://localhost:9200/'

    '''
        Indexes a given document in elasticsearch to a given category in the index
        If indexing is successful returns True, false otherwise
    '''
    def index_document(self, category, doc):
        document_identifier = str(doc['docId']
        url = self.base_url + self.index_name + '/' + category + '/' + document_identifier)
        payload = json.dumps(doc)
        headers = {'content-type': 'application/json'}
        r = requests.put(url, data = payload, headers = headers)

        status_code = r.status_code

        if status_code != 201:
            return False

        return True        