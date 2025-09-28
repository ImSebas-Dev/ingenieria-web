from django.urls import path
from . import views

urlpatterns = [ 
    path("", views.fyq, name="faq"),
]