"use client";
import { useEffect, useState } from "react";
import { getDeletionRequests } from "@/services/admin";
import { getToken } from "@/lib";
import { DataTable } from "@/components/dataTable";
import { User } from "@/types";

interface DeleteRequestWithUser {
  id: number;
  reason: string;
  created_at: string;
  user: User;
}

const columns = [
  { accessorKey: "user.full_name", header: "Full Name" },
  { accessorKey: "user.role", header: "Role" },
  { accessorKey: "user.headLine", header: "HeadLine" },
  { accessorKey: "reason", header: "Reason" },
  { accessorKey: "created_at", header: "Requested At" },
];

const Page = () => {
  const [requests, setRequests] = useState<DeleteRequestWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await getDeletionRequests(getToken()!);
      if (res.status === 200) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (requestId: number) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) return null;

  return (
    <div>
      <h1 className="text-xl font-semibold">Deletion Requests</h1>
      <DataTable
        data={requests}
        content={"user"}
        columns={columns}
        actions={[
          {
            label: "Delete",
            onClick: (id: number) => handleDelete(id),
            variant: "destructive",
          },
        ]}
      />
    </div>
  );
};

export default Page;
