"use client";

import { createJob, getAvailableSkills, Skill } from "../api";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SkillSelector } from "./skill-selector";
import { toast } from "sonner";

interface AddJobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddJobModal({
  open,
  onOpenChange,
  onSuccess,
}: AddJobModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    location: "",
    salary_range: "",
    emp_type: "",
    responsibilities: [] as string[],
    skill_ids: [] as number[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [skillsLoading, setSkillsLoading] = useState(true);

  // Fetch available skills when modal opens
  useEffect(() => {
    if (open) {
      fetchSkills();
    }
  }, [open]);

  const fetchSkills = async () => {
    try {
      setSkillsLoading(true);
      const skills = await getAvailableSkills();
      setAvailableSkills(skills);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
      toast.error("Failed to load skills");
    } finally {
      setSkillsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Validate required fields
      if (!formData.title.trim()) {
        toast.error("Job title is required");
        return;
      }

      if (!formData.description.trim()) {
        toast.error("Job description is required");
        return;
      }

      if (!formData.location.trim()) {
        toast.error("Job location is required");
        return;
      }

      await createJob({
        title: formData.title,
        description: formData.description,
        company: formData.company || undefined,
        location: formData.location,
        salary_range: formData.salary_range || undefined,
        emp_type: formData.emp_type || undefined,
        responsibilities:
          formData.responsibilities.length > 0
            ? formData.responsibilities
            : undefined,
        skill_ids: formData.skill_ids.length > 0 ? formData.skill_ids : undefined,
      });

      toast.success("Job posted successfully");

      // Reset form
      setFormData({
        title: "",
        description: "",
        company: "",
        location: "",
        salary_range: "",
        emp_type: "",
        responsibilities: [],
        skill_ids: [],
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Failed to create job:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to post job"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      title: "",
      description: "",
      company: "",
      location: "",
      salary_range: "",
      emp_type: "",
      responsibilities: [],
      skill_ids: [],
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Job</DialogTitle>
          <DialogDescription>
            Fill in the job details to create a new job posting
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Job Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Senior React Developer"
              required
              disabled={isLoading}
            />
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Company Name
            </label>
            <Input
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="e.g., Tech Company Inc."
              disabled={isLoading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter job description"
              rows={5}
              required
              disabled={isLoading}
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Location *
            </label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="e.g., New York, NY"
              required
              disabled={isLoading}
            />
          </div>

          {/* Employment Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Employment Type
            </label>
            <select
              value={formData.emp_type}
              onChange={(e) =>
                setFormData({ ...formData, emp_type: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={isLoading}
            >
              <option value="">Select type</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>

          {/* Salary Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Salary Range
            </label>
            <Input
              value={formData.salary_range}
              onChange={(e) =>
                setFormData({ ...formData, salary_range: e.target.value })
              }
              placeholder="e.g., $80,000 - $120,000 per year"
              disabled={isLoading}
            />
          </div>

          {/* Skills */}
          <SkillSelector
            availableSkills={availableSkills}
            selectedSkillIds={formData.skill_ids}
            onSkillsChange={(skillIds) =>
              setFormData({ ...formData, skill_ids: skillIds })
            }
            disabled={isLoading}
            isLoading={skillsLoading}
          />

          {/* Responsibilities */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Responsibilities
            </label>
            <Textarea
              value={formData.responsibilities.join("\n")}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  responsibilities: e.target.value
                    .split("\n")
                    .filter((r) => r.trim()),
                })
              }
              placeholder="Enter each responsibility on a new line"
              rows={4}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500">
              One responsibility per line
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Posting..." : "Post Job"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}