from rest_framework import generics
from .models import Cancion
from .serializers import CancionSerializer
from django.shortcuts import render

# Lista + crear
class CancionListView(generics.ListAPIView):
    queryset = Cancion.objects.all().order_by("-created_at")
    serializer_class = CancionSerializer

# Detalle
class CancionDetailView(generics.RetrieveAPIView):
    queryset = Cancion.objects.all()
    serializer_class = CancionSerializer
    lookup_field = "slug"

def open(request):
    return render(request, "pages/open.html", {})