from django.contrib import admin
from .models import Location, Parameter, MeasuredParameter, SensorValue, ParameterRange, LocationImage

# Register your models here.
admin.site.register(Location)
admin.site.register(Parameter)
admin.site.register(MeasuredParameter)
admin.site.register(SensorValue)
admin.site.register(ParameterRange)
admin.site.register(LocationImage)
