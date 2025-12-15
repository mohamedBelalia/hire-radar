#!/usr/bin/env python3
"""
Script to verify all User model columns exist in the database.
"""
import sys
from pathlib import Path

# Add api directory to path to import modules
api_path = Path(__file__).parent.parent / "api"
sys.path.insert(0, str(api_path))

from sqlalchemy import text
from config.db import engine

# Expected columns from the User model
expected_columns = {
    'id', 'full_name', 'email', 'password', 'role', 'image', 
    'phone', 'location', 'bio', 'headLine', 'companyName', 
    'webSite', 'resume_url', 'created_at'
}

def verify_columns():
    """Check if all expected columns exist in the users table."""
    try:
        with engine.connect() as conn:
            query = text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            """)
            result = conn.execute(query)
            existing_columns = {row[0] for row in result}
            
            missing = expected_columns - existing_columns
            extra = existing_columns - expected_columns
            
            if missing:
                print(f"Missing columns: {missing}")
            if extra:
                print(f"Extra columns in DB (not in model): {extra}")
            if not missing and not extra:
                print("✓ All columns match!")
            elif not missing:
                print("✓ All expected columns exist!")
                
    except Exception as e:
        print(f"Error checking columns: {e}")
        raise

if __name__ == "__main__":
    verify_columns()

