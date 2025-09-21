from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import ContactameForm

def contactame(request):
    if request.method == 'POST':
        form = ContactameForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, '¡Mensaje enviado correctamente! Te contactaré pronto.')
            return redirect('contactame')
        else:
            messages.error(request, 'Por favor, corrige los errores en el formulario.')
    else:
        form = ContactameForm()
    
    return render(request, 'pages/contactame.html', {'form': form})