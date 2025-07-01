import { apiClient } from "./apiClient";

//-------This is to store genre----//
export const createGenre = (data) =>
  apiClient.post("/genres", data).then((res) => res.data);

//----This is to show all genre----//
export const getGenres = () => apiClient.get("/genres").then((res) => res.data);

//----This is to show genre by id----//
export const showGenre = (id) =>
  apiClient.get(`/genres/${id}`).then((res) => res.data);

//----This is to update genre----//
export const updateGenre = (id, data) =>
  apiClient.put(`/genres/${id}`, data).then((res) => res.data);

//----This is to delete genre----//
export const deleteGenre = (id) =>
  apiClient.delete(`/genres/${id}`).then((response) => response.data);

//----This is get 5 genre----//
export const getGenre = () =>
  apiClient.get(`/getGenre`).then((response) => response.data);
