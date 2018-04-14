from mongoengine import Document, StringField, DictField, FloatField

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