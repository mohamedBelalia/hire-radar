import apiClient from "@/lib/apiClient";

export const getSkills = async () => {
  const res = await apiClient.get(`/api/admin/skills`);
  return res;
};

export const getCategories = async () => {
  const res = await apiClient.get(`/api/admin/categories`);
  return res;
};
