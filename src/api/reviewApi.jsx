import apiClient from "./apiClient"; // Adjust the import path as necessary

export const createReview = (data) =>
  apiClient.post("/Reviews/Add", data).then((res) => res.data);

//----------This route is to show all reviews related to resource-------//
export const resourceReviews = (id) =>
  apiClient.get(`/Resource/Reviews/${id}`).then((res) => res.data);

//---------This is to update reviews--------//
export const updateReview = (id, data) =>
  apiClient.post(`/Resource/UpdateReviews/${id}`, data).then((res) => res.data);

//---------This is to delete reviews--------//
export const deleteReview = (id) =>
  apiClient.delete(`/Resource/ReviewDelete/${id}`).then((res) => res.data);
