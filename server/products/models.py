from mongoengine import Document, IntField, StringField, ListField, DictField, FloatField

# model responsible for interacting with crawler_documents collection in walmartcrawler databse in mongodb
class CrawlerDocument(Document):
    docId = StringField()
    url = StringField()
    title = StringField()
    description = StringField()
    features = ListField()
    category = StringField()
    subCategories = ListField()
    price = FloatField()
    date = StringField()
    text = StringField()
    metadata = DictField()
    links = ListField()
    tags = ListField()
    productImgUrls = ListField()
    allImgUrls = ListField()