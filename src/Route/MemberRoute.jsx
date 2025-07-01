import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/MemberPages/Home";

import ResourceDisplay from "../Pages/MemberPages/ResourceDisplay";
import MemberRegister from "../Pages/MemberPages/MemberRegister";
import Membership from "../Pages/MemberPages/Membership";
import {
  MembershipContext,
  MembershipProvider,
} from "../Pages/MemberPages/Context/MembershipContext";
import ViewDetailResource from "../Pages/MemberPages/ViewDetailRequest";

import Payment from "../Pages/MemberPages/Payment";
import ResourceDetail from "../Pages/MemberPages/ResourceDetail";
import ResourceRead from "../Pages/AdminPanel/Resources/ResourceRead";
import RequestResources from "../Pages/MemberPages/RequestResources";
import ViewDetailRequest from "../Pages/MemberPages/ViewDetailRequest";
import Profile from "../Pages/MemberPages/Profile";
import PermissionForRoute from "../Authentication/PermissionForRoute";
import Home1 from "../Pages/MemberPages/home1";
import Menu from "../Pages/Layouts/Menu";
import Announcement from "../Pages/MemberPages/Announcement";
import Detaildata from "../Pages/AdminPanel/Resource_Request/DetailRequest";
import RequestDetail from "../Pages/MemberPages/RequestDetail";

function MemberRoute() {
  return (
    <Routes>
      <Route
        element={
          <PermissionForRoute role={["manager", "librarian", "member"]} />
        }
      >
        {/* <Route path="" element={<Menu />}> */}
        {/* <Route path="/Home" element={<Home />} /> */}

        {/* <Route path="Resource" element={<ResourceDisplay />} /> */}

        <Route path="resource/:id" element={<ResourceDetail />} />
        <Route path="/resource/request/:id" element={<RequestDetail />} />
        <Route path="ReadResource/:id" element={<ResourceRead />} />
        <Route element={<PermissionForRoute role={["member"]} />}>
          <Route path="ResourceRequest" element={<RequestResources />} />
        </Route>
        {/* This is for request resource route */}

        <Route path="DetailRequest/:id" element={<ViewDetailRequest />} />

        {/* This is for profile route */}
        <Route path="Profile" element={<Profile />} />
      </Route>
      <Route path="Home" element={<Home1 />} />
      {/* </Route> */}
      <Route path="Resource" element={<ResourceDisplay />} />
    </Routes>
  );
}

export default MemberRoute;
