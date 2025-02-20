# Generated by Django 4.2.6 on 2023-11-29 10:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('sensorknoten_vogelhaus', '0002_alter_measuredparameter_location_parameterrange'),
    ]

    operations = [
        migrations.RenameField(
            model_name='parameterrange',
            old_name='value',
            new_name='lower_bound',
        ),
        migrations.RemoveField(
            model_name='parameter',
            name='lower_good_bound',
        ),
        migrations.RemoveField(
            model_name='parameter',
            name='max',
        ),
        migrations.RemoveField(
            model_name='parameter',
            name='min',
        ),
        migrations.RemoveField(
            model_name='parameter',
            name='upper_good_bound',
        ),
    ]
