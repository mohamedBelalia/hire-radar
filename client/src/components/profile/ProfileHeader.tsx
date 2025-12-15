"use client";

import { Camera, MapPin, Briefcase, Building2 } from "lucide-react";
import { CandidateProfile, EmployerProfile } from "@/types/profile";
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  profile: CandidateProfile | EmployerProfile;
  role: "candidate" | "employer";
  onEditClick: () => void;
  onImageClick?: () => void;
  userImage?: string | null; // Google OAuth image from auth
}

export default function ProfileHeader({
  profile,
  role,
  onEditClick,
  onImageClick,
  userImage,
}: ProfileHeaderProps) {
  const isCandidate = role === "candidate";
  const candidateProfile = isCandidate ? (profile as CandidateProfile) : null;
  const employerProfile = !isCandidate ? (profile as EmployerProfile) : null;

  // Use profile_picture first, then userImage (Google OAuth), then fallback to initials
  const imageUrl = profile.profile_picture || (userImage && userImage.trim() !== "" ? userImage : null);

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8 shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Picture */}
        <div className="relative group">
          <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-purple-200/50 dark:ring-purple-800/50 shadow-lg">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={
                  isCandidate
                    ? candidateProfile?.full_name || "Candidate"
                    : employerProfile?.company_name || "Company"
                }
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                {isCandidate
                  ? candidateProfile?.full_name?.charAt(0).toUpperCase() || "C"
                  : employerProfile?.company_name?.charAt(0).toUpperCase() ||
                    "E"}
              </div>
            )}
          </div>
          {onImageClick && (
            <button
              onClick={onImageClick}
              className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Change profile picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {isCandidate
                  ? candidateProfile?.full_name || "Candidate"
                  : employerProfile?.company_name || "Company"}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                {isCandidate ? (
                  <>
                    {candidateProfile?.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {candidateProfile.location}
                        </span>
                      </div>
                    )}
                    {candidateProfile?.experience_years !== undefined && (
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">
                          {candidateProfile.experience_years} years experience
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {employerProfile?.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {employerProfile.location}
                        </span>
                      </div>
                    )}
                    {employerProfile?.industry && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        <span className="text-sm">
                          {employerProfile.industry}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <Button
              onClick={onEditClick}
              variant="outline"
              className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-md hover:bg-purple-50 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-700"
            >
              Edit Profile
            </Button>
          </div>

          {/* Bio */}
          {profile.bio && (
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
