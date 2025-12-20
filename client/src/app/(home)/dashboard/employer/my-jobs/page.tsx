"use client";

import { useEffect, useState, useCallback } from "react";
import { getEmployerJobs, deleteJob, EmployerJob } from "./api";
import { JobsList } from "./components/jobs-list";
import { EditJobModal } from "./components/edit-job-modal";
import { AddJobModal } from "./components/add-job-modal";
import { Pagination } from "./components/pagination";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<EmployerJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState<"created_at" | "title">("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [editingJob, setEditingJob] = useState<EmployerJob | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<number | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getEmployerJobs({
        page,
        limit: 10,
        sort: sortBy,
        order,
      });

      setJobs(response.jobs);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load your jobs");
    } finally {
      setIsLoading(false);
    }
  }, [page, sortBy, order, toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleEdit = (job: EmployerJob) => {
    setEditingJob(job);
    setEditModalOpen(true);
  };

  const handleDelete = async (jobId: number) => {
    try {
      setDeletingJobId(jobId);
      await deleteJob(jobId);

      toast.success("Job deleted successfully");

      await fetchJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete job"
      );
    } finally {
      setDeletingJobId(null);
    }
  };

  const handleEditSuccess = () => {
    setEditingJob(null);
    fetchJobs();
  };

  return (
    <div className="space-y-6 mb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor your job postings
          </p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => setAddJobModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Post a New Job
        </Button>
      </div>

      {/* Stats */}
      {total > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-sm text-gray-600">
            Total job postings: <span className="font-semibold">{total}</span>
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as "created_at" | "title");
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at">Recently Posted</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Order:</label>
          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value as "asc" | "desc");
              setPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Jobs List */}
      <JobsList
        jobs={jobs}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deletingJobId}
      />

      {/* Pagination */}
      {!isLoading && jobs.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isLoading}
        />
      )}

      {/* Edit Modal */}
      <EditJobModal
        job={editingJob}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        onSuccess={handleEditSuccess}
      />

      {/* Add Job Modal */}
      <AddJobModal
        open={addJobModalOpen}
        onOpenChange={setAddJobModalOpen}
        onSuccess={() => {
          setAddJobModalOpen(false);
          setPage(1);
          fetchJobs();
        }}
      />
    </div>
  );
}