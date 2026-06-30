from django.db import migrations

class Migration(migrations.Migration):

    dependencies = [
        ('fitness', '0003_seed_exercises'),
    ]

    operations = [
        migrations.RunSQL('CREATE EXTENSION IF NOT EXISTS vector;'),
    ]
