# Generated by Django 3.2.21 on 2023-09-28 13:50

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("iaso", "0231_merge_20230904_2154"),
        ("wfp", "0002_auto_20230918_0905"),
    ]

    operations = [
        migrations.DeleteModel(
            name="Entity",
        ),
        migrations.DeleteModel(
            name="EntityType",
        ),
        migrations.DeleteModel(
            name="Form",
        ),
        migrations.DeleteModel(
            name="Instance",
        ),
        migrations.DeleteModel(
            name="OrgUnitType",
        ),
        migrations.AlterField(
            model_name="visit",
            name="org_unit",
            field=models.ForeignKey(
                blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to="iaso.orgunit"
            ),
        ),
        migrations.DeleteModel(
            name="OrgUnit",
        ),
    ]