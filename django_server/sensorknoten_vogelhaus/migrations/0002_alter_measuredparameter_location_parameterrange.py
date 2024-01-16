# Generated by Django 4.2.6 on 2023-11-29 08:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sensorknoten_vogelhaus', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='measuredparameter',
            name='location',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='loc_mp', to='sensorknoten_vogelhaus.location'),
        ),
        migrations.CreateModel(
            name='ParameterRange',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('value', models.FloatField()),
                ('description', models.CharField(max_length=512)),
                ('tag', models.CharField(max_length=32)),
                ('parameter', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sensorknoten_vogelhaus.parameter')),
            ],
        ),
    ]
