"use client";

import { EmployerJob } from "../api";
import { formatDistanceToNow } from "date-fns";
import { Trash2, Edit2, Briefcase, MapPin, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface JobCardProps {
  job: EmployerJob;
  onEdit: (job: EmployerJob) => void;
  onDelete: (jobId: number) => Promise<void>;
  isDeleting?: boolean;
}

export function JobCard({ job, onEdit, onDelete, isDeleting }: JobCardProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleteLoading(true);
      await onDelete(job.id);
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete job:", error);
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const postedDate = new Date(job.created_at);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
        {/* Header: Title and Actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-1">
              {job.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">{job.company}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 ml-4 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(job)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteConfirmOpen(true)}
              disabled={isDeleting || isDeleteLoading}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {job.description}
        </p>

        {/* Job Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span>{job.location}</span>
          </div>

          {/* Employment Type */}
          {job.emp_type && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span className="capitalize">{job.emp_type}</span>
            </div>
          )}

          {/* Salary */}
          {job.salary_range && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span>{job.salary_range}</span>
            </div>
          )}
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map((skill) => (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  {skill.name}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{job.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer: Posted Date */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500">Posted {timeAgo}</p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Job Posting</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{job.title}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              disabled={isDeleteLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
