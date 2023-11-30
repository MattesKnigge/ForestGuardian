import datetime
import time
import random

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Location, MeasuredParameter, SensorValue, ParameterRange
from .utils import get_current_season


@api_view(['GET'])
def get_locations(request):
    data = [loc.name for loc in Location.objects.all()]
    data.append('random')
    return Response(data)


@api_view(['GET'])
def get_location(request, location_name: str):
    data = {
        'season': get_current_season(),
        'values': {}
    }

    if location_name == "random":
        location = Location.objects.get(name='prototype')
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
def get_measured_parameter_details(request, measured_parameter_id: str):
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
            'values': [{'timestamp': time.mktime(timestamps[idx].timetuple())*1000, 'value': v} for idx, v in enumerate([random.randint(mm['min'], mm['max']) for i in range(hours_between)])]
        }
    else:
        mp = MeasuredParameter.objects.select_related('parameter', 'sensor').get(id=measured_parameter_id)
        values = SensorValue.objects.filter(measuredParameter=mp, created_at__range=(dt_from, dt_to)).all()  # how many is max count?
        data = {
            'name': mp.parameter.name,
            'sensor': mp.sensor.name,
            'parameter_description': mp.parameter.description,
            'sensor_description': mp.sensor.description,
            'values': [{'timestamp': time.mktime(v.created_at.timetuple())*1000, 'value': v.value} for v in values]
        }

    return Response(data)


@api_view(['GET'])
def get_latest_sensor_value_timestamp(request, location_name: str):
    if location_name == 'random':
        return Response(time.mktime(datetime.datetime.now().timetuple())*1000)

    location = Location.objects.get(name=location_name)
    measured_params = MeasuredParameter.objects.filter(location=location).all()
    max_time = datetime.datetime.min
    for mp in measured_params:
        max_time = max(max_time, SensorValue.objects.filter(measuredParameter=mp).latest('created_at').created_at.replace(tzinfo=None))

    return Response(time.mktime(max_time.timetuple())*1000)


@swagger_auto_schema(request_body=openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'values': openapi.Schema(type=openapi.TYPE_OBJECT,
                                 description='dictionary of all parameters with their values',
                                 properties={
                                     'temperature': openapi.Schema(type=openapi.TYPE_NUMBER),
                                     'humidity': openapi.Schema(type=openapi.TYPE_NUMBER),
                                     'pressure': openapi.Schema(type=openapi.TYPE_NUMBER),
                                     'air_quality': openapi.Schema(type=openapi.TYPE_NUMBER)
                                 })
    },
), method='POST')
@api_view(['POST'])
def post_location_data(request):
    loc = Location.objects.get(name='prototype')  # get Ident from payload (not name tho, then anyone could just send in random data...
    mps = MeasuredParameter.objects.filter(location=loc).prefetch_related('parameter').all()

    data = request.data
    print(data)
    values = []
    for mp in mps:
        v = data['values'].get(mp.parameter.name, None)
        if v is not None:
            values.append(SensorValue(value=v, measuredParameter=mp))

    SensorValue.objects.bulk_create(values)

    return Response(status=status.HTTP_200_OK)
