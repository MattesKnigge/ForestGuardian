import uuid
from django.db import models
from django.utils import timezone


# Um die Measured Parameters zur Location zu bekommen einfach Location.MeasuredParameter_set.all()
class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=256, unique=True)
    longitude = models.FloatField(default=-100, blank=False)
    latitude = models.FloatField(default=-100, blank=False)
    display_name = models.CharField(max_length=256, unique=False)
    description = models.CharField(max_length=512, unique=False)

    def __str__(self):
        return f'{self.name} {self.longitude}/{self.latitude}'


class Parameter(models.Model):
    name = models.CharField(max_length=256)
    description = models.CharField(max_length=1024, unique=False)
    unit = models.CharField(max_length=8, unique=False)
    display_name = models.CharField(max_length=256, unique=False)

    def __str__(self):
        return f'{self.name} ({self.display_name}) [{self.unit}] ({self.description[:20]}...)'


class MeasuredParameter(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='loc_mp')
    parameter = models.ForeignKey(Parameter, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.location.name} {self.parameter.name}'


class SensorValue(models.Model):
    created_at = models.DateTimeField(default=timezone.now)
    value = models.FloatField(blank=False)
    measuredParameter = models.ForeignKey(MeasuredParameter, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.measuredParameter.location.name} {self.measuredParameter.parameter.name}: {self.value} {self.created_at.strftime("%d.%m.%Y %H:%M:%S")}'


class ParameterRange(models.Model):
    parameter = models.ForeignKey(Parameter, on_delete=models.CASCADE)
    lower_bound = models.FloatField(blank=False)
    description = models.CharField(max_length=512, unique=False)
    tag = models.CharField(max_length=32, unique=False)
    color = models.CharField(max_length=16, unique=False)

    def __str__(self):
        return f'{self.parameter.name} {self.lower_bound} ({self.tag}) ({self.color}): {self.description}'


class LocationImage(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    image = models.ImageField()


class WeatherData(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    weather = models.CharField(max_length=64, unique=False)
    weather_description = models.CharField(max_length=128, unique=False)
    wind_speed = models.FloatField()

    def __str__(self):
        return f'{self.location.name} {self.created_at} {self.weather}'
