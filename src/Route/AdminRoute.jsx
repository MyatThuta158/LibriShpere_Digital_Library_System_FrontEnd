import React from "react";
import { Routes, Route } from "react-router-dom";
import SideBarMenu from "../Pages/AdminPanel/SideBarMenu";
import AddAuthors from "../Pages/AdminPanel/Authors/AddAuthors";
import ViewAuthors from "../Pages/AdminPanel/Authors/ViewAuthors";
import UpdateAuthors from "../Pages/AdminPanel/Authors/UpdateAuthors";
import AddGenre from "../Pages/AdminPanel/Genres/AddGenre";
import AddResources from "../Pages/AdminPanel/Resources/AddResources";
import ViewGenres from "../Pages/AdminPanel/Genres/ViewGenres";
import UpdateGenre from "../Pages/AdminPanel/Genres/UpdateGenre";
import ViewResources from "../Pages/AdminPanel/Resources/ViewResources";
import RegisterAdmin from "../Pages/AdminPanel/Admins/RegisterAdmin";
import ViewAdmins from "../Pages/AdminPanel/Admins/ViewAdmins";
import ResourceDetail from "../Pages/AdminPanel/Resources/ResourceDetail";
import AddMembershipPlan from "../Pages/AdminPanel/MembershipPlan/AddMembershipPlan";
import AddPayment_Type from "../Pages/AdminPanel/Payment_Types/AddPayment_Types";
import ViewRequest from "../Pages/AdminPanel/Resource_Request/ViewRequest";
import DetailRequest from "../Pages/AdminPanel/Resource_Request/DetailRequest";
import ViewMemberPayments from "../Pages/AdminPanel/Payments/ViewMemberPayments";
import DetailMemberPayment from "../Pages/AdminPanel/Payments/DetailMemberPayment";
import NewMemberReport from "../Pages/AdminPanel/Reports/NewMemberReport";
import SubscriptionReport from "../Pages/AdminPanel/Reports/SubscriptioinReport";
import MembershipRevenue from "../Pages/AdminPanel/Reports/MembershipRevenue";
import TotalRevenueReport from "../Pages/AdminPanel/Reports/TotalRevenueReport";
import RevenueReport from "../Pages/AdminPanel/Reports/RevenueReport";
import UpdatePayment_Type from "../Pages/AdminPanel/Payment_Types/UpdatePayment_Type";
import AllPayment_Types from "../Pages/AdminPanel/Payment_Types/AllPayment_Types";
import AllMembershipPlan from "../Pages/AdminPanel/MembershipPlan/AllMembershipPlan";
import UpdateMembershipPlan from "../Pages/AdminPanel/MembershipPlan/UpdateMembershipPlan";
import PdfViewer from "../Pages/AdminPanel/Resources/ResourceRead";
import ResourceRead from "../Pages/AdminPanel/Resources/ResourceRead";
import ResourceAll from "../Pages/AdminPanel/Resources/ResourceAll";
import ReadResource from "../Pages/AdminPanel/Resources/ResourceRead";
import UpdateResources from "../Pages/AdminPanel/Resources/UpdateResource";
import PermissionForRoute from "../Authentication/PermissionForRoute";
import UserPrediction from "../Pages/AdminPanel/Reports/UserPrediction";
import AdminProfile from "../Pages/AdminPanel/Admins/AdminProfile";
import CreateAnnouncement from "../Pages/AdminPanel/Announcements/CreateAnnouncement";
import ShowAnnouncment from "../Pages/AdminPanel/Announcements/ShowAnnouncement";
import DetailAnnouncement from "../Pages/AdminPanel/Announcements/DetailAnnouncement";
import ResubmitPayment from "../Pages/AdminPanel/Payments/ResubmitPayment";
import SubscriberPrediction from "../Pages/AdminPanel/Reports/SubscriberPrediction";
import LibrarianDashboard from "../Pages/AdminPanel/Dashboard/LibrarianDashboard";
import SubscriberRevenuePrediction from "../Pages/AdminPanel/Reports/SubscriberRevenuePrediction";
import ViewAllUsers from "../Pages/AdminPanel/Users/ViewAllUsers";
import SubscriptionTableReport from "../Pages/AdminPanel/Reports/SubscriptionTableReport";
import UserTableReport from "../Pages/AdminPanel/Reports/UserTableReport";
import ManagerDashboard from "../Pages/AdminPanel/Dashboard/ManagerDashboard";

