# Applications API Endpoints

## Overview
The Applications API allows candidates to apply for jobs and employers to manage applications. All endpoints follow the existing codebase patterns with service, controller, and route layers.

---

## Endpoints

### 1. **POST /api/job/{job_id}/apply** - Candidate applies for a job
Submit a job application as a candidate.

**Request Body:**
```json
{
  "user_id": 5,
  "cover_letter": "I am very interested in this position...",
  "resume_url": "/uploads/cvs/cv_5.pdf"
}
```

**Fields:**
- `user_id` (required): Candidate's user ID
- `cover_letter` (optional): Cover letter text
- `resume_url` (optional): Resume URL (defaults to candidate's saved resume if not provided)

**Response (201):**
```json
{
  "message": "Application submitted successfully",
  "application": {
    "id": 1,
    "job_id": 2,
    "user_id": 5,
    "resume_url": "/uploads/cvs/cv_5.pdf",
    "cover_letter": "I am very interested in this position...",
    "status": "pending",
    "applied_at": "2025-12-15T10:30:00",
    "job": {
      "id": 2,
      "title": "Senior Frontend Developer",
      "company": "Tech Innovations Inc."
    },
    "candidate": {
      "id": 5,
      "full_name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 2. **GET /api/applications** - List all applications
Retrieve all applications (admin/employer view).

**Query Parameters:** None

**Response (200):**
```json
{
  "applications": [
    {
      "id": 1,
      "job_id": 2,
      "user_id": 5,
      "resume_url": "/uploads/cvs/cv_5.pdf",
      "cover_letter": "I am interested...",
      "status": "pending",
      "applied_at": "2025-12-15T10:30:00",
      "job": {
        "id": 2,
        "title": "Senior Frontend Developer",
        "company": "Tech Innovations Inc."
      },
      "candidate": {
        "id": 5,
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "count": 1
}
```

---

### 3. **GET /api/candidates/{candidate_id}/applications** - Get candidate's applications
Retrieve all applications submitted by a specific candidate.

**Path Parameters:**
- `candidate_id` (required): Candidate's user ID

**Response (200):**
```json
{
  "applications": [
    {
      "id": 1,
      "job_id": 2,
      "user_id": 5,
      "resume_url": "/uploads/cvs/cv_5.pdf",
      "cover_letter": "I am interested...",
      "status": "pending",
      "applied_at": "2025-12-15T10:30:00",
      "job": {
        "id": 2,
        "title": "Senior Frontend Developer",
        "company": "Tech Innovations Inc."
      },
      "candidate": {
        "id": 5,
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "count": 1
}
```

---

### 4. **GET /api/job/{job_id}/applicants** - Get all applicants for a job
Retrieve all applicants for a specific job posting.

**Path Parameters:**
- `job_id` (required): Job ID

**Response (200):**
```json
{
  "applicants": [
    {
      "id": 1,
      "job_id": 2,
      "user_id": 5,
      "resume_url": "/uploads/cvs/cv_5.pdf",
      "cover_letter": "I am interested...",
      "status": "pending",
      "applied_at": "2025-12-15T10:30:00",
      "job": {
        "id": 2,
        "title": "Senior Frontend Developer",
        "company": "Tech Innovations Inc."
      },
      "candidate": {
        "id": 5,
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "count": 1
}
```

---

### 5. **GET /api/applications/{application_id}** - Get specific application
Retrieve details of a specific application.

**Path Parameters:**
- `application_id` (required): Application ID

**Response (200):**
```json
{
  "application": {
    "id": 1,
    "job_id": 2,
    "user_id": 5,
    "resume_url": "/uploads/cvs/cv_5.pdf",
    "cover_letter": "I am interested...",
    "status": "pending",
    "applied_at": "2025-12-15T10:30:00",
    "job": {
      "id": 2,
      "title": "Senior Frontend Developer",
      "company": "Tech Innovations Inc."
    },
    "candidate": {
      "id": 5,
      "full_name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 6. **PUT /api/applications/{application_id}** - Update application status
Update the status of an application (accepted, rejected, reviewed, pending).

**Path Parameters:**
- `application_id` (required): Application ID

**Request Body:**
```json
{
  "status": "accepted"
}
```

**Valid Status Values:**
- `pending` - Initial state
- `reviewed` - Application has been reviewed
- `accepted` - Application accepted
- `rejected` - Application rejected

**Response (200):**
```json
{
  "message": "Application updated successfully",
  "application": {
    "id": 1,
    "job_id": 2,
    "user_id": 5,
    "resume_url": "/uploads/cvs/cv_5.pdf",
    "cover_letter": "I am interested...",
    "status": "accepted",
    "applied_at": "2025-12-15T10:30:00",
    "job": {
      "id": 2,
      "title": "Senior Frontend Developer",
      "company": "Tech Innovations Inc."
    },
    "candidate": {
      "id": 5,
      "full_name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

### 7. **DELETE /api/applications/{application_id}** - Delete application
Delete an application.

**Path Parameters:**
- `application_id` (required): Application ID

**Response (200):**
```json
{
  "message": "Application deleted successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required field: user_id"
}
```

### 404 Not Found
```json
{
  "error": "Job not found"
}
```

### 400 Duplicate Application
```json
{
  "error": "Already applied to this job"
}
```

### 400 Invalid Status
```json
{
  "error": "Invalid status. Must be one of: pending, reviewed, accepted, rejected"
}
```

---

## Architecture

### Files Created/Modified:

1. **api/services/applications_service.py** - Business logic layer
   - `candidate_apply_for_job()` - Submit application
   - `get_all_applications()` - Retrieve all applications
   - `get_candidate_applications()` - Get candidate's applications
   - `get_job_applicants()` - Get job's applicants
   - `update_application_status()` - Update status
   - `get_application_by_id()` - Get specific application
   - `delete_application()` - Delete application
   - `application_to_dict()` - Serialize application

2. **api/controllers/applications.py** - Request handling layer
   - `apply_for_job()` - Handle apply endpoint
   - `list_all_applications()` - Handle list all endpoint
   - `list_candidate_applications()` - Handle candidate applications endpoint
   - `list_job_applicants()` - Handle job applicants endpoint
   - `update_application()` - Handle update endpoint
   - `get_application()` - Handle get specific endpoint
   - `remove_application()` - Handle delete endpoint

3. **api/routes/applications.py** - Route definitions
   - Registered at `/api/applications`

4. **api/routes/job.py** - Updated to include:
   - `POST /api/job/{job_id}/apply`
   - `GET /api/job/{job_id}/applicants`

5. **api/routes/candidates.py** - Updated to include:
   - `GET /api/candidates/{candidate_id}/applications`

6. **api/server.py** - Updated to register applications blueprint

---

## Key Features

✅ **Prevent Duplicate Applications** - Candidate cannot apply to same job twice
✅ **Automatic Resume Management** - Uses candidate's saved resume if not provided
✅ **Full CRUD Operations** - Create, Read, Update, Delete applications
✅ **Status Management** - Track application progress (pending → reviewed → accepted/rejected)
✅ **Relationship Data** - Returns job and candidate details with each application
✅ **Consistent Architecture** - Follows existing service/controller/route pattern
✅ **Error Handling** - Comprehensive validation and error messages
