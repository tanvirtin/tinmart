from django.contrib import admin
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

# import the views responsible for that routing logic
from search import views

urlpatterns = [
    # path to query and get the items with the search term
    path('<str:term>', views.Search.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
