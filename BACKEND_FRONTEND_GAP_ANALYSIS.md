# Backend vs Frontend Gap Analysis

## 📋 Summary

This document lists all backend routes and identifies which functionalities are missing in the frontend implementation.

---

## ✅ **BACKEND ROUTES AVAILABLE**

### 1. **Authentication Routes** (`/api/auth/*`)
All routes are **IMPLEMENTED** in frontend ✅

| Route | Method | Endpoint | Status | Frontend Location |
|-------|--------|----------|--------|-------------------|
| Google Login | GET | `/api/auth/google` | ✅ | `client/src/features/auth/api.ts` |
| Google Callback | GET | `/api/auth/google/callback` | ✅ | `client/src/app/api/auth/google/callback/route.ts` |
| Get Current User | GET | `/api/auth/me` | ✅ | `client/src/lib/api.ts` |
| Login | POST | `/api/auth/login` | ✅ | `client/src/lib/api.ts` |
| Signup | POST | `/api/auth/signup` | ✅ | `client/src/features/auth/api.ts` |
| Logout | POST | `/api/auth/logout` | ❌ | **NOT IMPLEMENTED** |

### 2. **Job Routes** (`/api/jobs/*`)
Most routes are **IMPLEMENTED** in frontend ✅

| Route | Method | Endpoint | Status | Frontend Location |
|-------|--------|----------|--------|-------------------|
| Search Jobs | GET | `/api/jobs?search=&location=&salary_min=&skill=&page=&limit=` | ✅ | `client/src/lib/api.ts` |
| Get Job by ID | GET | `/api/jobs/{id}` | ✅ | `client/src/lib/api.ts` |
| Create Job | POST | `/api/jobs` | ✅ | `client/src/lib/api.ts` |
| Update Job | PUT | `/api/jobs/{id}` | ✅ | `client/src/lib/api.ts` |
| Delete Job | DELETE | `/api/jobs/{id}` | ✅ | `client/src/lib/api.ts` |

---

## ❌ **MISSING BACKEND ROUTES** (Frontend expects these but backend doesn't have them)

### 3. **Candidate Profile Routes** (`/api/candidates/*`)
**STATUS: ❌ NOT IN BACKEND** - Frontend code exists but will fail

| Route | Method | Expected Endpoint | Frontend Location | Notes |
|-------|--------|-------------------|-------------------|-------|
| Get Candidate | GET | `/api/candidates/{id}` | `client/src/features/profile/api.ts` | Returns candidate profile with skills, education, experience |
| Update Candidate | PUT | `/api/candidates/{id}` | `client/src/features/profile/api.ts` | Update candidate profile |
| **Upload CV** | POST | `/api/candidates/{id}/upload-cv` | `client/src/features/profile/api.ts` | **CRITICAL: CV upload functionality** |
| Get Saved Jobs | GET | `/api/candidates/{id}/saved-jobs` | `client/src/features/jobs/api.ts` | Get all saved jobs for candidate |

### 4. **Employer Profile Routes** (`/api/employers/*`)
**STATUS: ❌ NOT IN BACKEND** - Frontend code exists but will fail

| Route | Method | Expected Endpoint | Frontend Location | Notes |
|-------|--------|-------------------|-------------------|-------|
| Get Employer | GET | `/api/employers/{id}` | `client/src/features/profile/api.ts` | Returns employer profile with company info |
| Update Employer | PUT | `/api/employers/{id}` | `client/src/features/profile/api.ts` | Update employer profile |

### 5. **Job Application Routes** (`/api/jobs/*`)
**STATUS: ❌ NOT IN BACKEND** - Frontend code exists but will fail

| Route | Method | Expected Endpoint | Frontend Location | Notes |
|-------|--------|-------------------|-------------------|-------|
| Apply to Job | POST | `/api/jobs/{jobId}/apply` | `client/src/features/jobs/api.ts` | Submit job application with cover letter and CV |
| Save Job | POST | `/api/jobs/{jobId}/save` | `client/src/features/jobs/api.ts` | Save a job for later |
| Unsave Job | DELETE | `/api/jobs/{jobId}/save` | `client/src/features/jobs/api.ts` | Remove saved job |

### 6. **Application Management Routes** (`/api/applications/*`)
**STATUS: ❌ NOT IN BACKEND** - Frontend code exists but will fail

| Route | Method | Expected Endpoint | Frontend Location | Notes |
|-------|--------|-------------------|-------------------|-------|
| Get All Applications | GET | `/api/applications` | `client/src/lib/api.ts` | Get all applications (for employers) |
| Get Job Applications | GET | `/api/applications?job_id={id}` | `client/src/lib/api.ts` | Get applications for a specific job |
| Update Application Status | PUT | `/api/applications/{id}` | `client/src/lib/api.ts` | Update status (pending/reviewed/accepted/rejected) |

### 7. **Skills Management Routes** (`/api/skills/*`)
**STATUS: ❌ NOT IN BACKEND** - Frontend code exists but will fail

| Route | Method | Expected Endpoint | Frontend Location | Notes |
|-------|--------|-------------------|-------------------|-------|
| Add Skill to Candidate | POST | `/api/candidates/{id}/skills` | `client/src/lib/api.ts` | Add skill to candidate profile |
| Remove Skill from Candidate | DELETE | `/api/candidates/{id}/skills/{skillId}` | `client/src/lib/api.ts` | Remove skill from candidate |

### 8. **AI Recommendations Routes** (`/api/ai/*`)
**STATUS: ❌ NOT IN BACKEND** - Frontend code exists but will fail

