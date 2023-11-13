import datetime
import time
import random

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Location, MeasuredParameter, SensorValue


@api_view(['GET'])
def get_locations(request):
    data = [loc.name for loc in Location.objects.all()]
    data.append('random')
    return Response(data)


@api_view(['GET'])
def get_location(request, location_name: str):
    if location_name == "random":
        data = {
            'temperature': {
                'id': 'random_temperature',
                'timestamp': datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S"),
                'value': random.randint(-25, 42),
                'min': -25,
                'max': 42,
            },
            'humidity': {
                'id': 'random_humidity',
                'timestamp': datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S"),
                'value': random.randint(0, 100),
                'min': 0,
                'max': 100,
            },
            'air_quality': {
                'id': 'random_airQuality',
                'timestamp': datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S"),
                'value': random.randint(400, 60000),
                'min': 400,
                'max': 60000,
            },
            'pressure': {
                'id': 'random_pressure',
                'timestamp': datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S"),
                'value': random.randint(800, 1100),
                'min': 800,
                'max': 1100,
            },
        }
    else:
        data = {}
        location = Location.objects.get(name=location_name)
        measured_params = MeasuredParameter.objects.filter(location=location).prefetch_related('parameter').all()
        for mp in measured_params:
            sv = SensorValue.objects.filter(measuredParameter=mp).latest('created_at')
            data[mp.parameter.name] = {
                'id': mp.id,
                'timestamp': sv.created_at,
                'value': sv.value,
                'min': mp.parameter.min,
                'max': mp.parameter.max,
            }

    return Response(data)


@api_view(['GET'])
def get_measured_parameter_details(request, measured_parameter_id: str):
    if measured_parameter_id.startswith('random'):
        param = measured_parameter_id.split('_')
        min_max = {'temperature': {'min': -25, 'max': 42}, 'humidity': {'min': 0, 'max': 100},
                   'pressure': {'min': 800, 'max': 1100}, 'airQuality': {'min': 400, 'max': 60000}}
        mm = min_max.get(param[1])
        timestamps = [datetime.datetime.now() - datetime.timedelta(days=20 - i) for i in range(20)]
        data = {
            'name': param[1],
            'sensor': 'Random Sensor',
            'parameter_description': 'Random Sensor Description',
            'sensor_description': 'Random Parameter Description',
            'values': [{'timestamp': time.mktime(timestamps[idx].timetuple())*1000, 'value': v} for idx, v in enumerate([random.randint(mm['min'], mm['max']) for i in range(20)])]
        }
    else:

        mp = MeasuredParameter.objects.select_related('parameter', 'sensor').get(id=measured_parameter_id)
        values = SensorValue.objects.filter(measuredParameter=mp).all()  # how many is max count?
        data = {
            'name': mp.parameter.name,
            'sensor': mp.sensor.name,
            'parameter_description': mp.parameter.description,
            'sensor_description': mp.sensor.description,
            'values': [{'timestamp': time.mktime(v.created_at.timetuple())*1000, 'value': v.value} for v in values]
        }

    return Response(data)


@swagger_auto_schema(request_body=openapi.Schema(
    type=openapi.TYPE_OBJECT,
), method='POST')
@api_view(['POST'])
def post_location_data(request):
    print(request.data)
    return Response(status=status.HTTP_200_OK)
