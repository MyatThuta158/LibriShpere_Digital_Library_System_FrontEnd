import apiClient from "./apiClient";

//----This is to get all notification for user----//
export const getNoti = () =>
  apiClient.get("/notification").then((res) => res.data);

//------This is to change subscription notification----//
export const changeSubscriptionNoti = (id) =>
  apiClient
    .put(`/subscription/subscriptionstatus/change/${id}`)
    .then((res) => res.data);

//------This is to change subscription notification----//
export const changeDiscussionNoti = () =>
  apiClient.put(`/changeall/noti`).then((res) => res.data);

//------Get all notification----//
export const getNotification = () =>
  apiClient.get(`/noti/totalcount`).then((res) => res.data);
