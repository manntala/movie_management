from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from .models import Movie

class MovieSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    hls_url = serializers.SerializerMethodField()

    class Meta:
        model = Movie
        fields = ['id', 'title', 'description', 'video_file', 'thumbnail_url', 'hls_url', 'is_processed', 'date_added', 'category']

    def get_thumbnail_url(self, obj):
        request = self.context.get("request")
        if obj.thumbnail and request:
            return request.build_absolute_uri(obj.thumbnail.url)
        return None

    def get_hls_url(self, obj):
        request = self.context.get("request")
        if obj.hls_playlist and request:
            return request.build_absolute_uri(f"/media/{obj.hls_playlist}")
        return None
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if self.context.get("request") and self.context["request"].method in ["PATCH", "PUT"]:
            for field in self.fields.values():
                field.required = False
    

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
    

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        return token

