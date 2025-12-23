from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Text,
    DateTime,
    Date,
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
# MANY-TO-MANY: CONVERSATION ↔ USERS
# ============================================================
conversation_participants = Table(
    "conversation_participants",
    Base.metadata,
    Column(
        "conversation_id",
        Integer,
        ForeignKey("conversations.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "user_id",
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "joined_at",
        DateTime,
        server_default=func.now(),
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
    github_url = Column(String(100))

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
    start_date = Column(Date)
    end_date = Column(Date)
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
    start_date = Column(Date)
    end_date = Column(Date)
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


# ============================================================
# SAVED JOB MODEL
# ============================================================
class SavedJob(Base):
    __tablename__ = "saved_jobs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"))
    saved_at = Column(DateTime, server_default=func.now())


# ============================================================
# NOTIFICATION MODEL
# ============================================================
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)

    sender_id = Column(
        Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True
    )
    receiver_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    type = Column(
        Enum(
            "connection_request",
            "connection_accepted",
            "job_application",
            "application_status",
            "job_posted",
            name="notification_type",
        ),
        nullable=False,
    )

    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)

    is_read = Column(Integer, server_default="0")  # 0 = unread, 1 = read
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    sender = relationship(
        "User",
        foreign_keys=[sender_id],
        backref="sent_notifications",
    )
    receiver = relationship(
        "User",
        foreign_keys=[receiver_id],
        backref="received_notifications",
    )


# ============================================================
# CONNECTION REQUEST MODEL
# ============================================================
class ConnectionRequest(Base):
    __tablename__ = "connection_requests"

    id = Column(Integer, primary_key=True)

    sender_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    receiver_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )

    status = Column(
        Enum("pending", "accepted", "rejected", name="connection_status"),
        server_default="pending",
    )

    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    sender = relationship("User", foreign_keys=[sender_id], backref="sent_requests")
    receiver = relationship(
        "User", foreign_keys=[receiver_id], backref="received_requests"
    )


# ============================================================
# DeleteRequest MODEL
# ============================================================
class DeleteRequest(Base):
    __tablename__ = "delete_requests"

    id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationship to user
    user = relationship("User", backref="delete_requests")



# ============================================================
# ReportedJob MODEL
# ============================================================
class ReportedJob(Base):
    __tablename__ = "reported_jobs"

    id = Column(Integer, primary_key=True)

    user_id = Column(
        Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False
    )
    job_id = Column(
        Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False
    )
    
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationship to user
    user = relationship("User", backref="reported_jobs")
    job = relationship("Job", backref="reported_jobs")


# ============================================================
# Conversation MODEL
# ============================================================
class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True)

    created_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    is_group = Column(Integer, server_default="0") 
    title = Column(String(255)) 

    created_at = Column(DateTime, server_default=func.now())

    participants = relationship(
        "User",
        secondary=conversation_participants,
        backref="conversations",
    )

    messages = relationship(
        "Message",
        backref="conversation",
        cascade="all, delete-orphan",
    )

    creator = relationship("User", foreign_keys=[created_by])



# ============================================================
# Message MODEL
# ============================================================
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True)

    conversation_id = Column(
        Integer,
        ForeignKey("conversations.id", ondelete="CASCADE"),
        nullable=False,
    )

    sender_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    content = Column(Text, nullable=False)

    is_read = Column(Integer, server_default="0")
    read_at = Column(DateTime)

    created_at = Column(DateTime, server_default=func.now())

    sender = relationship(
        "User",
        foreign_keys=[sender_id],
        backref="sent_messages",
    )


Base.metadata.create_all(engine)
print("Tables created successfully!")
