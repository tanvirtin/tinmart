from rest_framework import serializers

# the error python object also needs to be serialized into a JSON object
from .error import Error

# syntax taken from -> http://www.django-rest-framework.org/api-guide/serializers/
# this is not a model serializer but only a python object serializer
class ErrorSerializer(serializers.Serializer):
    status = serializers.IntegerField()
    message = serializers.CharField()
