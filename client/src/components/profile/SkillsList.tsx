"use client";

import { CandidateProfile } from "@/types/profile";

interface SkillsListProps {
  profile: CandidateProfile;
}

/**
 * Render a card displaying a candidate's skills as badges or a placeholder when no skills are present.
 *
 * @param profile - CandidateProfile whose `skills` array will be shown as badge elements
 * @returns A JSX element containing a "Skills" card with skill badges when `profile.skills` has items, or a message stating no skills have been added otherwise
 */
export default function SkillsList({ profile }: SkillsListProps) {
  if (!profile.skills || profile.skills.length === 0) {
    return (
      <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Skills
        </h2>
        <p className="text-gray-500 dark:text-gray-400">No skills added yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Skills
      </h2>
      <div className="flex flex-wrap gap-3">
        {profile.skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 rounded-xl font-semibold text-sm border border-purple-200 dark:border-purple-700"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}