| Route | Method | Expected Endpoint | Frontend Location | Notes |
|-------|--------|-------------------|-------------------|-------|
| Recommend Jobs | GET | `/api/ai/recommend/jobs?candidate_id={id}` | `client/src/lib/api.ts` | AI-powered job recommendations |
| Recommend Candidates | GET | `/api/ai/recommend/candidates?job_id={id}` | `client/src/lib/api.ts` | AI-powered candidate recommendations |

---

## 🚨 **CRITICAL MISSING FEATURES**

### 1. **CV Upload Functionality** ⚠️ HIGH PRIORITY
- **Frontend expects**: `POST /api/candidates/{id}/upload-cv`
- **Current status**: Frontend has UI for CV upload but backend route doesn't exist
- **Impact**: Users cannot upload their CV/resume
- **Files affected**: 
  - `client/src/features/profile/api.ts` (line 29-45)
  - Profile pages with CV upload components

### 2. **Saved Jobs Functionality** ⚠️ HIGH PRIORITY
- **Frontend expects**: 
  - `POST /api/jobs/{jobId}/save`
  - `DELETE /api/jobs/{jobId}/save`
  - `GET /api/candidates/{id}/saved-jobs`
- **Current status**: Frontend has saved jobs page but backend routes don't exist
- **Impact**: Users cannot save/unsave jobs
- **Files affected**:
  - `client/src/features/jobs/api.ts` (lines 33-50)
  - `client/src/app/dashboard/candidate/saved-jobs/page.tsx`

### 3. **Job Application Functionality** ⚠️ HIGH PRIORITY
- **Frontend expects**: `POST /api/jobs/{jobId}/apply`
- **Current status**: Frontend has apply modal but backend route doesn't exist
- **Impact**: Users cannot apply to jobs
- **Files affected**:
  - `client/src/features/jobs/api.ts` (lines 52-73)
  - `client/src/components/jobs/ApplyModal.tsx`

### 4. **Candidate Profile Management** ⚠️ MEDIUM PRIORITY
- **Frontend expects**: 
  - `GET /api/candidates/{id}`
  - `PUT /api/candidates/{id}`
- **Current status**: Frontend has profile pages but backend routes don't exist
- **Impact**: Cannot view/update candidate profiles
- **Files affected**:
  - `client/src/features/profile/api.ts` (lines 11-26)

### 5. **Employer Profile Management** ⚠️ MEDIUM PRIORITY
- **Frontend expects**: 
  - `GET /api/employers/{id}`
  - `PUT /api/employers/{id}`
- **Current status**: Frontend has profile pages but backend routes don't exist
- **Impact**: Cannot view/update employer profiles
- **Files affected**:
  - `client/src/features/profile/api.ts` (lines 48-62)

---

## 📝 **RECOMMENDATIONS**

### Immediate Actions Required:

1. **Implement CV Upload Backend Route**
   - Create `POST /api/candidates/{id}/upload-cv` endpoint
   - Handle file upload (PDF, DOC, DOCX)
   - Store file in `uploads/cvs/` directory
   - Update candidate's `resume_url` in database

2. **Implement Saved Jobs Backend Routes**
   - Create `POST /api/jobs/{jobId}/save` endpoint
   - Create `DELETE /api/jobs/{jobId}/save` endpoint
   - Create `GET /api/candidates/{id}/saved-jobs` endpoint
   - Add `saved_jobs` table to database (if not exists)

3. **Implement Job Application Backend Route**
   - Create `POST /api/jobs/{jobId}/apply` endpoint
   - Handle cover letter and CV file upload
   - Create application record in database
   - Add `applications` table to database (if not exists)

4. **Implement Candidate Profile Routes**
   - Create `GET /api/candidates/{id}` endpoint
   - Create `PUT /api/candidates/{id}` endpoint
   - Return candidate data with skills, education, experience

5. **Implement Employer Profile Routes**
   - Create `GET /api/employers/{id}` endpoint
   - Create `PUT /api/employers/{id}` endpoint
   - Return employer data with company information

6. **Fix Logout Route**
   - Frontend doesn't call `/api/auth/logout` - implement it or remove from backend

---

## 🔍 **DATABASE MODELS NEEDED**

Based on frontend expectations, you may need these additional models:

1. **SavedJob** - Many-to-many relationship between User and Job
2. **Application** - Job applications with status, cover letter, CV
3. **Candidate** - Extended profile with skills, education, experience
4. **Employer** - Extended profile with company information
5. **Skill** - Skills table for candidates
6. **Education** - Education history for candidates
7. **Experience** - Work experience for candidates

---

## 📊 **IMPLEMENTATION STATUS**

| Feature Category | Backend | Frontend | Status |
|-----------------|---------|----------|--------|
| Authentication | ✅ | ✅ | Complete |
| Job CRUD | ✅ | ✅ | Complete |
| CV Upload | ❌ | ✅ | **Missing Backend** |
| Saved Jobs | ❌ | ✅ | **Missing Backend** |
| Job Applications | ❌ | ✅ | **Missing Backend** |
| Candidate Profiles | ❌ | ✅ | **Missing Backend** |
| Employer Profiles | ❌ | ✅ | **Missing Backend** |
| Skills Management | ❌ | ✅ | **Missing Backend** |
| AI Recommendations | ❌ | ✅ | **Missing Backend** |

---

## 🎯 **NEXT STEPS**

1. Review this document and prioritize which features to implement first
2. Create database migrations for missing tables (SavedJob, Application, etc.)
3. Implement backend routes starting with high-priority features (CV upload, Saved Jobs, Applications)
4. Test each endpoint with the existing frontend code
5. Update frontend API calls if needed to match backend response format
