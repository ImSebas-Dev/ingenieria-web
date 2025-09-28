from rest_framework import serializers
from .models import Cancion

class CancionSerializer(serializers.ModelSerializer):
    keywords = serializers.SerializerMethodField()
    category = serializers.CharField(source="get_genre_display", read_only=True)  # Para tu filtro de categorías

    class Meta:
        model = Cancion
        fields = ["id", "title", "artist", "album", "cover_image", "genre", "category", "duration", "keywords", "slug"]

    def get_keywords(self, obj):
        return obj.keywords_list()