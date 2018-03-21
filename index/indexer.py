from models import CrawlerDocument
from mongoengine import connect
from threading import Thread
from elasticsearchcli import ElasticSearchCli

'''
    Class is responsible for managing the index
'''
class IndexController(object):
    def __init__(self):
        # when the object is instantiated connect to the walmartcrawler database in mongodb
        connect('walmartcrawler')

    def __create_lucene_dict(self, crawler_document):
        return {
            'docId': crawler_document.docId,
            'title': crawler_document.title,
            'description': crawler_document.description,
            'features': crawler_document.features,
            'category': crawler_document.category,
            'price': crawler_document.price,
            'text': crawler_document.text,
            'tags': crawler_document.tags
        }

    def index_crawled_documents(self):
        crawler_documents = CrawlerDocument.objects
        for crawler_document in crawler_documents:
            lucene_document = self.__create_lucene_dict(crawler_document)
