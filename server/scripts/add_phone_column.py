#!/usr/bin/env python3
"""
Script to add missing columns to the users table.
This fixes errors like: column users.phone does not exist
"""
import sys
from pathlib import Path

# Add api directory to path to import modules
api_path = Path(__file__).parent.parent / "api"
sys.path.insert(0, str(api_path))

from sqlalchemy import text
from config.db import engine

# Columns to add: (column_name, sql_type)
COLUMNS_TO_ADD = [
    ('phone', 'VARCHAR(150)'),
    ('location', 'VARCHAR(200)'),
    ('bio', 'TEXT'),
    ('headLine', 'VARCHAR(200)'),
    ('companyName', 'TEXT'),
    ('webSite', 'VARCHAR(150)'),
    ('resume_url', 'TEXT'),
]

def add_missing_columns():
    """Add missing columns to the users table."""
    try:
        with engine.connect() as conn:
            # Get existing columns
            check_query = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            """)
            result = conn.execute(check_query)
            existing_columns = {row[0] for row in result}
            
            added_count = 0
            for column_name, sql_type in COLUMNS_TO_ADD:
                if column_name in existing_columns:
                    print(f"Column '{column_name}' already exists. Skipping.")
                    continue
                
                # Add the column
                alter_query = text(f"""
                    ALTER TABLE public.users 
                    ADD COLUMN "{column_name}" {sql_type}
                """)
                conn.execute(alter_query)
                added_count += 1
                print(f"Successfully added '{column_name}' column to users table.")
            
            if added_count > 0:
                conn.commit()
                print(f"\n✓ Added {added_count} column(s) successfully!")
            else:
                print("\n✓ All columns already exist!")
            
    except Exception as e:
        print(f"Error adding columns: {e}")
        raise

if __name__ == "__main__":
    add_missing_columns()

