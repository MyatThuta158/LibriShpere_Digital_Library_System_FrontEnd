import apiClient from "./apiClient";

export const createPayment = (data) =>
  apiClient.post("/payment_types", data).then((res) => res.data);

export const getPayment = () =>
  apiClient.get("/Memberships/Payments").then((res) => res.data);

//---This is the functin to fetch all payment types----//
export const allPaymentTypes = (page = 1) =>
  apiClient.get("/payment_types", { params: { page } }).then((res) => res.data);

// -------This is for update payment--------//
export const updatePaymentType = (id, formData) =>
  apiClient
    .post(`payment_types/update/${id}`, formData)
    .then((res) => res.data);

// -----------This is for delete payment-----//

export const deletePayment = (id) =>
  apiClient.delete(`/payment_types/${id}`).then((response) => response.data);

// -----------This is for delete payment-----//

export const getEachPayment = (id) =>
  apiClient.get(`/payment_types/${id}`).then((response) => response.data);
