"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CandidateProfile,
  EmployerProfile,
  UpdateCandidateProfileRequest,
  UpdateEmployerProfileRequest,
} from "@/types/profile";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CandidateProfile | EmployerProfile;
  role: "candidate" | "employer";
  onSave: (
    data: UpdateCandidateProfileRequest | UpdateEmployerProfileRequest,
  ) => Promise<void>;
}

/**
 * Modal form for editing either a candidate or an employer profile.
 *
 * Initializes form state from the provided `profile`, lets the user edit role-specific fields,
 * and invokes `onSave` with an appropriate update payload when the form is submitted.
 *
 * @param isOpen - Controls whether the modal is visible
 * @param onClose - Closes the modal
 * @param profile - The current profile data (candidate or employer) used to prefill the form
 * @param role - `"candidate"` or `"employer"`; determines which fields are shown and the shape of the saved payload
 * @param onSave - Async callback invoked with the updated profile data; for candidates, `skills` are passed as an array parsed from the comma-separated input
 * @returns The modal element when `isOpen` is true, otherwise `null`
 */
export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  role,
  onSave,
}: EditProfileModalProps) {
  const isCandidate = role === "candidate";
  const candidateProfile = isCandidate ? (profile as CandidateProfile) : null;
  const employerProfile = !isCandidate ? (profile as EmployerProfile) : null;

  const [formData, setFormData] = useState<
    UpdateCandidateProfileRequest | UpdateEmployerProfileRequest
  >({});
  const [skills, setSkills] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen && profile) {
      if (isCandidate && candidateProfile) {
        setFormData({
          full_name: candidateProfile.full_name,
          email: candidateProfile.email,
          phone: candidateProfile.phone || "",
          location: candidateProfile.location || "",
          bio: candidateProfile.bio || "",
          experience_years: candidateProfile.experience_years,
          education: candidateProfile.education || "",
          linkedin_url: candidateProfile.linkedin_url || "",
          github_url: candidateProfile.github_url || "",
          portfolio_url: candidateProfile.portfolio_url || "",
        });
        setSkills(candidateProfile.skills?.join(", ") || "");
      } else if (!isCandidate && employerProfile) {
        setFormData({
          company_name: employerProfile.company_name,
          email: employerProfile.email,
          phone: employerProfile.phone || "",
          location: employerProfile.location || "",
          bio: employerProfile.bio || "",
          website: employerProfile.website || "",
          industry: employerProfile.industry || "",
          company_size: employerProfile.company_size || "",
          founded_year: employerProfile.founded_year,
          description: employerProfile.description || "",
          linkedin_url: employerProfile.linkedin_url || "",
        });
      }
    }
  }, [isOpen, profile, isCandidate, candidateProfile, employerProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const dataToSave = isCandidate
        ? {
            ...formData,
            skills: skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          }
        : formData;
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: string, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Common Fields */}
          {isCandidate ? (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  value={
                    (formData as UpdateCandidateProfileRequest).full_name || ""
                  }
                  onChange={(e) => handleChange("full_name", e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={
                    (formData as UpdateCandidateProfileRequest).email || ""
                  }
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={
                      (formData as UpdateCandidateProfileRequest).phone || ""
                    }
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={
                      (formData as UpdateCandidateProfileRequest).location || ""
                    }
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={(formData as UpdateCandidateProfileRequest).bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Skills (comma-separated)
                </label>
                <Input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, TypeScript, Node.js"
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Experience (years)
                  </label>
                  <Input
                    type="number"
                    value={
                      (formData as UpdateCandidateProfileRequest)
                        .experience_years || ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "experience_years",
                        parseInt(e.target.value) || undefined,
                      )
                    }
                    min="0"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Education
                  </label>
                  <Input
                    type="text"
                    value={
                      (formData as UpdateCandidateProfileRequest).education ||
                      ""
                    }
                    onChange={(e) => handleChange("education", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn URL
                </label>
                <Input
                  type="url"
                  value={
                    (formData as UpdateCandidateProfileRequest).linkedin_url ||
                    ""
                  }
                  onChange={(e) => handleChange("linkedin_url", e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    GitHub URL
                  </label>
                  <Input
                    type="url"
                    value={
                      (formData as UpdateCandidateProfileRequest).github_url ||
                      ""
                    }
                    onChange={(e) => handleChange("github_url", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Portfolio URL
                  </label>
                  <Input
                    type="url"
                    value={
                      (formData as UpdateCandidateProfileRequest)
                        .portfolio_url || ""
                    }
                    onChange={(e) =>
                      handleChange("portfolio_url", e.target.value)
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Company Name *
                </label>
                <Input
                  type="text"
                  value={
                    (formData as UpdateEmployerProfileRequest).company_name ||
                    ""
                  }
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  value={(formData as UpdateEmployerProfileRequest).email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    value={
                      (formData as UpdateEmployerProfileRequest).phone || ""
                    }
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={
                      (formData as UpdateEmployerProfileRequest).location || ""
                    }
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  value={(formData as UpdateEmployerProfileRequest).bio || ""}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Website
                  </label>
                  <Input
                    type="url"
                    value={
                      (formData as UpdateEmployerProfileRequest).website || ""
                    }
                    onChange={(e) => handleChange("website", e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Industry
                  </label>
                  <Input
                    type="text"
                    value={
                      (formData as UpdateEmployerProfileRequest).industry || ""
                    }
                    onChange={(e) => handleChange("industry", e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Company Size
                  </label>
                  <Input
                    type="text"
                    value={
                      (formData as UpdateEmployerProfileRequest).company_size ||
                      ""
                    }
                    onChange={(e) =>
                      handleChange("company_size", e.target.value)
                    }
                    placeholder="e.g., 50-100"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Founded Year
                  </label>
                  <Input
                    type="number"
                    value={
                      (formData as UpdateEmployerProfileRequest).founded_year ||
                      ""
                    }
                    onChange={(e) =>
                      handleChange(
                        "founded_year",
                        parseInt(e.target.value) || undefined,
                      )
                    }
                    min="1900"
                    max={new Date().getFullYear()}
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={
                    (formData as UpdateEmployerProfileRequest).description || ""
                  }
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  LinkedIn URL
                </label>
                <Input
                  type="url"
                  value={
                    (formData as UpdateEmployerProfileRequest).linkedin_url ||
                    ""
                  }
                  onChange={(e) => handleChange("linkedin_url", e.target.value)}
                  className="w-full"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}