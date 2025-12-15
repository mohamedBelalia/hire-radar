"use client";

import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { CandidateProfile } from "@/types/profile";

interface PersonalDetailsProps {
  profile: CandidateProfile;
}

/**
 * Render a card displaying a candidate's personal details and optional social links.
 *
 * @param profile - Candidate profile object; used fields: `email`, `phone`, `location`, `experience_years`, `education`, `linkedin_url`, `github_url`, `portfolio_url`
 * @returns A React element containing the formatted personal details and, if present, linked social buttons
 */
export default function PersonalDetails({ profile }: PersonalDetailsProps) {
  const details = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: MapPin, label: "Location", value: profile.location },
    {
      icon: Briefcase,
      label: "Experience",
      value: profile.experience_years
        ? `${profile.experience_years} years`
        : null,
    },
    { icon: GraduationCap, label: "Education", value: profile.education },
  ].filter((item) => item.value);

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Personal Details
      </h2>
      <div className="space-y-4">
        {details.map((detail, index) => {
          const Icon = detail.icon;
          return (
            <div key={index} className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {detail.label}
                </p>
                <p className="text-base text-gray-900 dark:text-white mt-1">
                  {detail.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Social Links */}
      {(profile.linkedin_url ||
        profile.github_url ||
        profile.portfolio_url) && (
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Links
          </h3>
          <div className="flex flex-wrap gap-3">
            {profile.linkedin_url && (
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">LinkedIn</span>
              </a>
            )}
            {profile.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">GitHub</span>
              </a>
            )}
            {profile.portfolio_url && (
              <a
                href={profile.portfolio_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="text-sm font-medium">Portfolio</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}