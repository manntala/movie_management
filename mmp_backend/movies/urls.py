from django.urls import path
from .views import MovieListCreateView, MovieRetrieveUpdateDeleteView, RegisterView, test_token

urlpatterns = [
    path('movies/', MovieListCreateView.as_view(), name='movie-list-create'),
    path('movies/<int:pk>/', MovieRetrieveUpdateDeleteView.as_view(), name='movie-detail'),
    path('register/', RegisterView.as_view(), name='register'),
    path("test-token/", test_token, name="test-token"),
]
