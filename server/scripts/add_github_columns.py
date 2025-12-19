#!/usr/bin/env python3
"""
Migration script to add github_id and github_username columns to users table
"""
import os
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

DB_USER = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"


def add_github_columns():
    """Add github_id and github_username columns to users table"""
    engine = create_engine(DATABASE_URL)

    try:
        with engine.connect() as conn:
            # Check if columns already exist
            check_query = text(
                """
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = 'users' 
                AND column_name IN ('github_id', 'github_username')
            """
            )
            result = conn.execute(check_query)
            existing_columns = [row[0] for row in result]

            # Add github_id if it doesn't exist
            if "github_id" not in existing_columns:
                print("Adding github_id column...")
                conn.execute(
                    text(
                        """
                    ALTER TABLE public.users 
                    ADD COLUMN github_id VARCHAR(100)
                """
                    )
                )
                conn.commit()
                print("✓ Added github_id column")
            else:
                print("✓ github_id column already exists")

            # Add github_username if it doesn't exist
            if "github_username" not in existing_columns:
                print("Adding github_username column...")
                conn.execute(
                    text(
                        """
                    ALTER TABLE public.users 
                    ADD COLUMN github_username VARCHAR(100)
                """
                    )
                )
                conn.commit()
                print("✓ Added github_username column")
            else:
                print("✓ github_username column already exists")

        print("\n✅ Migration completed successfully!")
        return True

    except Exception as e:
        print(f"\n❌ Error during migration: {e}")
        return False
    finally:
        engine.dispose()


if __name__ == "__main__":
    print("Running database migration to add GitHub columns...\n")
    success = add_github_columns()
    sys.exit(0 if success else 1)
