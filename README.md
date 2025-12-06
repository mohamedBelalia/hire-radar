
# HireRadar – AI-Powered Recruitment Platform  
HireRadar is a web platform that connects employers and candidates using AI-driven job and profile recommendations.  
The system analyzes data from both sides to match candidates with the most relevant job opportunities.

---

## Tech Stack

### **Frontend**
- Next.js 14 (App Router)
- TailwindCSS
- React Query / SWR
- TypeScript

### **Backend**
- Flask (Python)
- SQLAlchemy
- PostgreSQL
- Docker
- REST API

### **AI / Machine Learning**
- Scikit-Learn / TensorFlow
- Recommendation models (Content-based filtering, similarity scoring)

### **DevOps**
- Docker & Docker Compose
- GitHub CI/CD
- Automated testing

---

## Project Features

### **Candidate**
- Create account & fill profile
- Upload CV
- Define skills & experience
- See recommended jobs
- Apply to jobs
- Receive employer interactions

### **Employer**
- Create company account
- Publish job offers
- Get recommended candidates
- Filter and search profiles
- Manage applications

### **AI**
- Job → Candidate matching
- Candidate → Job recommendation
- Profile scoring
- Similarity engine

---

## Project Structure

hireradar/
│
├── client/               # Next.js app
├── server/                # Flask API
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── ai/
│   │   └── utils/
│   ├── migrations/
│   └── main.py
│
├── docker-compose.yml
└── README.md



---

## Database Schema (PostgreSQL)

Main tables:

- `users`
- `candidates`
- `employers`
- `jobs`
- `applications`
- `skills`
- `candidate_skills`
- `job_skills`
- `cv_files`

A detailed UML diagram is included in the project documentation.

---

## API Endpoints (Overview)

### **Auth**
- `POST /auth/register`
- `POST /auth/login`

### **Candidates**
- `GET /candidates/:id`
- `PUT /candidates/:id`
- `POST /candidates/:id/upload-cv`

### **Employers**
- `GET /employers/:id`
- `PUT /employers/:id`

### **Jobs**
- `POST /jobs`
- `GET /jobs`
- `GET /jobs/:id`

### **Applications**
- `POST /applications`
- `GET /applications/candidate/:id`
- `GET /applications/job/:id`

### **AI Recommendations**
- `GET /recommendations/jobs/:candidate_id`
- `GET /recommendations/candidates/:job_id`

More details are available in the `/docs` folder.

---

## Team Members

- **Mohamed Belalia** – AI & data science student
- **Soufiane** – AI & data science student
- **Moad** – AI & data science student

---

## Development Setup

### **Requirements**
- Node.js ≥ 18
- Python ≥ 3.10
- Docker Desktop
- PostgreSQL

### **Run locally**

#### **Frontend**
```bash
cd frontend
npm install
npm run dev

