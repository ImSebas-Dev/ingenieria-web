from django.urls import path
from .views import CancionListView, CancionDetailView, open

urlpatterns = [
    path('', open, name="open"),
    path('api/canciones/', CancionListView.as_view(), name="cancion_list"),
    path('api/canciones/<slug:slug>/', CancionDetailView.as_view(), name="cancion_detail"),
]