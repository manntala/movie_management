from rest_framework import generics
from .models import Movie
from django.contrib.auth.models import User

from .serializers import MovieSerializer, RegisterSerializer
from .tasks import process_movie


class MovieListCreateView(generics.ListCreateAPIView):
    queryset = Movie.objects.all().order_by("-date_added")
    serializer_class = MovieSerializer

    def perform_create(self, serializer):
        movie = serializer.save()
        if movie.video_file:
            process_movie.delay(movie.id)

    def get_serializer_context(self):
        return {"request": self.request}


class MovieRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def perform_update(self, serializer):
        video_updated = bool(self.request.FILES.get("video_file"))
        title_updated = "title" in self.request.data

        movie = serializer.save()

        if video_updated or (title_updated and not movie.thumbnail):
            process_movie.delay(movie.id)

    def get_serializer_context(self):
        return {"request": self.request}


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer