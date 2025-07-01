import { apiClient } from "./apiClient";

//---------This is for create admin----//
export const createAdmin = (data) =>
  apiClient.post("/admins", data).then((res) => res.data);

///----------This get the admin data with pagination---//
export const getAdmin = (page) =>
  apiClient.get(`/admins?page=${page}`).then((res) => res.data);

////------This is for delete admin data---/////
export const deleteAdmin = (id) =>
  apiClient.delete(`/admins/${id}`).then((res) => res.data);

////------This is for update admin data---/////
export const updateAdmin = (data) =>
  apiClient.post(`/admins/update`, data).then((res) => res.data);

////------This is for show each admin data---/////
export const showAdmin = () =>
  apiClient.get(`/admins/show`).then((res) => res.data);

//---------This is for create admin----//
export const resetPassword = (data) =>
  apiClient.post("/admin/resetpassword", data).then((res) => res.data);
