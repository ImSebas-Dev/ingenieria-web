from django.shortcuts import render

# Create your views here.
def cv(request):
    return render(request, 'pages/cv.html')