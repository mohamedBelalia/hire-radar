"use client";

import { useCurrentUser } from "@/features/auth/hook";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ErrorState from "@/components/profile/ErrorState";
import { useMemo } from "react";

export default function CandidateProfilePage() {
  const { data: currentUser, isLoading, error, refetch } = useCurrentUser();

  // Convert User data to CandidateProfile format for display
  const profile = useMemo(() => {
    if (!currentUser) return null;
    return {
      id: currentUser.id.toString(),
      full_name: currentUser.full_name,
      email: currentUser.email,
      profile_picture: currentUser.image,
      skills: [],
      bio: undefined,
      phone: undefined,
      location: undefined,
      experience_years: undefined,
      education: undefined,
      cv_url: undefined,
      linkedin_url: undefined,
      github_url: undefined,
      portfolio_url: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
          <ErrorState
            message={
              error instanceof Error ? error.message : "Failed to load profile"
            }
            onRetry={() => refetch()}
          />
        </div>
      </div>
    );
  }

  if (!profile || !currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900 p-8">
        <div className="max-w-5xl mx-auto">
          <ErrorState message="Profile not found. Please log in." />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 via-pink-50/20 to-white dark:from-gray-950 dark:via-purple-950/30 dark:via-pink-950/20 dark:to-gray-900 p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-200/50 dark:ring-purple-800/50 shadow-lg">
                {currentUser.image ? (
                  <img
                    src={currentUser.image}
                    alt={currentUser.full_name || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {currentUser.full_name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {currentUser.full_name}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {currentUser.email}
              </p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-semibold capitalize">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Account Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Full Name
              </label>
              <p className="text-gray-900 dark:text-white">{currentUser.full_name}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Email
              </label>
              <p className="text-gray-900 dark:text-white">{currentUser.email}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Role
              </label>
              <p className="text-gray-900 dark:text-white capitalize">
                {currentUser.role}
              </p>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Note:</strong> Complete profile features (skills, experience, CV upload) will be available once the backend candidate endpoints are implemented.
          </p>
        </div>
      </div>
    </div>
  );
}
