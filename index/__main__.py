from crawler_document_indexer import IndexController
from transaction_indexer import TransactionIndexer

'''
    NOTE - MAKE SURE TO CHECK THAT YOU HAVE ENOUGH SPACE TO INDEX ALL THE DOCUMENTS
'''
def main():
    indexer = IndexController()
    indexer.delete_index()
    indexer.index_crawled_documents()

if __name__ == '__main__':
    main()