from mongoengine import Document, IntField, StringField, ListField, DictField, FloatField

# model responsible for interacting with crawler_documents collection in walmartcrawler databse in mongodb
class CrawlerDocument(Document):
    docId = StringField()
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