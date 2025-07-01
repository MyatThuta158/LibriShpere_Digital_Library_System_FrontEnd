import apiClient from "./apiClient";

export const postAnnouncment = (data) =>
  apiClient.post("/announcement", data).then((res) => res.data);

// This is to show announcement
export const getAnnouncements = () =>
  apiClient.get("/announcement").then((res) => res.data);

// This is for delete announcement
export const deleteAnnouncement = (id) =>
  apiClient.delete(`/announcement/${id}`).then((res) => res.data);

// This is to show each announcement
export const showAnnouncement = (id) =>
  apiClient.get(`/announcement/${id}`).then((res) => res.data);

// This is to update each announcement
export const updateAnnouncement = (id, data) =>
  apiClient.patch(`/announcement/${id}`, data).then((res) => res.data);
