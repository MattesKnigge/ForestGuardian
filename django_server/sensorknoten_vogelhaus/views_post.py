from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Location, MeasuredParameter, SensorValue


@swagger_auto_schema(request_body=openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'values': openapi.Schema(type=openapi.TYPE_OBJECT,
                                 description='dictionary of all parameters with their values',
                                 properties={
                                     'temperature': openapi.Schema(type=openapi.TYPE_ARRAY,
                                                                   items=openapi.Schema(
                                                                       type=openapi.TYPE_NUMBER)),
                                     'humidity': openapi.Schema(type=openapi.TYPE_ARRAY,
                                                                items=openapi.Schema(
                                                                    type=openapi.TYPE_NUMBER)),
                                     'pressure': openapi.Schema(type=openapi.TYPE_ARRAY,
                                                                items=openapi.Schema(
                                                                    type=openapi.TYPE_NUMBER)),
                                     'air_quality': openapi.Schema(type=openapi.TYPE_ARRAY,
                                                                   items=openapi.Schema(
                                                                       type=openapi.TYPE_NUMBER)),
                                 })
    },
), method='POST')
@api_view(['POST'])
def location_data(request):
    loc = Location.objects.get(name='prototype')  # get Ident from payload (not name tho, then anyone could just send in random data...
    mps = MeasuredParameter.objects.filter(location=loc).prefetch_related('parameter').all()

    data = request.data
    print(data)
    values = []
    for mp in mps:
        sent_vals = data['values'].get(mp.parameter.name, None)
        if sent_vals is not None:
            for v in sent_vals:
                values.append(SensorValue(value=v, measuredParameter=mp))

    SensorValue.objects.bulk_create(values)

    return Response(status=status.HTTP_200_OK)
