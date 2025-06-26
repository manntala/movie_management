from django.db import models


class Movie(models.Model):
    CATEGORY_CHOICES = [
        ('action', 'Action'),
        ('drama', 'Drama'),
        ('comedy', 'Comedy'),
        ('horror', 'Horror'),
        ('sci-fi', 'Sci-Fi'),
        ('documentary', 'Documentary'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)
    video_file = models.FileField(upload_to='videos/')
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    hls_playlist = models.CharField(max_length=512, null=True, blank=True)  # path to .m3u8 file
    is_processed = models.BooleanField(default=False)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='action')

    def __str__(self):
        return self.title

    @property
    def thumbnail_url(self):
        return self.thumbnail.url if self.thumbnail else ""

    @property
    def hls_url(self):
        if self.hls_playlist:
            return f"/media/{self.hls_playlist}"
        return ""
