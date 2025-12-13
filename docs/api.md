---

## 🧱 Database Schema (PostgreSQL)

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

## 🔗 API Endpoints (Overview)

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

## 👥 Team Members

- **Mohamed Belalia** – Frontend Lead + System Architecture
- **Soufiane** – Backend Lead + API + Database
- **Moad** – AI/ML Engineer + Integration

---

## 🛠️ Development Setup

### **Requirements**

- Node.js ≥ 18
- Python ≥ 3.10
- Docker Desktop
- PostgreSQL
