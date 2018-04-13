from django.contrib import admin
from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

# import the views responsible for that routing logic
from products import views

urlpatterns = [
    # path to post a transaction or purchase, this path needs to be first because of the ambigioty of the second path
    path('purchase', views.Purchase.as_view()),
    # path to get a specific document using a specified product id
    path('<str:product_id>', views.Product.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)
