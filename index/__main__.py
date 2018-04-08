from indexer import IndexController

def main():
    indexer = IndexController()
    indexer.delete_index()
    indexer.index_crawled_documents()
    num_indexed_docs = indexer.get_num_doc_indexed()
    print('Number of documents indexed -> {}'.format(num_indexed_docs))

if __name__ == '__main__':
    main()