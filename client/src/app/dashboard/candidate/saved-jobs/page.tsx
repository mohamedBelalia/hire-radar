'use client';

import { useState } from 'react';
import SavedJobCard from '@/components/jobs/SavedJobCard';
import JobCardSkeleton from '@/components/jobs/JobCardSkeleton';
import SavedJobsEmptyState from '@/components/jobs/SavedJobsEmptyState';
import ApplyModal from '@/components/jobs/ApplyModal';
import { useSavedJobs, useApplyToJob } from '@/features/jobs/hooks';
import { useCurrentUserId } from '@/hooks/useCurrentUserId';
import { Job } from '@/types/job';
import { toast } from 'sonner';

export default function SavedJobsPage() {
  const candidateId = useCurrentUserId();
  const { data: savedJobs, isLoading, isError, error, refetch } = useSavedJobs(candidateId);
  const applyMutation = useApplyToJob();

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const handleApply = (job: Job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async (
    jobId: string,
    coverLetter?: string,
    cvFile?: File
  ) => {
    try {
      await applyMutation.mutateAsync({
        jobId,
        applicationData: {
          cover_letter: coverLetter,
          cv_file: cvFile,
        },
      });
      toast.success('Application submitted successfully!');
      setIsApplyModalOpen(false);
      setSelectedJob(null);
    } catch (error) {
      toast.error('Failed to submit application. Please try again.');
      throw error;
    }
  };

  const handleUnsave = (jobId: string) => {
    // The query will automatically refetch after unsave mutation
    // This callback can be used for additional cleanup if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Saved Jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {savedJobs && savedJobs.length > 0
              ? `${savedJobs.length} job${savedJobs.length !== 1 ? 's' : ''} saved`
              : 'Jobs you save will appear here'}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">
              {error instanceof Error ? error.message : 'Failed to load saved jobs. Please try again.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!savedJobs || savedJobs.length === 0) && (
          <SavedJobsEmptyState />
        )}

        {/* Saved Jobs List */}
        {!isLoading && !isError && savedJobs && savedJobs.length > 0 && (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <SavedJobCard
                key={job.id}
                job={job}
                onApply={handleApply}
                onUnsave={handleUnsave}
              />
            ))}
          </div>
        )}

        {/* Apply Modal */}
        <ApplyModal
          isOpen={isApplyModalOpen}
          onClose={() => {
            setIsApplyModalOpen(false);
            setSelectedJob(null);
          }}
          job={selectedJob}
          onApply={handleSubmitApplication}
        />
      </div>
    </div>
  );
}
