import os
import json
from django.core.management.base import BaseCommand
from fitness.models import Exercise

class Command(BaseCommand):
    help = 'Seeds the exercise database from exercises.json and generates vector embeddings'

    def handle(self, *args, **options):
        json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'data', 'exercises.json')
        
        if not os.path.exists(json_path):
            self.stdout.write(self.style.ERROR(f"Data file not found at: {json_path}"))
            return

        self.stdout.write(self.style.NOTICE(f"Loading data from {json_path}..."))
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Clean up legacy exercises with null external_id to avoid duplicates from migration 0003
        self.stdout.write(self.style.NOTICE("Cleaning up legacy/duplicate exercises..."))
        deleted_count = Exercise.objects.filter(external_id__isnull=True).delete()[0]
        self.stdout.write(self.style.SUCCESS(f"Cleaned up {deleted_count} legacy exercises without external IDs."))

        self.stdout.write(self.style.SUCCESS(f"Loaded {len(data)} exercises. Initializing embedding engine..."))

        # Initialize FastEmbed text embedder with fallback
        embedder = None
        try:
            from fastembed import TextEmbedding
            embedder = TextEmbedding()
            self.stdout.write(self.style.SUCCESS("Embedding engine initialized successfully."))
        except Exception as e:
            self.stdout.write(self.style.WARNING(
                f"Could not load or initialize FastEmbed: {e}. "
                "Seeding exercises WITHOUT vector embeddings."
            ))

        batch_size = 50
        total_exercises = len(data)
        self.stdout.write(self.style.NOTICE(f"Starting seed process for {total_exercises} items..."))

        # For performance, we read in batches and update/create
        for i in range(0, total_exercises, batch_size):
            batch_data = data[i:i + batch_size]
            texts_to_embed = []
            exercises_to_save = []
            
            for item in batch_data:
                external_id = item.get('id')
                name = item.get('name', '').title()
                category = item.get('category', '')
                body_part = item.get('body_part', '')
                equipment = item.get('equipment', '')
                target = item.get('target', '')
                muscle_group = item.get('muscle_group', '')
                
                # Fetch English translation of instructions
                instructions_dict = item.get('instructions', {})
                instructions_en = instructions_dict.get('en', '') if isinstance(instructions_dict, dict) else str(instructions_dict)
                
                # Fetch English instruction steps list
                steps_dict = item.get('instruction_steps', {})
                steps_en = steps_dict.get('en', []) if isinstance(steps_dict, dict) else []

                secondary_muscles = item.get('secondary_muscles', [])
                
                # Combine muscle groups for backward compatibility
                combined_muscles = list(set([muscle_group] + secondary_muscles))
                combined_muscles = [m for m in combined_muscles if m] # filter empty

                # Create text content representation for embeddings
                meta_text = f"{name} ({equipment}). Target: {target}. Category: {category}. Body Part: {body_part}. Instructions: {instructions_en}"
                texts_to_embed.append((meta_text, {
                    'external_id': external_id,
                    'name': name,
                    'category': category,
                    'body_part': body_part,
                    'equipment': equipment,
                    'target': target,
                    'muscle_group': muscle_group,
                    'muscle_groups': combined_muscles,
                    'secondary_muscles': secondary_muscles,
                    'instructions': instructions_en,
                    'instruction_steps': steps_en,
                }))

            # Generate embeddings if embedder is active
            embeddings = None
            if embedder:
                try:
                    raw_texts = [text for text, _ in texts_to_embed]
                    embeddings = list(embedder.embed(raw_texts))
                except Exception as embed_err:
                    self.stdout.write(self.style.WARNING(f"Batch embedding failed: {embed_err}. Seeding batch metadata only."))

            # Save exercises to DB
            for idx, (text, fields) in enumerate(texts_to_embed):
                emb = list(embeddings[idx]) if embeddings is not None else None
                
                Exercise.objects.update_or_create(
                    external_id=fields['external_id'],
                    defaults={
                        'name': fields['name'],
                        'category': fields['category'],
                        'body_part': fields['body_part'],
                        'equipment': fields['equipment'],
                        'target': fields['target'],
                        'muscle_group': fields['muscle_group'],
                        'muscle_groups': fields['muscle_groups'],
                        'secondary_muscles': fields['secondary_muscles'],
                        'instructions': fields['instructions'],
                        'instruction_steps': fields['instruction_steps'],
                        'embedding': emb
                    }
                )
            
            progress = min(i + batch_size, total_exercises)
            self.stdout.write(f"Seeded {progress}/{total_exercises} exercises...")

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully."))