function AdminRoute() {
  return (
    <Routes>
      <Route element={<PermissionForRoute role={["manager", "librarian"]} />}>
        <Route path="/Admin" element={<SideBarMenu />}>
          {/* This is for Authors Route */}
          <Route path="/Admin/AddAuthors" element={<AddAuthors />} />
          <Route path="/Admin/ViewAuthors" element={<ViewAuthors />} />
          <Route path="/Admin/UpdateAuthors/:id" element={<UpdateAuthors />} />

          {/* This is for Genre Route */}
          <Route path="/Admin/AddGenre" element={<AddGenre />} />
          <Route path="/Admin/ViewGenre" element={<ViewGenres />} />
          <Route path="/Admin/UpdateGenres/:id" element={<UpdateGenre />} />

          {/* This is for resources routes */}
          <Route path="/Admin/AddResource" element={<AddResources />} />
          <Route path="/Admin/ViewResource" element={<ViewResources />} />
          <Route
            path="/Admin/DetailResource/:id"
            element={<ResourceDetail />}
          />
          <Route
            path="/Admin/UpdateResource/:id"
            element={<UpdateResources />}
          />
          {/* This is for admins routes */}
          <Route path="/Admin/RegisterAdmin" element={<RegisterAdmin />} />
          <Route path="/Admin/ViewAdmins" element={<ViewAdmins />} />

          {/* This is for membership routes */}
          <Route path="/Admin/AddMemberships" element={<AddMembershipPlan />} />
          <Route path="/Admin/AllMemberships" element={<AllMembershipPlan />} />
          <Route
            path="/Admin/UpdateMemberships/:id"
            element={<UpdateMembershipPlan />}
          />

          {/* This is for payment types */}
          <Route path="/Admin/AddPaymentTypes" element={<AddPayment_Type />} />
          <Route
            path="/Admin/UpdatePaymentTypes/:id"
            element={<UpdatePayment_Type />}
          />
          {/* This is for request resource routes */}
          <Route path="/Admin/ViewResourceRequest" element={<ViewRequest />} />
          <Route
            path="/Admin/DetailResourceRequest/:id"
            element={<DetailRequest />}
          />
          <Route path="/Admin/ReadResource/:id" element={<ReadResource />} />

          {/* This is the route to check payment */}
          <Route path="/Admin/ViewPayments" element={<ViewMemberPayments />} />
          <Route
            path="/Admin/DetailPayments/:id"
            element={<DetailMemberPayment />}
          />

          <Route path="/Admin/User" element={<ViewAllUsers />} />

          {/* This is for reports */}
          <Route path="/Admin/NewMemberReport" element={<NewMemberReport />} />
          <Route
            path="/Admin/SubscriptionReport"
            element={<SubscriptionReport />}
          />

          <Route
            path="/Admin/MembershipReport"
            element={<MembershipRevenue />}
          />

          <Route
            path="/Admin/SubscriberRevenue/Prediction"
            element={<SubscriberRevenuePrediction />}
          />

          <Route
            path="/Admin/TotalRevenueReport"
            element={<TotalRevenueReport />}
          />

          <Route path="/Admin/UserPredict" element={<UserPrediction />} />
          <Route
            path="/Admin/SubscriberPrediction"
            element={<SubscriberPrediction />}
          />

          <Route path="/Admin/ReadResource/:id" element={<ResourceRead />} />

          <Route path="/Admin/MembershipRevenue" element={<RevenueReport />} />
          <Route path="/Admin/AllPaymentTypes" element={<AllPayment_Types />} />

          <Route path="/Admin/Profile" element={<AdminProfile />} />

          <Route
            path="/Admin/Subscription/Resubmit/:id"
            element={<ResubmitPayment />}
          />
          <Route
            path="/Admin/LibrarianDashboard"
            element={<LibrarianDashboard />}
          />

          <Route
            path="/Admin/ManagerDashboard"
            element={<ManagerDashboard />}
          />

          {/* This is for announcement  */}
          <Route path="/Admin/Announcement" element={<CreateAnnouncement />} />
          <Route path="/Admin/ShowAnnouncement" element={<ShowAnnouncment />} />
          <Route
            path="/Admin/ViewAnnouncementDetail/:id"
            element={<DetailAnnouncement />}
          />

          <Route
            path="/Admin/SubscriptionReport/Table"
            element={<SubscriptionTableReport />}
          />

          <Route path="/Admin/UserReport/Table" element={<UserTableReport />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default AdminRoute;
