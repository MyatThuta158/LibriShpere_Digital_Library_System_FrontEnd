import apiClient from "./apiClient";

////-----------This create resource request -----///
export const createRequest = (data) =>
  apiClient.post("/Requests", data).then((res) => res.data);

export const viewRequests = (id) =>
  apiClient.get(`/Requests/${id}`).then((res) => res.data);

///--------------This is the api for admin----////
export const allRequest = () =>
  apiClient.get("/Requests").then((res) => res.data);

//-------This is to add admin comments----//
export const addComments = (id, comment) =>
  apiClient.put(`/updateAdminComments/${id}`, comment).then((res) => res.data);

///----------this update customer watch view----///
export const changeNotiStatus = (id, status) =>
  apiClient.put(`updateNotiStatus/${id}`, status).then((res) => res.data);

export const adminRequests = (id) =>
  apiClient.get(`/Admin/Request/${id}`).then((res) => res.data);
