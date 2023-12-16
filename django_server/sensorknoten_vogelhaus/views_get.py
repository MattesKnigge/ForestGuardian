import random
import requests
from datetime import datetime, timedelta
from django.utils import timezone

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Location, MeasuredParameter, SensorValue, ParameterRange, WeatherData, LocationImage
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
        'image_url': '',
    }

    if location_name == "random":
        loc = Location.objects.get(name='prototype')
        data['display_name'] = 'Random'
        data['description'] = loc.description

        weather = WeatherData.objects.filter(location=loc).latest('created_at')
        data['weather'] = {
            'name': weather.weather,
            'description': weather.weather_description,
            'wind_speed': weather.wind_speed,
        }

        measured_params = MeasuredParameter.objects.filter(location=loc).prefetch_related('parameter').all()
        for mp in measured_params:
            param_ranges = list(ParameterRange.objects.filter(parameter=mp.parameter).order_by('lower_bound').all())
            val = random.uniform(param_ranges[0].lower_bound, param_ranges[-1].lower_bound)
            val = val if random.randint(0, 1) == 0 else int(val)
            param_range = [pr for pr in param_ranges if pr.lower_bound <= val][-1]
            data['values'][mp.parameter.name] = {
                'id': f'random_{mp.id}',
                'display_name': mp.parameter.display_name,
                'timestamp': timezone.now().strftime("%d.%m.%Y %H:%M:%S"),
                'value': val,
                'unit': mp.parameter.unit,
                'min': param_ranges[0].lower_bound,
                'max': param_ranges[-1].lower_bound,
                'value_range': {'description': param_range.description, 'tag': param_range.tag, 'color': param_range.color},
                'param_ranges': [{'lower_bound': pr.lower_bound, 'description': pr.description, 'tag': pr.tag, 'color': pr.color} for pr in param_ranges],
                'lat': loc.latitude,
                'long': loc.longitude,
            }
    else:
        loc = Location.objects.get(name=location_name)
        data['display_name'] = loc.display_name
        data['description'] = loc.description

        if loc.latitude != -100:
            try:
                weather = WeatherData.objects.filter(location=loc).latest('created_at')
                created = weather.created_at
            except:
                created = timezone.now() - timedelta(minutes=60)

            if created < timezone.now() - timedelta(minutes=30):
                api_key = '61895a5d9f6c5a2c45314d1a6f8de99c'
                response = requests.get(f'http://api.openweathermap.org/data/2.5/weather?lat={loc.latitude}&lon={loc.longitude}&units=metric&appid={api_key}')
                dat = response.json()
                weather = WeatherData.objects.create(
                    location=loc,
                    weather=dat['weather'][0]['main'],
                    weather_description=dat['weather'][0]['description'],
                    wind_speed=dat['wind']['speed'],
                )

            data['weather'] = {
                'name': weather.weather,
                'description': weather.weather_description,
                'wind_speed': weather.wind_speed,
            }

        measured_params = MeasuredParameter.objects.filter(location=loc).prefetch_related('parameter').all()
        for mp in measured_params:
            try:
                sv = SensorValue.objects.filter(measuredParameter=mp).latest('created_at')
                param_ranges = list(ParameterRange.objects.filter(parameter=mp.parameter).order_by('lower_bound').all())
                param_range = [pr for pr in param_ranges if pr.lower_bound <= sv.value][-1]
                data['values'][mp.parameter.name] = {
                    'id': mp.id,
                    'display_name': mp.parameter.display_name,
                    'timestamp': sv.created_at,
                    'value': sv.value,
                    'unit': mp.parameter.unit,
                    'min': param_ranges[0].lower_bound,
                    'max': param_ranges[-1].lower_bound,
                    'value_range': {'description': param_range.description, 'tag': param_range.tag, 'color': param_range.color},
                    'param_ranges': [{'lower_bound': pr.lower_bound, 'description': pr.description, 'tag': pr.tag, 'color': pr.color} for pr in param_ranges],
                'lat': loc.latitude,
                'long': loc.longitude,
                }
            except:
                pass

    try:
        img = LocationImage.objects.filter(location=loc).latest('created_at')
        data['image_url'] = img.image.url
    except:
        pass

    return Response(data)


@swagger_auto_schema(method='GET', manual_parameters=[
    openapi.Parameter(name='from', in_=openapi.IN_QUERY, description='in seconds, 0 as minimum', type=openapi.TYPE_INTEGER),
    openapi.Parameter(name='to', in_=openapi.IN_QUERY, description='in seconds', type=openapi.TYPE_INTEGER)
])
@api_view(['GET'])
def measured_parameter_details(request, measured_parameter_id: str):
    dt_from = datetime.utcfromtimestamp(int(request.query_params['from']))
    dt_to = datetime.utcfromtimestamp(int(request.query_params['to']))

    if measured_parameter_id.startswith('random'):
        hours_between = int((dt_to - dt_from).total_seconds() / 60 / 60)

        param = measured_parameter_id.split('_')
        mp = MeasuredParameter.objects.select_related('parameter').get(id=param[1])
        param_ranges = list(ParameterRange.objects.filter(parameter=mp.parameter).order_by('lower_bound').all())
        val = random.randint(param_ranges[0].lower_bound, param_ranges[-1].lower_bound)
        param_range = [pr for pr in param_ranges if pr.lower_bound <= val][-1]
        min_val = int(param_ranges[0].lower_bound)
        max_val = int(param_ranges[-1].lower_bound)
        timestamps = [dt_from + timedelta(hours=i) for i in range(hours_between)]

        data = {
            'name': mp.parameter.name,
            'display_name': mp.parameter.display_name,
            'parameter_description': mp.parameter.description,
            'value': val,
            'value_range': {'description': param_range.description, 'tag': param_range.tag, 'color': param_range.color},
            'values': [{'timestamp': int(timestamps[idx].timestamp())*1000, 'value': v} for idx, v in enumerate([random.randint(min_val, max_val) for i in range(hours_between)])]
        }
    else:
        mp = MeasuredParameter.objects.select_related('parameter').get(id=measured_parameter_id)
        values = list(SensorValue.objects.filter(measuredParameter=mp).all())  # , created_at__range=(dt_from, dt_to)).all())    FOR NOW DISABLED CAUSE WE DON'T HAVE CURRENT DATA YET (also implement guard at no data)
        param_ranges = list(ParameterRange.objects.filter(parameter=mp.parameter).order_by('lower_bound').all())
        if len(values) > 0:
            param_range = [pr for pr in param_ranges if pr.lower_bound <= values[-1].value][-1]
        else:
            param_range = {'description': '', 'tag': '', 'color': 'white'}

        data = {
            'name': mp.parameter.name,
            'display_name': mp.parameter.display_name,
            'parameter_description': mp.parameter.description,
            'value': values[-1].value,
            'value_range': {'description': param_range.description, 'tag': param_range.tag, 'color': param_range.color},
            'values': [{'timestamp': int(v.created_at.timestamp())*1000, 'value': v.value} for v in values]
        }

    return Response(data)


@api_view(['GET'])
def latest_sensor_value_timestamp(request, location_name: str):
    if location_name == 'random':
        return Response(int(timezone.now().timestamp())*1000)

    loc = Location.objects.get(name=location_name)
    measured_params = MeasuredParameter.objects.filter(location=loc).all()
    max_time = datetime.min
    for mp in measured_params:
        try:
            max_time = max(max_time, SensorValue.objects.filter(measuredParameter=mp).latest('created_at').created_at.replace(tzinfo=None))
        except:
            pass

    return Response(int(max_time.timestamp())*1000)
