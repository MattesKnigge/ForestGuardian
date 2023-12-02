import datetime
import random
import requests

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Location, MeasuredParameter, SensorValue, ParameterRange, WeatherData
from .utils import get_current_season


@api_view(['GET'])
def locations(request):
    data = [loc.name for loc in Location.objects.all()]
    data.append('random')
    return Response(data)


@api_view(['GET'])
def location(request, location_name: str):
    data = {
        'season': get_current_season(),
        'weather': {},
        'values': {},
    }

    if location_name == "random":
        location = Location.objects.get(name='prototype')

        weather = WeatherData.objects.filter(location=location).latest('created_at')
        data['weather'] = {
            'name': weather.weather,
            'description': weather.weather_description,
            'wind_speed': weather.wind_speed,
        }

        measured_params = MeasuredParameter.objects.filter(location=location).prefetch_related('parameter').all()
        for mp in measured_params:
            param_ranges = list(ParameterRange.objects.filter(parameter=mp.parameter).order_by('lower_bound').all())
            val = random.randint(param_ranges[0].lower_bound, param_ranges[-1].lower_bound)
            param_range = [pr for pr in param_ranges if pr.lower_bound <= val][-1]
            data['values'][mp.parameter.name] = {
                'id': f'random_{mp.parameter.name}',
                'timestamp': datetime.datetime.now().strftime("%d.%m.%Y %H:%M:%S"),
                'value': val,
                'unit': mp.parameter.unit,
                'min': param_ranges[0].lower_bound,
                'max': param_ranges[-1].lower_bound,
                'value_range': {'description': param_range.description, 'tag': param_range.tag, 'color': param_range.color},
                'param_ranges': [{'lower_bound': pr.lower_bound, 'description': pr.description, 'tag': pr.tag, 'color': pr.color} for pr in param_ranges]
            }
    else:
        location = Location.objects.get(name=location_name)
        if location.latitude != -100:
            try:
                weather = WeatherData.objects.filter(location=location).latest('created_at')
                created = weather.created_at.replace(tzinfo=None)
            except:
                created = datetime.datetime.min

            if created < datetime.datetime.now() - datetime.timedelta(minutes=30):
                api_key = '61895a5d9f6c5a2c45314d1a6f8de99c'
                response = requests.get(f'http://api.openweathermap.org/data/2.5/weather?lat={location.latitude}&lon={location.longitude}&units=metric&appid={api_key}')
                dat = response.json()
                weather = WeatherData.objects.create(
                    location=location,
                    weather=dat['weather'][0]['main'],
                    weather_description=dat['weather'][0]['description'],
                    wind_speed=dat['wind']['speed'],
                )

            data['weather'] = {
                'name': weather.weather,
                'description': weather.weather_description,
                'wind_speed': weather.wind_speed,
            }

        measured_params = MeasuredParameter.objects.filter(location=location).prefetch_related('parameter').all()
        for mp in measured_params:
            sv = SensorValue.objects.filter(measuredParameter=mp).latest('created_at')
            param_ranges = list(ParameterRange.objects.filter(parameter=mp.parameter).order_by('lower_bound').all())
            param_range = [pr for pr in param_ranges if pr.lower_bound <= sv.value][-1]
            data['values'][mp.parameter.name] = {
                'id': mp.id,
                'timestamp': sv.created_at,
                'value': sv.value,
                'unit': mp.parameter.unit,
                'min': param_ranges[0].lower_bound,
                'max': param_ranges[-1].lower_bound,
                'value_range': {'description': param_range.description, 'tag': param_range.tag, 'color': param_range.color},
                'param_ranges': [{'lower_bound': pr.lower_bound, 'description': pr.description, 'tag': pr.tag, 'color': pr.color} for pr in param_ranges]
            }

    return Response(data)


@swagger_auto_schema(method='GET', manual_parameters=[
    openapi.Parameter(name='from', in_=openapi.IN_QUERY, description='in seconds, 0 as minimum', type=openapi.TYPE_INTEGER),
    openapi.Parameter(name='to', in_=openapi.IN_QUERY, description='in seconds', type=openapi.TYPE_INTEGER)
])
@api_view(['GET'])
def measured_parameter_details(request, measured_parameter_id: str):
    dt_from = datetime.datetime.utcfromtimestamp(int(request.query_params['from']))
    dt_to = datetime.datetime.utcfromtimestamp(int(request.query_params['to']))

    if measured_parameter_id.startswith('random'):
        hours_between = int((dt_to - dt_from).total_seconds() / 60 / 60)

        param = measured_parameter_id.split('_', maxsplit=1)
        min_max = {'temperature': {'min': -25, 'max': 42}, 'humidity': {'min': 0, 'max': 100},
                   'pressure': {'min': 800, 'max': 1100}, 'air_quality': {'min': 400, 'max': 60000}}
        mm = min_max.get(param[1])
        timestamps = [dt_from + datetime.timedelta(hours=i) for i in range(hours_between)]

        data = {
            'name': param[1],
            'sensor': 'Random Sensor',
            'parameter_description': 'Random Sensor Description',
            'sensor_description': 'Random Parameter Description',
            'values': [{'timestamp': int(timestamps[idx].timestamp())*1000, 'value': v} for idx, v in enumerate([random.randint(mm['min'], mm['max']) for i in range(hours_between)])]
        }
    else:
        mp = MeasuredParameter.objects.select_related('parameter', 'sensor').get(id=measured_parameter_id)
        values = SensorValue.objects.filter(measuredParameter=mp, created_at__range=(dt_from, dt_to)).all()  # how many is max count?
        data = {
            'name': mp.parameter.name,
            'sensor': mp.sensor.name,
            'parameter_description': mp.parameter.description,
            'sensor_description': mp.sensor.description,
            'values': [{'timestamp': int(v.created_at.timestamp())*1000, 'value': v.value} for v in values]
        }

    return Response(data)


@api_view(['GET'])
def latest_sensor_value_timestamp(request, location_name: str):
    if location_name == 'random':
        return Response(int(datetime.datetime.now().timestamp())*1000)

    location = Location.objects.get(name=location_name)
    measured_params = MeasuredParameter.objects.filter(location=location).all()
    max_time = datetime.datetime.min
    for mp in measured_params:
        try:
            max_time = max(max_time, SensorValue.objects.filter(measuredParameter=mp).latest('created_at').created_at.replace(tzinfo=None))
        except:
            pass

    return Response(int(max_time.timestamp())*1000)


