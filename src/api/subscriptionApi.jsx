import apiClient from "./apiClient";

export const createSubscription = (data) =>
  apiClient.post("/Subscription/Register", data).then((res) => res.data);

// This is to fetch all payments to approve and view detail
export const viewMemberpayment = (status, page) =>
  apiClient
    .get("/AllPayments", { params: { status, page } })
    .then((res) => res.data);

// This get to show detail payment and subscription information to AdminRoute
export const detailInfoPayment = (id) =>
  apiClient.get(`/subscriptions/${id}`).then((res) => res.data);

export const changeStatus = (id, status) =>
  apiClient.post(`/subscriptions/status/${id}`, status).then((res) => res.data);

//------This is for subscription resubmit----///

export const resubmitSubscription = (id, data) =>
  apiClient.post(`/subscription/resubmit/${id}`, data).then((res) => res.data);

export const resubmitSubShow = (id) =>
  apiClient.get(`/subscription/resubmit/${id}`).then((res) => res.data);

//------This is to show subscription resubmit detail-----//
export const getResubmit = (id) =>
  apiClient.get(`/subscription/resubmit/show/${id}`).then((res) => res.data);

//------Get subscription date-----//
export const getSubscriptionDate = (userid) =>
  apiClient.get(`/subscriptiondate/${userid}`).then((res) => res.data);

//------this is cancel subscription-----//
export const cancelSubscripiton = (id) =>
  apiClient.post(`/subscription/cancle/${id}`).then((res) => res.data);
