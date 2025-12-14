"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useJob,
  useApplyJob,
  useRecommendedCandidates,
} from "@/features/jobs/hooks";
import { useCurrentUser } from "@/features/auth/hook";
import TopNavbar from "@/components/TopNavbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  DollarSign,
  Briefcase,
  Building2,
  Calendar,
  ExternalLink,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

/**
 * Renders the Job Details page with job information, company details, and role-specific actions.
 *
 * Shows loading skeletons while data is fetched and an error card if loading fails. When a job is available it presents the title, company, location, salary, employment type, posting date, description, responsibilities, and required skills; candidates see an "Apply" modal with an optional cover letter field and employers see a recommended candidates sidebar. The apply flow closes the modal and clears the cover letter on successful submission.
 *
 * @returns The page's JSX element tree for the job details view.
 */
export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = parseInt(params.id as string);
  const { data: currentUser } = useCurrentUser();

  const { data: job, isLoading, isError } = useJob(jobId);

  const { data: recommendedCandidates, isLoading: isLoadingCandidates } =
    useRecommendedCandidates(jobId);

  const applyMutation = useApplyJob();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");

  const handleApply = async () => {
    try {
      await applyMutation.mutateAsync({
        jobId: jobId,
        coverLetter: coverLetter || undefined,
      });
      setIsApplyModalOpen(false);
      setCoverLetter("");
    } catch (error) {
      // Error handled by mutation
    }
  };

  const formatSalary = () => {
    if (!job?.salary_min && !job?.salary_max && !job?.salary_range) return null;

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

  const isEmployer = currentUser?.role === "employer";
  const isCandidate = currentUser?.role === "candidate";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar />
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl pt-24">
          <Card className="border-border">
            <CardContent className="p-8">
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-1/2 mb-8" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError || !job) {
    return (
      <div className="min-h-screen bg-background">
        <TopNavbar />
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl pt-24">
          <Card className="border-border">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Job not found or failed to load.
              </p>
              <Button
                onClick={() => router.push("/jobs/search")}
                variant="outline"
                className="border-border"
              >
                Back to Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNavbar />
      <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl pt-24">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            ← Back
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header */}
            <Card className="border-border">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold mb-4">{job.title}</h1>
                    <div className="flex items-center gap-4 mb-4 text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        <span className="font-semibold text-foreground">
                          {job.company_name || job.company}
                        </span>
                      </div>
                      {job.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {formatSalary() && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <DollarSign className="w-3 h-3" />
                          {formatSalary()}
                        </Badge>
                      )}
                      {(job.employment_type || job.emp_type) && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Briefcase className="w-3 h-3" />
                          {(job.employment_type || job.emp_type || "").replace(
                            "-",
                            " ",
                          )}
                        </Badge>
                      )}
                      {job.created_at && (
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Calendar className="w-3 h-3" />
                          Posted {new Date(job.created_at).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {isCandidate && (
                  <Button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full bg-foreground text-background hover:bg-foreground/90"
                    size="lg"
                  >
                    Apply Now
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {job.description || "No description provided."}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Company</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-semibold mb-2">
                  {job.company_name || job.company}
                </p>
                {/* Note: Employer profile endpoint doesn't exist in backend yet */}
                <Button
                  variant="outline"
                  disabled
                  className="w-full border-border"
                >
                  View Company Profile
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Recommended Candidates (for employers) */}
            {isEmployer &&
              recommendedCandidates &&
              recommendedCandidates.length > 0 && (
                <Card className="border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Recommended Candidates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoadingCandidates ? (
                        <div className="space-y-2">
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-16 w-full" />
                          ))}
                        </div>
                      ) : (
                        recommendedCandidates.slice(0, 5).map((candidate) => (
                          <div
                            key={candidate.id}
                            className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors cursor-not-allowed opacity-50"
                          >
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={candidate.user?.image || undefined}
                                alt={candidate.user?.full_name || "Candidate"}
                              />
                              <AvatarFallback className="bg-foreground text-background text-xs">
                                {candidate.user?.full_name
                                  ?.split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2) || "C"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {candidate.user?.full_name || "Candidate"}
                              </p>
                              {candidate.match_score && (
                                <p className="text-xs text-muted-foreground">
                                  {Math.round(candidate.match_score * 100)}%
                                  match
                                </p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>

        {/* Apply Modal */}
        <Dialog open={isApplyModalOpen} onOpenChange={setIsApplyModalOpen}>
          <DialogContent className="border-border">
            <DialogHeader>
              <DialogTitle>Apply to {job.title}</DialogTitle>
              <DialogDescription>
                {job.company_name || job.company}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell the employer why you're a great fit..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="min-h-[120px] bg-background border-border"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setCoverLetter("");
                }}
                className="border-border"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApply}
                disabled={applyMutation.isPending}
                className="bg-foreground text-background hover:bg-foreground/90"
              >
                {applyMutation.isPending
                  ? "Submitting..."
                  : "Submit Application"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}