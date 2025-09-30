from django.db import models

# Create your models here.
class Contactame(models.Model):
    ASUNTO_CHOICES = [
        ('trabajo', 'Oferta de Trabajo'),
        ('proyecto', 'Propuesta de Proyecto'),
        ('consulta', 'Consulta'),
        ('otro', 'Otro'),
    ]

    nombre = models.CharField(max_length=100, verbose_name="Nombre completo")
    email = models.EmailField(verbose_name="Correo electrónico")
    phone = models.TextField(max_length=20, blank=True, null=True, verbose_name="Teléfono")
    asunto = models.CharField(max_length=20, choices=ASUNTO_CHOICES, verbose_name="Asunto")
    mensaje = models.TextField(verbose_name="Mensaje")
    fecha_envio = models.DateTimeField(auto_now_add=True, verbose_name="Fecha de envío")
    leido = models.BooleanField(default=False, verbose_name="Leído")

    class Meta:
        verbose_name = "Mensaje de Contacto"
        verbose_name_plural = "Mensajes de Contacto"
        ordering = ['-fecha_envio']

    def __str__(self):
        return f"{self.nombre} - {self.asunto}"