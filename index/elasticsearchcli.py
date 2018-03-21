import requests
import json

'''
    Class is responsible CRUD procedures on elastic search
'''
class ElasticSearchCli(object):
    def __init__(self, index_name):
        self.index_name = index_name
