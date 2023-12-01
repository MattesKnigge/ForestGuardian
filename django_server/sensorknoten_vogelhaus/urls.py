from django.urls import path
from . import views_get
from . import views_post


urlpatterns = [
    path('locations', views_get.locations, name='locations'),
    path('location/data', views_post.location_data, name='post_location_data'),
    path('location/<location_name>', views_get.location, name='location'),
    path('location/<location_name>/latest', views_get.latest_sensor_value_timestamp, name='location_last_timestamp'),
    path('measured_parameter/<measured_parameter_id>', views_get.measured_parameter_details, name='mp_details'),
]
