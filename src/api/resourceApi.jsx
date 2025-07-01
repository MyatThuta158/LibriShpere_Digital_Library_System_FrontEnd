import { apiClient } from "./apiClient";

//-----This is to create resource data----//
export const createResource = (data) =>
  apiClient.post("/resources", data).then((res) => res.data);

//-------This is to retrieve all digital reosurces from database--//
export const fetchResource = () =>
  apiClient.get(`/resources`).then((res) => res.data);

///----This is to retrieve detail information for digital resources---////
export const detailResource = (id) =>
  apiClient.get(`/resources/${id}`).then((res) => res.data);

// This is resource file get for digital file
export const search = (query) =>
  apiClient.get(`/resource/search?name=${query}`).then((res) => res.data);

//-----This is the retrieve for resource detail----///
export const detail = (id) =>
  apiClient.get(`/resource/${id}`).then((res) => res.data);

// Resource delete
export const deleteResource = (id) =>
  apiClient.delete(`/resource/delete/${id}`).then((res) => res.data);

//--------This increment the view count -=-------//
//-----This is the retrieve for resource detail----///
export const incrementView = (id) =>
  apiClient.get(`/increment/view/${id}`).then((res) => res.data);

//-----This is the update function for resource----///
export const resourceUpdate = (id, data) =>
  apiClient.post(`/Admin/UpdateResource/${id}`, data).then((res) => res.data);

//----This is get all resources genre----//
export const getResources = () =>
  apiClient.get(`/getResource`).then((response) => response.data);

export const fetchFile = (id) =>
  apiClient
    .get(`/downloadFile/${id}`, { responseType: "blob" })
    .then((res) => res.data);

export const streamVideo = (id) =>
  apiClient.get(`/streamVideo/${id}`, { responseType: "blob" }).then((res) => {
    // Create a URL from the blob
    return URL.createObjectURL(res.data);
  });
