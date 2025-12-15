"use client";

import {
  MapPin,
  DollarSign,
  Briefcase,
  BookmarkCheck,
  ExternalLink,
  X,
} from "lucide-react";
import { Job } from "@/types/job";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUnsaveJob } from "@/features/jobs/hooks";
import { toast } from "sonner";
import Link from "next/link";

interface SavedJobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  onUnsave?: (jobId: string) => void;
}

/**
 * Renders a saved job card showing job details (title, company, description, location, salary, employment type, and skills) and actions to apply, view details, or remove the job from saved list.
 *
 * @param job - The job object to display.
 * @param onApply - Optional callback invoked with the `job` when the "Apply Now" button is clicked.
 * @param onUnsave - Optional callback invoked with the job id (as a string) after the job is successfully unsaved.
 * @returns A card element containing the job information and action controls.
 */
export default function SavedJobCard({
  job,
  onApply,
  onUnsave,
}: SavedJobCardProps) {
  const unsaveMutation = useUnsaveJob();

  const handleUnsave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await unsaveMutation.mutateAsync(job.id);
      toast.success("Job removed from saved");
      if (onUnsave) {
        onUnsave(job.id.toString());
      }
    } catch {
      toast.error("Failed to unsave job. Please try again.");
    }
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onApply) {
      onApply(job);
    }
  };

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max && !job.salary_range) return null;

    if (job.salary_range) {
      return job.salary_range;
    }

    const currency = job.salary_currency || "$";
    if (job.salary_min && job.salary_max) {
      return `${currency}${job.salary_min.toLocaleString()} - ${currency}${job.salary_max.toLocaleString()}`;
    }
    if (job.salary_min) {
      return `${currency}${job.salary_min.toLocaleString()}+`;
    }
    return null;
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <BookmarkCheck className="w-5 h-5 text-foreground" />
              <Badge
                variant="secondary"
                className="text-xs uppercase tracking-wide"
              >
                Saved
              </Badge>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-foreground/80 transition-colors line-clamp-2">
              {job.title}
            </h3>
            <p className="text-base font-semibold text-foreground/70 mb-1">
              {job.company_name || job.company}
            </p>
          </div>
          <button
            onClick={handleUnsave}
            disabled={unsaveMutation.isPending}
            className="p-2 hover:bg-destructive/10 rounded-md transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Unsave job"
          >
            <X className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
          </button>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
          {job.description}
        </p>

        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
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
          {(job.employment_type || job.emp_type) && (
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4" />
              <span className="capitalize">
                {(job.employment_type || job.emp_type || "").replace("-", " ")}
              </span>
            </div>
          )}
        </div>

        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 5).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs font-medium bg-muted text-muted-foreground"
              >
                {skill}
              </Badge>
            ))}
            {job.skills.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{job.skills.length - 5} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-6 px-6 flex items-center gap-3 border-t border-border">
        <Button
          onClick={handleApply}
          className="flex-1 bg-foreground text-background hover:bg-foreground/90 font-semibold"
        >
          Apply Now
        </Button>
        <Button
          variant="outline"
          asChild
          className="border-border hover:bg-accent"
        >
          <Link href={`/jobs/${job.id}`}>
            <ExternalLink className="w-4 h-4 mr-2" />
            Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}