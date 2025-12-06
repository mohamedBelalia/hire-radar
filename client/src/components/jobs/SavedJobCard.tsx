'use client';

import { MapPin, DollarSign, Briefcase, BookmarkCheck, ExternalLink, X } from 'lucide-react';
import { Job } from '@/types/job';
import { Button } from '@/components/ui/button';
import { useUnsaveJob } from '@/features/jobs/hooks';
import { toast } from 'sonner';

interface SavedJobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  onUnsave?: (jobId: string) => void;
}

export default function SavedJobCard({ job, onApply, onUnsave }: SavedJobCardProps) {
  const unsaveMutation = useUnsaveJob();

  const handleUnsave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await unsaveMutation.mutateAsync(job.id);
      toast.success('Job removed from saved');
      if (onUnsave) {
        onUnsave(job.id);
      }
    } catch (error) {
      toast.error('Failed to unsave job. Please try again.');
    }
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(job);
    } else {
      // Default: navigate to job detail page
      window.location.href = `/jobs/${job.id}`;
    }
  };

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null;
    const currency = job.salary_currency || '$';
    if (job.salary_min && job.salary_max) {
      return `${currency}${job.salary_min.toLocaleString()} - ${currency}${job.salary_max.toLocaleString()}`;
    }
    if (job.salary_min) {
      return `${currency}${job.salary_min.toLocaleString()}+`;
    }
    return null;
  };

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-purple-300/50 dark:hover:border-purple-600/50 group">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BookmarkCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
              Saved
            </span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            {job.title}
          </h3>
          <p className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-1">
            {job.company_name}
          </p>
        </div>
        <button
          onClick={handleUnsave}
          disabled={unsaveMutation.isPending}
          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors flex-shrink-0 group/unsave"
          aria-label="Unsave job"
        >
          <X className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover/unsave:text-red-600 dark:group-hover/unsave:text-red-400 transition-colors" />
        </button>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
        {job.description}
      </p>

      <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
        {job.location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
          </div>
        )}
        {formatSalary() && (
          <div className="flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            <span>{formatSalary()}</span>
          </div>
        )}
        {job.employment_type && (
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            <span className="capitalize">{job.employment_type.replace('-', ' ')}</span>
          </div>
        )}
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {job.skills.slice(0, 5).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-semibold"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-semibold">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          onClick={handleApply}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold"
        >
          Apply Now
        </Button>
        <Button
          variant="outline"
          onClick={() => window.location.href = `/jobs/${job.id}`}
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          View Details
        </Button>
      </div>
    </div>
  );
}
