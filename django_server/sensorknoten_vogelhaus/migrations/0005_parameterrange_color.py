# Generated by Django 4.2.6 on 2023-11-30 17:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sensorknoten_vogelhaus', '0004_parameter_unit'),
    ]

    operations = [
        migrations.AddField(
            model_name='parameterrange',
            name='color',
            field=models.CharField(default='#ffffff', max_length=16),
            preserve_default=False,
        ),
    ]
