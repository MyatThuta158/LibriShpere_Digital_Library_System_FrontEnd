import apiClient from "./apiClient";

//----This is to create member----//
export const createMember = (data) =>
  apiClient.post("/UserRegister", data).then((res) => res.data);

//-----This is to change role after the payment is successful---//
export const changeRole = (data) =>
  apiClient.post("/updateRole", data).then((res) => res.data);

//----------This is the profile update codes-----//
export const updatePfinfo = (data, id) =>
  apiClient.post(`/User/UpdateInfo/${id}`, data).then((res) => res.data);

//--------This is profile pic update codes---------//
export const updatePfpic = (data, id) =>
  apiClient.post(`/User/UpdateProfile/${id}`, data).then((res) => res.data);

//--------This is profile pic update codes---------//
export const resetUserPassword = (data) =>
  apiClient.post(`/User/ResetPassword`, data).then((res) => res.data);

//--------This is profile pic update codes---------//
export const getUserInfo = (id) =>
  apiClient.get(`/User/info/${id}`).then((res) => res.data);

//--------This is profile pic update codes---------//
export const getallUser = () =>
  apiClient.get(`/alluser`).then((res) => res.data);

//--------This is profile pic update codes---------//
export const resetPassword = (id, data) =>
  apiClient.post(`/user/changepassword/${id}`, data).then((res) => res.data);
