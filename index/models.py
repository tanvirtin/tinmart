from mongoengine import Document, StringField, DictField, FloatField, ListField

# model responsible for interacting with crawler_documents collection in walmartcrawler database in mongodb
class CrawlerDocument(Document):
    docId = StringField()
    url = StringField()
    title = StringField()
    price = FloatField()
    category = StringField()
    productImgUrl = StringField()
    date = StringField()
    metadata = DictField()

# model responsible for interacting with transactions collection in tinmart database in mongodb
class Transaction(Document):
    transactionId = StringField()
    products = ListField()
