# Generated by Django 3.2.21 on 2023-10-12 11:26

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polio", "0158_alter_reasonfordelay_name_fr"),
    ]

    operations = [
        migrations.AlterField(
            model_name="reasonfordelay",
            name="key_name",
            field=models.CharField(
                blank=True, max_length=200, null=True, validators=[django.core.validators.RegexValidator("/^[A-Z_]+$/")]
            ),
        ),
    ]
