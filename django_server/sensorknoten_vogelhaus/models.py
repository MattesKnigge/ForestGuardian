import uuid
from django.db import models
from django.utils import timezone


# Um die Measured Parameters zur Location zu bekommen einfach Location.MeasuredParameter_set.all()
class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=256, unique=True)
    longitude = models.FloatField(default=-1, blank=False)
    latitude = models.FloatField(default=-1, blank=False)

    def __str__(self):
        return f'{self.name} + {self.longitude}/{self.latitude}'


class Sensor(models.Model):
    name = models.CharField(max_length=256, unique=True)
    description = models.CharField(max_length=1024, unique=False)

    def __str__(self):
        return self.name


class Parameter(models.Model):
    name = models.CharField(max_length=256)
    description = models.CharField(max_length=1024, unique=False)
    unit = models.CharField(max_length=8, unique=False)

    def __str__(self):
        return f'{self.name} [{self.unit}] ({self.description[:20]}...)'


class MeasuredParameter(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='loc_mp')
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE)
    parameter = models.ForeignKey(Parameter, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.location.name} {self.parameter.name} {self.sensor.name}'


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
