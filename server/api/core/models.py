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

# ============================================================
# MANY-TO-MANY: USER ↔ SKILLS
# ============================================================
user_skills = Table(
    "user_skills",
    Base.metadata,
    Column(
        "user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "skill_id",
        Integer,
        ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

# ============================================================
# MANY-TO-MANY: JOB ↔ USERS (Applicants)
# ============================================================
job_applicants = Table(
    "job_applicants",
    Base.metadata,
    Column(
        "job_id", Integer, ForeignKey("jobs.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    ),
)

# ============================================================
# MANY-TO-MANY: JOB ↔ SKILLS (job_skills)
# ============================================================
job_skills = Table(
    "job_skills",
    Base.metadata,
    Column(
        "job_id", Integer, ForeignKey("jobs.id", ondelete="CASCADE"), primary_key=True
    ),
    Column(
        "skill_id",
        Integer,
        ForeignKey("skills.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


# ============================================================
# USER MODEL
# ============================================================
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    password = Column(Text)
    role = Column(
        Enum("employer", "admin", "candidate", name="user_roles"), nullable=False
    )
    image = Column(Text)
    phone = Column(String(150))
    location = Column(String(200))
    bio = Column(Text)
    headLine = Column(String(200))  # ex: "Frontend engineer"
    companyName = Column(Text)
    webSite = Column(String(150))
    resume_url = Column(Text)

    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    educations = relationship("Education", backref="user", cascade="all, delete-orphan")
    experiences = relationship(
        "Experience", backref="user", cascade="all, delete-orphan"
    )
    saved_jobs = relationship("SavedJob", backref="user", cascade="all, delete-orphan")
    skills = relationship("Skill", secondary=user_skills, backref="users")


# ============================================================
# EDUCATION MODEL
# ============================================================
class Education(Base):
    __tablename__ = "educations"

    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    school_name = Column(String(150))
    degree = Column(String(150))
    field_of_study = Column(String(150))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    description = Column(Text)


# ============================================================
# EXPERIENCE MODEL
# ============================================================
class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    job_title = Column(String(150), nullable=False)
    company = Column(String(150))
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    description = Column(Text)


# ============================================================
# SKILL MODEL
# ============================================================
class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True)
    name = Column(String(150), unique=True, nullable=False)


# ============================================================
# CATEGORY MODEL
# ============================================================
class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False)


# ============================================================
# JOB MODEL
# ============================================================
class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True)
    employer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.id"))

    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    salary_range = Column(String(100))
    emp_type = Column(String(50))
    description = Column(Text)
    responsibilities = Column(ARRAY(String))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now(), server_default=func.now())

    employer = relationship("User", backref="jobs_posted")
    category = relationship("Category")
    applicants = relationship("User", secondary=job_applicants, backref="applied_jobs")
    skills = relationship("Skill", secondary=job_skills, backref="job_with_skill")


# ============================================================
# APPLICATION MODEL
# ============================================================
class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))

    resume_url = Column(Text)
    cover_letter = Column(Text)
    status = Column(
        Enum("pending", "reviewed", "accepted", "rejected", name="application_status"),
        server_default="pending",
    )
    applied_at = Column(DateTime, server_default=func.now())

    # Relationships
    job = relationship("Job", backref="applications")
    user = relationship("User", backref="applications")


# ============================================================
# SAVED JOB MODEL
# ============================================================
class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"))
    saved_at = Column(DateTime, server_default=func.now())


Base.metadata.create_all(engine)
print("Tables created successfully!")
