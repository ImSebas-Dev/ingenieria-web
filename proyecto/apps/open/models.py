from django.db import models
from django.utils.text import slugify

class Cancion(models.Model):
    GENRE_CHOICES = [
        ('pop', 'Pop'),
        ('rock', 'Rock'),
        ('jazz', 'Jazz'),
        ('classical', 'Clásica'),
        ('electronic', 'Electrónica'),
        ('hiphop', 'Hip Hop'),
        ('reggaeton', 'Reggaeton'),
        ('latin', 'Latina'),
        ('other', 'Otro'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Título")
    artist = models.CharField(max_length=100, verbose_name="Artista")
    album = models.CharField(max_length=100, verbose_name="Álbum", blank=True, null=True)
    cover_image = models.CharField(verbose_name="Imagen de portada", default="https://via.placeholder.com/150")
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES, verbose_name="Género")
    duration = models.DurationField(verbose_name="Duración", blank=True, null=True)
    keywords = models.CharField(max_length=255, help_text="Palabras clave separadas por comas", verbose_name="Palabras clave")
    slug = models.CharField(max_length=220, unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)[:220]
        super().save(*args, **kwargs)

    def keywords_list(self):
        return [k.strip() for k in self.keywords.split(",") if k.strip()]

    def __str__(self):
        return f"{self.title} - {self.artist}"
