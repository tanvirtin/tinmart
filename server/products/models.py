from mongoengine import Document, StringField, IntField, DictField, FloatField, ListField

# model responsible for interacting with crawler_documents collection in walmartcrawler database in mongodb
class CrawlerDocument(Document):
    docId = IntField()
    url = StringField()
    title = StringField()
    price = FloatField()
    category = StringField()
    productImgUrl = StringField()
    date = StringField()
    metadata = DictField()

    meta = {'db_alias': 'fillmyfridge'}

# model responsible for interacting with transaction collection in 
class Transaction(Document):
    transactionId = StringField()
    products = ListField()
    
    meta = {'db_alias': 'tinmart'}