# Generated by Django 5.2 on 2025-04-25 01:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_appointment_lawyer'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='isseen',
            field=models.BooleanField(default=False),
        ),
    ]
