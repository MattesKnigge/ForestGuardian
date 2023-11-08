from django.urls import path
from . import views


urlpatterns = [
    path('locations', views.get_locations, name='locations'),
    path('location/data', views.post_location_data, name='post_location_data'),
    path('location/<location_name>', views.get_location, name='location'),
    path('measured_parameter/<measured_parameter_id>', views.get_measured_parameter_details, name='mp_details'),
]
