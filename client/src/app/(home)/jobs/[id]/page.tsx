"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useJob,
  useApplyJob,
  useRecommendedCandidates,
  useReportJob,
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
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = parseInt(params.id as string);
  const { data: currentUser } = useCurrentUser();

  const { data: job, isLoading, isError } = useJob(jobId);

  const { data: recommendedCandidates, isLoading: isLoadingCandidates } =
    useRecommendedCandidates(jobId);

  const applyMutation = useApplyJob();
  const reportMutation = useReportJob();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const handleApply = async () => {
    try {
      await applyMutation.mutateAsync({
        jobId: jobId,
        coverLetter: coverLetter || undefined,
      });
      setIsApplyModalOpen(false);
      setCoverLetter("");
    } catch {
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

  const reportReasons = [
    "Spam or scam",
    "Discriminatory content",
    "Misleading or fake",
    "Expired or closed",
    "Salary not disclosed",
    "Offensive language",
    "Requires payment",
    "Wrong location",
    "Wrong company",
    "Duplicate listing",
    "Other",
  ];

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
                onClick={() => router.push("/search")}
                variant="outline"
                className="border-border"
              >
                Back to search
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
      <div className="container mx-auto px-4 md:px-6 py-10 max-w-6xl pt-24 space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="px-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Badge variant="outline">Job #{job.id}</Badge>
        </div>

        <Card className="border-border">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-muted-foreground" />
                  <div className="text-sm text-muted-foreground">
                    {job.company_name || job.company || "Company"}
                  </div>
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap gap-3 text-muted-foreground">
                  {job.location && (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                  )}
                  {(job.employment_type || job.emp_type) && (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Briefcase className="w-4 h-4" />
                      {(job.employment_type || job.emp_type || "").replace(
                        "-",
                        " ",
                      )}
                    </span>
                  )}
                  {job.created_at && (
                    <span className="inline-flex items-center gap-1 text-sm">
                      <Calendar className="w-4 h-4" />
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {formatSalary() && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {formatSalary()}
                    </Badge>
                  )}
                  {job.experience_level && (
                    <Badge variant="secondary" className="capitalize">
                      {job.experience_level}
                    </Badge>
                  )}
                </div>
              </div>

              {isCandidate && (
                <div className="flex flex-col gap-2 w-full lg:w-auto">
                  <Button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full bg-foreground text-background hover:bg-foreground/90"
                    size="lg"
                  >
                    Apply Now
                  </Button>
                  {job.application_deadline && (
                    <p className="text-xs text-muted-foreground text-center">
                      Apply by {new Date(job.application_deadline).toLocaleDateString()}
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full text-sm"
                    onClick={() => setIsReportModalOpen(true)}
                  >
                    Report job
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>About the role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {job.description || "No description provided."}
                </p>
                {job.skills && job.skills.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Key skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="capitalize">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

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
          </div>

          <div className="space-y-6">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Job details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Company</span>
                  <span className="text-foreground font-medium">
                    {job.company_name || job.company || "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Employment</span>
                  <span className="text-foreground font-medium capitalize">
                    {(job.employment_type || job.emp_type || "—").replace("-", " ")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Location</span>
                  <span className="text-foreground font-medium">
                    {job.location || "Remote / Flexible"}
                  </span>
                </div>
                {formatSalary() && (
                  <div className="flex items-center justify-between">
                    <span>Compensation</span>
                    <span className="text-foreground font-medium">{formatSalary()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {job.employer && (
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>Posted by</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={job.employer.image || undefined} />
                      <AvatarFallback className="bg-foreground text-background">
                        {(job.employer.full_name || "HR").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {job.employer.full_name || "Hiring Manager"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {job.employer.headLine || job.employer.role || "Employer"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      variant="secondary"
                      onClick={() =>
                        job.employer?.id &&
                        router.push(`/connections?userId=${job.employer.id}`)
                      }
                    >
                      View profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

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
                            className="flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-colors cursor-not-allowed opacity-60"
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

        <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
          <DialogContent className="border-border max-w-lg">
            <DialogHeader>
              <DialogTitle>Report this job</DialogTitle>
              <DialogDescription>
                Tell us why this job is inappropriate or incorrect.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {reportReasons.map((reason) => (
                  <Button
                    key={reason}
                    variant={selectedReason === reason ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedReason(reason)}
                  >
                    {reason}
                  </Button>
                ))}
              </div>
              {selectedReason === "Other" && (
                <div className="space-y-2">
                  <Label htmlFor="customReason">Add a reason</Label>
                  <Textarea
                    id="customReason"
                    placeholder="Describe the issue..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="bg-background border-border"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsReportModalOpen(false);
                  setSelectedReason("");
                  setCustomReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  reportMutation.isPending ||
                  !selectedReason ||
                  (selectedReason === "Other" && !customReason.trim())
                }
                onClick={async () => {
                  const reason =
                    selectedReason === "Other"
                      ? customReason.trim()
                      : selectedReason;
                  await reportMutation.mutateAsync({ jobId, reason });
                  setIsReportModalOpen(false);
                  setSelectedReason("");
                  setCustomReason("");
                }}
              >
                {reportMutation.isPending ? "Submitting..." : "Submit report"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
