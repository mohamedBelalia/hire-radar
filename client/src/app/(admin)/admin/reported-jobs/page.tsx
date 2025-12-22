"use client";
import { useEffect, useState } from "react";
import { getReportedJobs } from "@/services/admin"; 
import { getToken } from "@/lib";
import { DataTable } from "@/components/dataTable";

interface User {
  id: number;
  full_name: string;
  email: string;
  role: string;
}

interface Job {
  id: number;
  title: string;
  company: string;
}

interface ReportedJobWithUser {
  id: number;
  reason: string;
  created_at: string;
  user: User;
  job: Job;
}

const columns = [
  { accessorKey: "user.full_name", header: "Full Name" },
  { accessorKey: "user.email", header: "Email" },
  { accessorKey: "job.title", header: "Job Title" },
  { accessorKey: "job.company", header: "Company" },
  { accessorKey: "reason", header: "Reason" },
  { accessorKey: "created_at", header: "Reported At" },
];

const Page = () => {
  const [reportedJobs, setReportedJobs] = useState<ReportedJobWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReportedJobs = async () => {
    try {
      const res = await getReportedJobs(getToken()!);
      if (res.status === 200) {
        setReportedJobs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setReportedJobs((prev) => prev.filter((rj) => rj.id !== id));
  };

  useEffect(() => {
    fetchReportedJobs();
  }, []);

  if (loading) return null;

  return (
    <div>
      <h1 className="text-xl font-semibold">Reported Jobs</h1>
      <DataTable
        data={reportedJobs}
        content={"job"}
        columns={columns}
        actions={[
          {
            label: "Delete",
            onClick: handleDelete,
            variant: "destructive",
          },
        ]}
      />
    </div>
  );
};

export default Page;
