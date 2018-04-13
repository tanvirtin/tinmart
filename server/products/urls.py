from django.contrib import admin
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

# import the views responsible for that routing logic
from search import views

urlpatterns = [
    # path to get a specific document using a specified product id
    path('<str:product_id>', views.Product.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
