import os
import subprocess
import random
import string
import requests
from celery import shared_task
from django.conf import settings
from .models import Movie

TMDB_API_KEY = os.getenv('TMDB_API_KEY')

def generate_random_suffix(length=6):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@shared_task
def process_movie(movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
        input_path = movie.video_file.path
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        unique_suffix = generate_random_suffix()
        safe_base = f"{base_name}_{unique_suffix}"

        # 1. Fetch TMDB Thumbnail
        search_url = f"https://api.themoviedb.org/3/search/movie"
        params = {
            "api_key": TMDB_API_KEY,
            "query": movie.title,
        }
        response = requests.get(search_url, params=params)
        poster_url = None

        if response.status_code == 200 and response.json()["results"]:
            poster_path = response.json()["results"][0]["poster_path"]
            poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}"

            # Download and save locally
            if poster_url:
                thumb_name = f"{safe_base}_thumb.jpg"
                thumb_path = os.path.join(settings.MEDIA_ROOT, "thumbnails", thumb_name)
                os.makedirs(os.path.dirname(thumb_path), exist_ok=True)

                img_res = requests.get(poster_url)
                with open(thumb_path, "wb") as f:
                    f.write(img_res.content)

                movie.thumbnail.name = f"thumbnails/{thumb_name}"

        # 2. Generate HLS
        hls_dir = os.path.join(settings.MEDIA_ROOT, "hls", safe_base)
        os.makedirs(hls_dir, exist_ok=True)
        hls_path = os.path.join(hls_dir, "index.m3u8")

        subprocess.run([
            "ffmpeg", "-i", input_path,
            "-codec:", "copy", "-start_number", "0",
            "-hls_time", "10", "-hls_list_size", "0",
            "-f", "hls", hls_path
        ], check=True)

        movie.hls_playlist = f"hls/{safe_base}/index.m3u8"
        movie.is_processed = True
        movie.save()

    except Exception as e:
        print(f"[ERROR] Processing movie ID {movie_id}: {e}")
        raise
