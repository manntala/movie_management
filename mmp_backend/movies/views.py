from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission, SAFE_METHODS
from django.contrib.auth.models import User

from .models import Movie
from .serializers import MovieSerializer, RegisterSerializer
from .tasks import process_movie


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response


class ReadOnlyOrAuthenticated(BasePermission):
    """
    Allows unrestricted read-only access (GET, HEAD, OPTIONS),
    but restricts write access (POST, PUT, PATCH, DELETE) to authenticated users.
    """
    def has_permission(self, request, view):
        return (
            request.method in SAFE_METHODS or 
            request.user and request.user.is_authenticated
        )


class MovieListCreateView(generics.ListCreateAPIView):
    """
    GET: Public movie listing  
    POST: Authenticated users can create new movies
    """
    queryset = Movie.objects.all().order_by("-date_added")
    serializer_class = MovieSerializer
    permission_classes = [ReadOnlyOrAuthenticated]

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_create(self, serializer):
        movie = serializer.save()
        if movie.video_file:
            process_movie.delay(movie.id)


class MovieRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Anyone can retrieve a movie  
    PATCH/PUT/DELETE: Only authenticated users
    """
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        """
        Customize permissions:
        - Allow unauthenticated users to view (GET)
        - Require auth for edit/delete
        """
        if self.request.method in SAFE_METHODS:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_serializer_context(self):
        return {"request": self.request}

    def perform_update(self, serializer):
        """
        If the video file is updated OR title changed and there's no thumbnail,
        trigger async processing.
        """
        video_updated = bool(self.request.FILES.get("video_file"))
        title_updated = "title" in self.request.data

        movie = serializer.save()

        if video_updated or (title_updated and not movie.thumbnail):
            process_movie.delay(movie.id)


class RegisterView(generics.CreateAPIView):
    """
    Allows public user registration.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response({"authenticated_user": request.user.username})
