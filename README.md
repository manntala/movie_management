## 1. MOVIE MANAGEMENT PLATFORM

A full-stack web application for managing movies with video file upload, automatic thumbnail generation.

- **Backend**: Python, Django, Django REST Framework, Celery, Redis, PostgreSQL
- **Frontend**: ReactJS (Vite), Bootstrap
- **Others**: Docker, Docker Compose, JWT Auth, ffmpeg (for media processing), TMDB API

## 2. CLONE INSTRUCTION

git clone https://github.com/manntala/movie_management.git
cd movie-management-platform

## 3. ENVIRONMMENT VARIABLES
 Create a .env file in the root of mmp_backend/ with the following variables:

DJANGO_SECRET_KEY=
DJANGO_DEBUG=True

DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
CELERY_REDIS_URL=redis://redis:6379/0
CELERY_RESULT_BACKEND=redis://redis:6379/0

TMDB_API_KEY=("I WILL BE PROVIDING THIS VIA EMAIL")

You may also create and account here:
https://www.themoviedb.org/

and generate your API KEY here:
https://www.themoviedb.org/settings/api

## 4. RUN THE FULLSTACK WITH DOCKER
docker-compose up --build
This starts:
Django backend (on port 8000)
React frontend (on port 5173)
PostgreSQL DB
Redis
Celery worker & beat

## 5. Manual Setup (OPTIONAL/NOT RECOMMENDED)
cd mmp_backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

cd mmp_frontend
npm install
npm run dev

## 6. LIMITATION
### One of the limitation that I have noticed and have not fixed yet is the timeout for the thumbnail.
It should be able to load the thumbnail without refreshing the page.

### Sometimes it would take couple more seconds before the correct thumbnails are loaded.


## 7. SHORT VIDEO DEMO
https://drive.google.com/file/d/1z_ytt_J2JutFM4s8kTseAKc_MK0LDxSY/view?usp=sharing