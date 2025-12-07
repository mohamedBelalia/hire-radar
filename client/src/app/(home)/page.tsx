"use client";

import { useMemo } from "react";
import TopNavbar from "@/components/TopNavbar";
import LeftSidebar from "@/app/(home)/components/LeftSidebar";
import RightSidebar from "@/app/(home)/components/RightSidebar";
import PostCreator from "@/app/(home)/components/PostCreator";
import FeedPost from "@/app/(home)/components/FeedPost";
import { useRecentJobs } from "@/features/jobs/hooks";
import { useCurrentUser } from "@/features/auth/hook";
import JobCardSkeleton from "@/components/jobs/JobCardSkeleton";

export default function Home() {
  const { data: currentUser } = useCurrentUser();
  const {
    data: jobsData,
    isLoading: isLoadingJobs,
    isError: isJobsError,
  } = useRecentJobs(10);

  const jobs = jobsData?.jobs || [];

  // Format job as feed post
  const jobFeedPosts = useMemo(() => {
    return jobs.map((job) => ({
      id: job.id,
      author: {
        name: job.company_name,
        title: job.employment_type
          ? `${job.employment_type.replace("-", " ")} • ${job.location || "Remote"}`
          : job.location || "Remote",
        avatar: job.company_name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      },
      title: job.title,
      content: (
        <div className="my-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
            {job.description}
          </p>
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 6).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      ),
      likes: 0, // TODO: Add likes functionality
      comments: 0, // TODO: Add comments functionality
      job: job,
    }));
  }, [jobs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900 transition-colors duration-300">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
      </div>

      <TopNavbar />

      <div className="flex relative pt-16">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 px-8 py-8 ml-64 mr-96">
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
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                <p className="text-red-600 dark:text-red-400">
                  Failed to load jobs. Please try again.
                </p>
              </div>
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
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No jobs available at the moment. Check back later!
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  );
}
