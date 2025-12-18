import apiClient from "@/lib/apiClient";

export const getSkills = async () => {
  const res = await apiClient.get(`/admin/skills`);
  return res;
};

export const getCategories = async () => {
  const res = await apiClient.get(`/admin/categories`);
  return res;
};
