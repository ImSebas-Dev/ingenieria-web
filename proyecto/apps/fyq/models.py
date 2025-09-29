from django.db import models

class FAQ(models.Model):
    question = models.CharField(max_length=255, verbose_name="Pregunta")
    answer = models.TextField(verbose_name="Respuesta")
    order = models.PositiveIntegerField(default=0, help_text="Orden en el que aparecerá la pregunta")
    is_active = models.BooleanField(default=True, verbose_name="Activa")

    class Meta:
        ordering = ["order", "id"]
        verbose_name = "Pregunta frecuente"
        verbose_name_plural = "Preguntas frecuentes"

    def __str__(self):
        return self.question