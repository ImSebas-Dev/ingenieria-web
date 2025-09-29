from django.urls import path
from .views import fyq, FAQListAPIView

urlpatterns = [ 
    path("", fyq, name="faq"),
    path("api/faqs", FAQListAPIView.as_view(), name="faq-api"),
]