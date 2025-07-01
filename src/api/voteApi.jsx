import apiClient from "./apiClient";

//---------this get all posts from api---//
export const postVote = (data) =>
  apiClient.post("/votes", data).then((res) => res.data);

//---------this get all votes from api---//
export const viewVote = (id) =>
  apiClient.get(`/votes/count/${id}`).then((res) => res.data);

//---------this get all votes from api---//
export const updateVote = (data) =>
  apiClient.post(`/votes/update`, data).then((res) => res.data);

//---------this get all voters from api---//
export const getVoters = (id) =>
  apiClient.get(`/votes/voters/${id}`).then((res) => res.data);

//---------this delete vote from api---//
export const deleteVote = (data) =>
  apiClient.post(`/votes/delete`, data).then((res) => res.data);
