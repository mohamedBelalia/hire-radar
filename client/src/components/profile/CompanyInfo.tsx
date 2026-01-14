"use client";

import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Globe,
  Users,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { EmployerProfile } from "@/types/profile";

interface CompanyInfoProps {
  profile: EmployerProfile;
}

/**
 * Render company information, optional external links, and an about section for an employer profile.
 *
 * Displays filtered contact and company details (email, phone, location, industry, company size, founded year),
 * a "Links" subsection for website and LinkedIn when provided, and an "About Us" section for the profile description.
 *
 * @param profile - EmployerProfile whose fields are used: `email`, `phone`, `location`, `industry`, `company_size`, `founded_year`, `website`, `linkedin_url`, and `description`.
 * @returns A React element containing the company information card, optional links, and optional about section.
 */
export default function CompanyInfo({ profile }: CompanyInfoProps) {
  const details = [
    { icon: Mail, label: "Email", value: profile.email },
    { icon: Phone, label: "Phone", value: profile.phone },
    { icon: MapPin, label: "Location", value: profile.location },
    { icon: Building2, label: "Industry", value: profile.industry },
    { icon: Users, label: "Company Size", value: profile.company_size },
    {
      icon: Calendar,
      label: "Founded",
      value: profile.founded_year?.toString(),
    },
  ].filter((item) => item.value);

  return (
    <div className="space-y-6">
      {/* Company Details */}
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Company Information
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

        {/* Website and LinkedIn */}
        {(profile.website || profile.linkedin_url) && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Links
            </h3>
            <div className="flex flex-wrap gap-3">
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm font-medium">Website</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
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
            </div>
          </div>
        )}
      </div>

      {/* Company Description */}
      {profile.description && (
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {profile.description}
          </p>
        </div>
      )}
    </div>
  );
}