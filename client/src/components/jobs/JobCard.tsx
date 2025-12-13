"use client";

import {
  MapPin,
  DollarSign,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
} from "lucide-react";
import { Job } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSaveJob, useUnsaveJob } from "@/features/jobs/hooks";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface JobCardProps {
  job: Job;
  onApply?: (job: Job) => void;
  showDetails?: boolean;
}

export default function JobCard({
  job,
  onApply,
  showDetails = true,
}: JobCardProps) {
  const saveMutation = useSaveJob();
  const unsaveMutation = useUnsaveJob();
  const [isSaved, setIsSaved] = useState(job.is_saved || false);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (isSaved) {
        await unsaveMutation.mutateAsync(job.id);
        setIsSaved(false);
        toast.success("Job unsaved");
      } else {
        await saveMutation.mutateAsync(job.id);
        setIsSaved(true);
        toast.success("Job saved");
      }
    } catch {
      toast.error("Failed to save job. Please try again.");
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
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-foreground/80 transition-colors line-clamp-2">
              {job.title}
            </h3>
            <p className="text-base font-semibold text-foreground/70 mb-1">
              {job.company_name || job.company}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending || unsaveMutation.isPending}
            className="p-2 hover:bg-accent rounded-md transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={isSaved ? "Unsave job" : "Save job"}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-foreground" />
            ) : (
              <Bookmark className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            )}
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
        {showDetails && (
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
        )}
      </CardFooter>
    </Card>
  );
}
