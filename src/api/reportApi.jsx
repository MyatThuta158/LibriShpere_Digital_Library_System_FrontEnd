///----------This is for subscription report--------////
import apiClient from "./apiClient"; // Make sure to adjust the import path as needed
import axios from "axios"; // Import axios for HTTP requests

export const SubscriptionReport = (period, year = null, month = null) => {
  let params = new URLSearchParams({ period });

  if (year) params.append("year", year);
  if (month) params.append("month", month);

  return apiClient
    .get(`/MembershipPlanReport?${params.toString()}`)
    .then((res) => res.data);
};

//-----This is to retrieve new member reports---//
export const MemberReport = (period, year = null, month = null) => {
  let params = new URLSearchParams({ period });

  if (year) params.append("year", year);
  if (month) params.append("month", month);

  return apiClient
    .get(`/NewMemberReport?${params.toString()}`)
    .then((res) => res.data);
};

//------This is for each membership revenue report--------//
export const RevenueReport = (period, year = null, month = null) => {
  let params = new URLSearchParams({ period });

  if (year) params.append("year", year);
  if (month) params.append("month", month);

  return apiClient
    .get(`/MembershipRevenueReport?${params.toString()}`)
    .then((res) => res.data);
};

/////-------This is for total membership revenue report------//////
export const TotalFinancialReport = (period, year = null, month = null) => {
  let params = new URLSearchParams({ period });

  if (year) params.append("year", year);
  if (month) params.append("month", month);

  return apiClient
    .get(`/TotalRevenueReport?${params.toString()}`)
    .then((res) => res.data);
};

export function SubscriptionTableReport(
  period,
  year = null,
  month = null,
  page
) {
  const params = new URLSearchParams();
  params.append("period", period);
  if (year) params.append("year", String(year));
  if (month) params.append("month", String(month));
  params.append("page", String(page));

  return apiClient
    .get(`/subscription/table/report?${params.toString()}`)
    .then((res) => res.data);
}

export function UserTableReport(period, year = null, month = null, page) {
  const params = new URLSearchParams();
  params.append("period", period);
  if (year) params.append("year", String(year));
  if (month) params.append("month", String(month));
  params.append("page", String(page));

  return apiClient
    .get(`/user/table/report?${params.toString()}`)
    .then((res) => res.data);
}
