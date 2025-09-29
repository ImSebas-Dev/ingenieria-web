from rest_framework import generics
from .models import FAQ
from .serializers import FAQSerializer
from django.shortcuts import render

# Vista API (para el JS)
class FAQListAPIView(generics.ListAPIView):
    queryset = FAQ.objects.filter(is_active=True).order_by("order")
    serializer_class = FAQSerializer

# Vista plantilla HTML
def fyq(request):
    return render(request, 'pages/fyq.html')