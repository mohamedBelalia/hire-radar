import apiClient from "@/lib/apiClient";

export const getUsers = async (token: string | null) => {
  const response = await apiClient.get(`/api/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getJobs = async (token: string | null) => {
  const response = await apiClient.get(`/api/admin/jobs`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteJob = async (token: string, id: number) => {
  const response = await apiClient.delete(`/api/admin/jobs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteUser = async (token: string | null, id: number | string) => {
  const response = await apiClient.delete(`/api/admin/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const addSkill = async (token: string | null, name: string) => {
  const response = await apiClient.post(
    `/api/admin/skills`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

export const addCategory = async (token: string | null, name: string) => {
  const response = await apiClient.post(
    `/api/admin/categories`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

export const editSkill = async (token: string, id: number, name: string) => {
  const response = await apiClient.put(
    `/api/admin/skills/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

export const editCategory = async (token: string, id: number, name: string) => {
  const response = await apiClient.put(
    `/api/admin/categories/${id}`,
    { name },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response;
};

export const deleteSkill = async (token: string, id: number) => {
  const response = await apiClient.delete(`/api/admin/skills/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteCategory = async (token: string, id: number) => {
  const response = await apiClient.delete(`/api/admin/categories/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getAdmins = async (token: string) => {
  const response = await apiClient.get(`/api/admin/admins`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const addAdmin = (
  token: string,
  data: { full_name: string; email: string; password: string },
) => {
  const response = apiClient.post("/api/admin/add-admin", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteAdmin = async (token: string, id: number) => {
  const response = await apiClient.delete(`/api/admin/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const getDeletionRequests = async (token: string | null) => {
  const response = await apiClient.get(`/api/admin/deletion-requests`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};