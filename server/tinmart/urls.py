from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # delegates any path with 'accounts/' to url file in accounts app
    path('accounts/', include('accounts.urls'))
]
