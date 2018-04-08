from indexer import IndexController

def main():
    indexer = IndexController()
    indexer.delete_index()
    indexer.index_crawled_documents()

if __name__ == '__main__':
    main()