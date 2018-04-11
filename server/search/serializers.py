from rest_framework import serializers
from rest_framework_mongoengine.serializers import DocumentSerializer

# the error python object also needs to be serialized into a JSON object
from .error import Error

# import the mongodb database model
from .models import CrawlerDocument

# syntax taken from -> http://www.django-rest-framework.org/api-guide/serializers/
# this is not a model serializer but only a python object serializer
class ErrorSerializer(serializers.Serializer):
    status = serializers.IntegerField()
    message = serializers.CharField()


class CrawlerDocumentSerializer(DocumentSerializer):
    class Meta:
        model = CrawlerDocument
        fields = '__all__'
