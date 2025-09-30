from django import forms
from django.core.validators import RegexValidator
from .models import Contactame

class ContactameForm(forms.ModelForm):
    # Definir opciones para el campo 'asunto'
    ASUNTO_OPCIONES = [
        ('', 'Seleccione un asunto'),
        ('trabajo', 'Oferta de Trabajo'),
        ('proyecto', 'Propuesta de Proyecto'),
        ('consulta', 'Consulta'),
        ('otro', 'Otro'),
    ]

    # Campos del formulario
    nombre = forms.CharField(
        max_length=100,
        required=True,
        widget=forms.TextInput(attrs={
            'id': 'name',
            'placeholder': 'Juanito Alimaña',
            'required': 'required'
            }),
        label='Nombre completo *'
    )

    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'id': 'email',
            'placeholder': 'juanito@gmail.com',
            'required': 'required'
            }),
        label='Correo electrónico *'
    )

    phone = forms.CharField(
        max_length=20,
        required=True,
        validators=[RegexValidator(
            regex=r'^\d{10}$',
            message='Formato de teléfono inválido. Use 10 dígitos sin espacios ni guiones.'
        )],
        widget=forms.TextInput(attrs={
            'id': 'phone',
            'placeholder': '3001234567',
            'type': 'tel'
        }),
        label='Teléfono'
    )

    asunto = forms.ChoiceField(
        choices=ASUNTO_OPCIONES,
        required=True,
        widget=forms.Select(attrs={
            'id': 'subject',
            'required': 'required'
        }),
        label='Asunto *'
    )

    mensaje = forms.CharField(
        required=True,
        widget=forms.Textarea(attrs={
            'id': 'message',
            'placeholder': 'Escribe aquí tu mensaje...',
            'rows': 5,
            'required': 'required'
        }),
        label='Mensaje *'
    )

    class Meta:
        model = Contactame
        fields = ['nombre', 'email', 'phone', 'asunto', 'mensaje']