from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Enum,
    ForeignKey,
    Table,
    ARRAY,
    MetaData,
)
from sqlalchemy.orm import relationship
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

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, echo=True)
Base = declarative_base(metadata=MetaData(schema="public"))

job_applicants = Table(
    "job_applicants",
    Base.metadata,
    Column("job_id", Integer, ForeignKey("jobs.id"), primary_key=True),
    Column("user_id", Integer, ForeignKey("users.id"), primary_key=True),
)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(Text)
    role = Column(Enum("employer", "candidate", name="user_roles"), nullable=False)
    image = Column(Text)
    created_at = Column(DateTime, server_default=func.now())


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True)
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    salary_range = Column(String(100))
    emp_type = Column(String(50))
    description = Column(Text)
    skills = Column(ARRAY(String))
    responsibilities = Column(ARRAY(String))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now(), server_default=func.now())

    employer = relationship("User", backref="jobs_posted")
    applicants = relationship("User", secondary=job_applicants, backref="applied_jobs")


Base.metadata.create_all(engine)

print("Jobs table created successfully!")
print("Users table created successfully!")