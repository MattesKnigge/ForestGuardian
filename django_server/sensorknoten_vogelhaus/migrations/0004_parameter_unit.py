# Generated by Django 4.2.6 on 2023-11-29 11:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sensorknoten_vogelhaus', '0003_rename_lower_bound_parameterrange_value_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='parameter',
            name='unit',
            field=models.CharField(default='default', max_length=8),
            preserve_default=False,
        ),
    ]
