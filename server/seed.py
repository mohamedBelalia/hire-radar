import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from faker import Faker
import os
import sys
from werkzeug.security import generate_password_hash
from dotenv import load_dotenv

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'api')))

from core.models import (
    Base,
    User,
    Job,
    Skill,
    Category,
    Application,
    SavedJob,
    Education,
    Experience,
    Notification,
    ConnectionRequest,
    DeleteRequest,
    job_skills,
    user_skills,
    job_applicants
)

# ================== LOAD ENV ==================
load_dotenv()

DB_USER = os.getenv("DB_USERNAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# ================== SETUP ==================
engine = create_engine(DATABASE_URL, echo=False)
session = Session(engine)
faker = Faker()
Base.metadata.create_all(engine)

print("Starting seeding process via server/seed.py...")

# ================== SEED SKILLS ==================
print("Seeding skills...")
skills_list = []
skill_names = set()
for _ in range(100):
    skill_name = faker.unique.job()
    if skill_name not in skill_names:
        skill_names.add(skill_name)
        skills_list.append(Skill(name=skill_name))

session.add_all(skills_list)
session.commit()
print(f"✓ Seeded {len(skills_list)} skills")

# ================== SEED CATEGORIES ==================
print("Seeding categories...")
categories_list = []
category_names = set()
tech_categories = ["Frontend", "Backend", "Fullstack", "Mobile", "DevOps", "AI/ML", "Data Science", "Security", "Infrastructure", "UI/UX"]
for name in tech_categories:
    categories_list.append(Category(name=name))

for _ in range(10):
    category_name = faker.unique.word().capitalize()
    if category_name not in category_names and category_name not in tech_categories:
        category_names.add(category_name)
        categories_list.append(Category(name=category_name))

session.add_all(categories_list)
session.commit()
print(f"✓ Seeded {len(categories_list)} categories")

# ================== SEED USERS ==================
print("Seeding users...")
roles = ["employer", "candidate", "admin"]
users_list = []

for _ in range(100):
    user = User(
        full_name=faker.name(),
        email=faker.unique.email(),
        password=generate_password_hash("12341234"),
        role=random.choice(roles),
        image=faker.image_url(),
        phone=faker.phone_number()[:20],
        location=faker.city(),
        bio=faker.text(max_nb_chars=200),
        headLine=faker.job()[:200],
        companyName=faker.company(),
        webSite=faker.url()[:150],
        resume_url=faker.url(),
        github_url=faker.url()[:100],
    )
    users_list.append(user)

session.add_all(users_list)
session.commit()
print(f"✓ Seeded {len(users_list)} users")

print("Assigning skills to users...")
for user in users_list:
    num_skills = random.randint(1, 5)
    user.skills = random.sample(skills_list, k=min(num_skills, len(skills_list)))
session.commit()
print("✓ Assigned skills to users")

# ================== SEED JOBS ==================
print("Seeding jobs...")
employers = [u for u in users_list if u.role == "employer"]
if not employers:
    print("Warning: No employers found, creating at least one...")
    employer = User(
        full_name=faker.name(),
        email=faker.unique.email(),
        password=generate_password_hash("12341234"),
        role="employer",
        companyName=faker.company(),
    )
    session.add(employer)
    session.commit()
    employers = [employer]

jobs_list = []
for _ in range(100):
    job = Job(
        employer_id=random.choice(employers).id,
        category_id=random.choice(categories_list).id,
        title=faker.job()[:255],
        company=faker.company()[:255],
        location=faker.city()[:255],
        salary_range=f"${random.randint(30, 80)}k-${random.randint(80, 200)}k",
        emp_type=random.choice(["full-time", "part-time", "contract", "internship"]),
        description=faker.text(max_nb_chars=500),
        responsibilities=[faker.sentence() for _ in range(random.randint(2, 5))],
        created_at=faker.date_time_this_year(),
    )
    jobs_list.append(job)

session.add_all(jobs_list)
session.commit()
print(f"✓ Seeded {len(jobs_list)} jobs")

print("Assigning skills to jobs...")
for job in jobs_list:
    num_skills = random.randint(2, 7)
    job.skills = random.sample(skills_list, k=min(num_skills, len(skills_list)))
session.commit()
print("✓ Assigned skills to jobs")

# ================== SEED APPLICATIONS ==================
print("Seeding applications...")
candidates = [u for u in users_list if u.role == "candidate"]
if not candidates:
    print("Warning: No candidates found, skipping applications...")
else:
    applications_list = []
    applied_combinations = set()
    
    for _ in range(min(200, len(candidates) * 5)):
        job = random.choice(jobs_list)
        candidate = random.choice(candidates)
        combo = (job.id, candidate.id)
        
        if combo not in applied_combinations:
            applied_combinations.add(combo)
            app = Application(
                job_id=job.id,
                user_id=candidate.id,
                resume_url=faker.url(),
                cover_letter=faker.text(max_nb_chars=300),
                status=random.choice(["pending", "reviewed", "accepted", "rejected"]),
                applied_at=faker.date_time_this_year(),
            )
            applications_list.append(app)
    
    session.add_all(applications_list)
    session.commit()
    print(f"✓ Seeded {len(applications_list)} applications")

# ================== SEED SAVED JOBS ==================
print("Seeding saved jobs...")
saved_jobs_list = []
saved_combinations = set()

for _ in range(100):
    job = random.choice(jobs_list)
    user = random.choice(users_list)
    combo = (job.id, user.id)
    
    if combo not in saved_combinations:
        saved_combinations.add(combo)
        saved = SavedJob(
            job_id=job.id,
            user_id=user.id,
            saved_at=faker.date_time_this_year()
        )
        saved_jobs_list.append(saved)

session.add_all(saved_jobs_list)
session.commit()
print(f"✓ Seeded {len(saved_jobs_list)} saved jobs")

# ================== SEED EDUCATION ==================
print("Seeding education records...")
educations_list = []
for _ in range(100):
    start = faker.date_this_century()
    end = faker.date_between(start_date=start, end_date='now')
    
    edu = Education(
        user_id=random.choice(users_list).id,
        school_name=faker.company()[:150],
        degree=random.choice(["Bachelor's", "Master's", "PhD", "Associate", "Certificate"]),
        field_of_study=faker.job()[:150],
        start_date=start,
        end_date=end,
        description=faker.text(max_nb_chars=200)
    )
    educations_list.append(edu)

session.add_all(educations_list)
session.commit()
print(f"✓ Seeded {len(educations_list)} education records")

# ================== SEED EXPERIENCE ==================
print("Seeding work experiences...")
experiences_list = []
for _ in range(100):
    start = faker.date_this_decade()
    end = faker.date_between(start_date=start, end_date='now')
    
    exp = Experience(
        user_id=random.choice(users_list).id,
        job_title=faker.job()[:150],
        company=faker.company()[:150],
        start_date=start,
        end_date=end,
        description=faker.text(max_nb_chars=200)
    )
    experiences_list.append(exp)

session.add_all(experiences_list)
session.commit()
print(f"✓ Seeded {len(experiences_list)} work experiences")

# ================== SEED NOTIFICATIONS ==================
print("Seeding notifications...")
notifications_list = []
notification_types = ["connection_request", "connection_accepted", "job_application", "application_status", "job_posted"]

for _ in range(100):
    sender = random.choice(users_list)
    receiver = random.choice([u for u in users_list if u.id != sender.id])
    
    notif = Notification(
        sender_id=sender.id,
        receiver_id=receiver.id,
        type=random.choice(notification_types),
        title=faker.sentence()[:255],
        message=faker.text(max_nb_chars=300),
        is_read=random.randint(0, 1),
        created_at=faker.date_time_this_year()
    )
    notifications_list.append(notif)

session.add_all(notifications_list)
session.commit()
print(f"✓ Seeded {len(notifications_list)} notifications")

# ================== SEED CONNECTION REQUESTS ==================
print("Seeding connection requests...")
connections_list = []
connection_combinations = set()

for _ in range(100):
    sender = random.choice(users_list)
    receiver = random.choice([u for u in users_list if u.id != sender.id])
    combo = tuple(sorted([sender.id, receiver.id]))
    
    if combo not in connection_combinations:
        connection_combinations.add(combo)
        conn = ConnectionRequest(
            sender_id=sender.id,
            receiver_id=receiver.id,
            status=random.choice(["pending", "accepted", "rejected"]),
            created_at=faker.date_time_this_year()
        )
        connections_list.append(conn)

session.add_all(connections_list)
session.commit()
print(f"✓ Seeded {len(connections_list)} connection requests")

print("\n" + "="*50)
print("✅ DATABASE SEEDED SUCCESSFULLY!")
print("="*50)

session.close()
