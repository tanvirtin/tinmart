from model import CrawlerDocument
from mongoengine import connect
from threading import Thread

class Indexer(object):
    def __init__(self):
        # when the object is instantiated connect to the walmartcrawler database in mongodb
        connect('walmartcrawler')

    def indexCrawledDocuments(self):
        crawler_documents = CrawlerDocument.objects

        for crawler_document in crawler_documents:
            print(crawler_document.docId)