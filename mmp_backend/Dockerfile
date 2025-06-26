FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

# Copy scripts first to a dedicated location
COPY scripts/entrypoint.sh /entrypoint.sh
COPY wait-for-it.sh /wait-for-it.sh

RUN chmod +x /entrypoint.sh /wait-for-it.sh

ENTRYPOINT ["/entrypoint.sh"]

# System packages including ffmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    gcc \
    libpq-dev \
    && apt-get clean

COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy project last to /app (won’t affect /entrypoint.sh)
COPY . .

RUN mkdir -p /app/media /app/static
