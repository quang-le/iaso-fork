# Generated by Django 3.2.15 on 2023-03-29 08:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("iaso", "0197_formpredefinedfilter"),
    ]

    operations = [
        migrations.AddField(
            model_name="instance",
            name="form_version",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.DO_NOTHING,
                related_name="form_version",
                to="iaso.formversion",
            ),
        ),
    ]
