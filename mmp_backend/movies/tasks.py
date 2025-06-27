import os
import re
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

def extract_year_from_description(description):
    match = re.search(r'(19|20)\d{2}', description or "")
    return match.group() if match else None

@shared_task
def process_movie(movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
        input_path = movie.video_file.path
        base_name = os.path.splitext(os.path.basename(input_path))[0]
        unique_suffix = generate_random_suffix()
        safe_base = f"{base_name}_{unique_suffix}"

        # 1. Extract release year
        release_year = extract_year_from_description(movie.description)
        print(f"[TMDB] Extracted release year: {release_year}")

        # 2. Search TMDb thumbnail
        search_url = "https://api.themoviedb.org/3/search/movie"
        poster_url = None

        def tmdb_search(params):
            try:
                res = requests.get(search_url, params=params, timeout=10)
                if res.status_code == 200:
                    return res.json().get("results", [])
                print(f"[TMDB] Search failed with status {res.status_code}")
            except Exception as err:
                print(f"[TMDB] Request error: {err}")
            return []

        params = {
            "api_key": TMDB_API_KEY,
            "query": movie.title,
        }

        results = tmdb_search({**params, "year": release_year}) if release_year else tmdb_search(params)
        if not results and release_year:
            print("[TMDB] No results with year, retrying without year...")
            results = tmdb_search(params)

        if results:
            poster_path = results[0].get("poster_path")
            if poster_path:
                poster_url = f"https://image.tmdb.org/t/p/w500{poster_path}"
                print(f"[TMDB] Found poster: {poster_url}")

        if poster_url:
            thumb_name = f"{safe_base}_thumb.jpg"
            thumb_path = os.path.join(settings.MEDIA_ROOT, "thumbnails", thumb_name)
            os.makedirs(os.path.dirname(thumb_path), exist_ok=True)

            img_res = requests.get(poster_url, timeout=10)
            with open(thumb_path, "wb") as f:
                f.write(img_res.content)

            movie.thumbnail.name = f"thumbnails/{thumb_name}"
        else:
            print(f"[TMDB] No thumbnail found for '{movie.title}' ({release_year})")

        # 3. Generate HLS
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

        print(f"[PROCESS MOVIE] Completed processing for: {movie.title}")

    except Exception as e:
        print(f"[ERROR] Processing movie ID {movie_id}: {e}")
        raise
