import { predictionApi } from "./predictionApiclient";

export const getUserPredict = () =>
  predictionApi.get("predict/users").then((res) => res.data);

export const getSubscriberPredict = () =>
  predictionApi.get("predict/subscriber").then((res) => res.data);
