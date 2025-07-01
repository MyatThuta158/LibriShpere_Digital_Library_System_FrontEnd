import apiClient from "./apiClient";

export const createMembership = (data) =>
  apiClient.post("/memberships", data).then((res) => res.data);

//----This is to show all genre----//
export const getMembership = () =>
  apiClient.get("/Memberships/show").then((res) => res.data);

//----This is to get all membership plan----//
export const getAllMembership = (page = 1) =>
  apiClient.get(`/memberships?page=${page}`).then((res) => res.data);

// -----------This is for delete payment-----//

export const getMembershipPlan = (id) =>
  apiClient.get(`/memberships/${id}`).then((response) => response.data);

// -------This is for update memberships--------//
export const updateMembershipPlan = (id, formData) =>
  apiClient.post(`/memberships/update/${id}`, formData).then((res) => res.data);

// -------This is for update memberships--------//
export const deleteMembership = (id) =>
  apiClient.delete(`/memberships/${id}`).then((res) => res.data);

export const adminMembership = () =>
  apiClient.get(`/allMembership`).then((response) => response.data);
