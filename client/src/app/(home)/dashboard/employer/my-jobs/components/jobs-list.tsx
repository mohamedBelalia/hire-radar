"use client";

import { EmployerJob } from "../api";
import { JobCard } from "./job-card";
import { Loader2 } from "lucide-react";

interface JobsListProps {
  jobs: EmployerJob[];
  isLoading: boolean;
  onEdit: (job: EmployerJob) => void;
  onDelete: (jobId: number) => Promise<void>;
  isDeleting?: number | null;
}

export function JobsList({
  jobs,
  isLoading,
  onEdit,
  onDelete,
  isDeleting,
}: JobsListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-base">
          No job postings yet. Create your first job to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          onEdit={onEdit}
          onDelete={onDelete}
          isDeleting={isDeleting === job.id}
        />
      ))}
    </div>
  );
}
