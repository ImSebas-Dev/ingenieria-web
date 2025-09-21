from django.urls import path
from . import views

urlpatterns = [ 
    path("contactame", views.contactame, name="contactame"),
]