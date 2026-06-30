# Generated manually to add pgvector fields and complete exercises.json schema attributes
from django.db import migrations, models
import pgvector.django

class Migration(migrations.Migration):

    dependencies = [
        ('fitness', '0004_enable_vector'),
    ]

    operations = [
        migrations.AddField(
            model_name='exercise',
            name='external_id',
            field=models.CharField(blank=True, max_length=50, null=True, unique=True),
        ),
        migrations.AddField(
            model_name='exercise',
            name='category',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='exercise',
            name='body_part',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='exercise',
            name='target',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='exercise',
            name='muscle_group',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='exercise',
            name='secondary_muscles',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='exercise',
            name='instruction_steps',
            field=models.JSONField(default=list),
        ),
        migrations.AddField(
            model_name='exercise',
            name='embedding',
            field=pgvector.django.VectorField(blank=True, dimensions=384, null=True),
        ),
    ]
