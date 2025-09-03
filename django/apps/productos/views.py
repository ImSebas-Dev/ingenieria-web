from rest_framework import generics
from .models import Producto
from .serializers import ProductoSerializer

class ProductoListView(generics.ListAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer