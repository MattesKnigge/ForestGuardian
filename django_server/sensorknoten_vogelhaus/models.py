import uuid
from django.db import models
from django.utils import timezone


# Um die Measured Parameters zur Location zu bekommen einfach Location.MeasuredParameter_set.all()
class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.name


class Sensor(models.Model):
    name = models.CharField(max_length=256, unique=True)
    description = models.CharField(max_length=1024, unique=False)

    def __str__(self):
        return self.name


class Parameter(models.Model):
    name = models.CharField(max_length=256)
    description = models.CharField(max_length=1024, unique=False)
    min = models.FloatField(blank=False)
    max = models.FloatField(blank=False)
    lower_good_bound = models.FloatField(blank=False)
    upper_good_bound = models.FloatField(blank=False)

    def __str__(self):
        return self.name


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
    value = models.FloatField(blank=False)
    description = models.CharField(max_length=512, unique=False)

    def __str__(self):
        return f'{self.parameter.name} {self.value}: {self.description}'
