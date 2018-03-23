from models import CrawlerDocument
from mongoengine import connect
from threading import Thread, Lock
from elasticsearchcli import ElasticSearchCli
import logging

logging.basicConfig(level = logging.DEBUG)

'''
    Class is responsible for managing the index
'''
class IndexController(object):
    def __init__(self):
        # when the object is instantiated connect to the walmartcrawler database in mongodb
        connect('walmartcrawler')
        self.index_name = 'tinmart'
        self.elasticsearchcli = ElasticSearchCli(self.index_name)
        self.lock = Lock()
        self.num_doc_indexed = 0

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

    def get_num_doc_indexed(self):
        return self.num_doc_indexed


    def __add_document(self, crawler_document):
        lucene_document = self.__create_lucene_dict(crawler_document)
        docId = str(lucene_document['docId'])
        status = self.elasticsearchcli.index_document('products', docId, lucene_document)
        
        if status:
            logging.debug('Document -> {} indexed...'.format(docId))

            # lock the variable and increment it
            self.lock.acquire()
            self.num_doc_indexed += 1
            self.lock.release();
  
    '''
        Indexes all the documents in mongodb in a multithreaded fashion
    '''
    def index_crawled_documents(self):
        crawler_documents = CrawlerDocument.objects
        for crawler_document in crawler_documents:
            # create the thread passing in the method which indexes lucene
            thread = Thread(target = self.__add_document, args = (crawler_document, ))
            thread.start()
        

    '''
        Deletes an index from the database
    '''
    def delete_index(self):
        logging.debug('Index {} removed...'.format(self.index_name))
        status = self.elasticsearchcli.delete_index()