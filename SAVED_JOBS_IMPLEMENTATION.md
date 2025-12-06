# Saved Jobs Page Implementation

Complete Saved Jobs page for candidates with modern UI similar to LinkedIn.

## 📁 Folder Structure

```
client/src/
├── features/
│   └── jobs/
│       ├── api.ts                      # Updated with getSavedJobs & applyToJob
│       └── hooks.ts                    # Updated with useSavedJobs & useApplyToJob
├── components/
│   └── jobs/
│       ├── SavedJobCard.tsx           # Saved job card component
│       └── SavedJobsEmptyState.tsx    # Empty state component
└── app/
    └── dashboard/
        └── candidate/
            └── saved-jobs/
                └── page.tsx            # Saved jobs page
```

## 🎯 Features Implemented

### ✅ API Integration
- **GET** `/candidates/{id}/saved-jobs` - Fetch saved jobs
- **DELETE** `/jobs/{id}/save` - Unsave a job (already existed)
- **POST** `/jobs/{id}/apply` - Apply to a job

### ✅ React Query Hooks
- `useSavedJobs(candidateId)` - Fetch saved jobs for a candidate
- `useUnsaveJob()` - Unsave job mutation (updated to invalidate saved-jobs query)
- `useApplyToJob()` - Apply to job mutation

### ✅ Components
1. **SavedJobCard** - Specialized card for saved jobs:
   - "Saved" badge indicator
   - Unsave button (X icon)
   - Apply button
   - View details link
   - All job information (title, company, location, salary, skills)

2. **SavedJobsEmptyState** - Empty state:
   - Friendly message
   - "Browse Jobs" button to navigate to search

3. **ApplyModal** - Reused from jobs search:
   - Cover letter textarea
   - CV upload
   - Form submission

### ✅ Page Features
- **Header** - Shows count of saved jobs
- **Loading State** - Skeleton loaders
- **Error Handling** - User-friendly error messages with retry
- **Empty State** - Helpful message when no saved jobs
- **Job List** - Displays all saved jobs
- **Apply Functionality** - Opens modal to apply
- **Unsave Functionality** - Remove jobs from saved list

## 🎨 UI Features

- **Modern Design**: Clean, LinkedIn-inspired UI
- **Dark Mode Support**: Full dark mode compatibility
- **Glassmorphism**: Transparent cards with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Responsive Design**: Works on all screen sizes
- **Visual Indicators**: "Saved" badge on each job card

## 🔧 Usage

### Saved Jobs Page
Navigate to: `/dashboard/candidate/saved-jobs`

### Features
- **View Saved Jobs**: See all jobs you've saved
- **Unsave Job**: Click X button to remove from saved list
- **Apply to Job**: Click "Apply Now" to submit application
- **View Details**: Click "View Details" to see full job description

## 📝 API Endpoints

### Get Saved Jobs
```
GET /candidates/{id}/saved-jobs
Response: Job[]
```

### Unsave Job
```
DELETE /jobs/{id}/save
Response: { message: string, job_id: string, saved: boolean }
```

### Apply to Job
```
POST /jobs/{id}/apply
Body: FormData {
  cover_letter?: string
  cv_file?: File
}
Response: { message: string, application_id: string }
```

## 🔄 Data Flow

1. Page loads → `useSavedJobs(candidateId)` fetches saved jobs
2. Jobs display → Each job shown in `SavedJobCard`
3. User unsaves → `useUnsaveJob()` mutation → Cache invalidates → List updates
4. User applies → Opens `ApplyModal` → Submits application → Success toast
5. Empty state → Shows when no saved jobs → "Browse Jobs" button

## 🎯 Key Features

### SavedJobCard Component
- **Visual Indicator**: Purple "Saved" badge with bookmark icon
- **Unsave Button**: Red X button on hover
- **Job Information**: Title, company, location, salary, skills
- **Actions**: Apply and View Details buttons

### Cache Management
- `useUnsaveJob` invalidates both `["jobs"]` and `["saved-jobs"]` queries
- Automatic refetch after unsave action
- Optimistic updates for better UX

### Error Handling
- Network errors display friendly message
- Retry button to refetch data
- Toast notifications for actions

## 🚀 Next Steps

1. **Sort Options**: Add sorting (date saved, salary, location)
2. **Filter Saved Jobs**: Filter by location, salary, skills
3. **Bulk Actions**: Select multiple jobs to unsave
4. **Job Alerts**: Set up alerts for similar jobs
5. **Export Saved Jobs**: Export list as PDF/CSV

## 📦 Dependencies

- `@tanstack/react-query` - Data fetching & caching
- `axios` - HTTP client
- `sonner` - Toast notifications
- `lucide-react` - Icons
- `next` - Framework

## 🎨 Design Highlights

### SavedJobCard
- Purple "Saved" badge at top
- Hover effects on card
- Red X button for unsave (appears on hover)
- Gradient apply button
- Skills displayed as tags

### Empty State
- Large bookmark icon
- Friendly message
- Call-to-action button
- Centered layout

### Page Layout
- Clean header with job count
- Spacious card layout
- Consistent spacing
- Responsive grid
