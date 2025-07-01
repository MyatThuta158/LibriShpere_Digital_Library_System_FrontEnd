import apiClient from "./apiClient";

export const getType = () =>
  apiClient.get("/admin/resourcetype").then((res) => res.data);
