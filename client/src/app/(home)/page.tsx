"use client";

import { useMemo } from "react";
import LeftSidebar from "@/app/(home)/components/LeftSidebar";
import RightSidebar from "@/app/(home)/components/RightSidebar";
import PostCreator from "@/app/(home)/components/PostCreator";
import FeedPost from "@/app/(home)/components/FeedPost";
import { useRecentJobs } from "@/features/jobs/hooks";
import { useCurrentUser } from "@/features/auth/hook";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  const { data: currentUser } = useCurrentUser();
  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    isError: isJobsError,
  } = useRecentJobs(10);

  // Format job as feed post
  const jobFeedPosts = useMemo(() => {
    const jobs = jobsData?.jobs || [];
    return jobs.map((job) => {
      // If current user is the employer who posted this job, use their image
      const isCurrentUserJob =
        currentUser?.role === "employer" && currentUser?.id === job.employer_id;
      const avatarUrl =
        isCurrentUserJob &&
        currentUser?.image &&
        currentUser.image.trim() !== ""
          ? currentUser.image
          : undefined;

      return {
        id: job.id,
        author: {
          name: job.company_name || job.company || "Company",
          title: job.employment_type
            ? `${job.employment_type.replace("-", " ")} • ${job.location || "Remote"}`
            : job.location || "Remote",
          avatar: (job.company_name || job.company || "C")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2),
          avatarUrl: avatarUrl || undefined,
        },
        title: job.title,
        content: (
          <div className="my-6">
            <p className="text-muted-foreground mb-4 line-clamp-3">
              {job.description}
            </p>
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {job.skills.slice(0, 6).map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted text-muted-foreground rounded-lg text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ),
        likes: 0,
        comments: 0,
        job: job,
      };
    });
  }, [jobsData, currentUser]);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="flex relative pt-16">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-8 py-8">
          <div className="space-y-6 max-w-4xl">
            <PostCreator />

            {/* Loading State */}
            {isLoadingJobs && (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Error State */}
            {isJobsError && (
              <Card className="border-border">
                <CardContent className="p-6">
                  <p className="text-destructive">
                    Failed to load jobs. Please try again.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Feed Posts - Jobs */}
            {!isLoadingJobs &&
              !isJobsError &&
              jobFeedPosts.map((post) => (
                <FeedPost
                  key={post.id}
                  author={post.author}
                  title={post.title}
                  content={post.content}
                  likes={post.likes}
                  comments={post.comments}
                />
              ))}

            {/* Empty State */}
            {!isLoadingJobs && !isJobsError && jobFeedPosts.length === 0 && (
              <Card className="border-border">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground text-lg">
                    No jobs available at the moment. Check back later!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
