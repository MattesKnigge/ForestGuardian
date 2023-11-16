from django.contrib import admin
from .models import Location, Sensor, Parameter, MeasuredParameter, SensorValue

# Register your models here.
admin.site.register(Location)
admin.site.register(Sensor)
admin.site.register(Parameter)
admin.site.register(MeasuredParameter)
admin.site.register(SensorValue)
