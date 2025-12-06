from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, Enum, MetaData
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import os
from dotenv import load_dotenv

load_dotenv()

DB_USER = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = (
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(DATABASE_URL, echo=True)
Base = declarative_base(metadata=MetaData(schema="public"))

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(Text)
    role = Column(Enum("employer", "candidate", name="user_roles"), nullable=False)
    image = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

Base.metadata.create_all(engine)

print("Users table created successfully!")
