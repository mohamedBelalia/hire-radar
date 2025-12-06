from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Enum,
    Numeric,
    ARRAY,
    ForeignKey,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from config.db import Base


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
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    company_name = Column(String(200), nullable=False)
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    location = Column(String(200))
    salary_min = Column(Numeric(10, 2))
    salary_max = Column(Numeric(10, 2))
    salary_currency = Column(String(10), default="USD")
    employment_type = Column(
        Enum(
            "full-time",
            "part-time",
            "contract",
            "internship",
            "remote",
            name="employment_types",
        )
    )
    experience_level = Column(
        Enum("entry", "mid", "senior", "executive", name="experience_levels")
    )
    skills = Column(ARRAY(String), default=[])
    requirements = Column(Text)
    benefits = Column(Text)
    application_deadline = Column(DateTime)
    posted_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # Relationship
    employer = relationship("User", foreign_keys=[employer_id])
