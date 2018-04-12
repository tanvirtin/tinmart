from indexer import IndexController

'''
    NOTE - MAKE SURE TO CHECK THAT YOU HAVE ENOUGH SPACE TO INDEX ALL THE DOCUMENTS
'''
def main():
    indexer = IndexController()
    indexer.delete_index()
    indexer.index_crawled_documents()

if __name__ == '__main__':
    main()