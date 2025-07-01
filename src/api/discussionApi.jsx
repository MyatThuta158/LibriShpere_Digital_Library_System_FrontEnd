import apiClient from "./apiClient";

//---------this get all posts from api---//
export const uploadDiscussion = (data) =>
  apiClient.post("/discussions", data).then((res) => res.data);

//---------this is all comments---//
export const showAlldiscussions = (id) =>
  apiClient.get(`/discussions/${id}`).then((res) => res.data);

//---------this update posts comments---//
export const updateComments = (data, id) =>
  apiClient.post(`/discussion/update/${id}`, data).then((res) => res.data);

//---------this update posts comments---//
export const deleteDiscussion = (id) =>
  apiClient.delete(`/discussions/${id}`).then((res) => res.data);
