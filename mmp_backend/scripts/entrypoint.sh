#!/bin/sh

# Wait for DB
/wait-for-it.sh db:5432 --timeout=30 --strict -- echo "Postgres is up"

# Migrate DB
echo "Running Django migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Execute CMD
exec "$@"
