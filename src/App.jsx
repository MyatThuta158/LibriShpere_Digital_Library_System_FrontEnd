import "./App.css";
import { AuthProvider, useAuth } from "./Authentication/Auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import AdminMenu from "./Pages/AdminPanel/SideBarMenu";
import AdminRoute from "./Route/AdminRoute";
import MemberRoute from "./Route/MemberRoute";
// main.jsx or index.js
import "bootstrap/dist/css/bootstrap.min.css";
import CommunityMemberRoute from "./Route/CommunityMemberRoute";
import Unauthorized from "./Pages/Layouts/Unauthorized";
import NotFound from "./Pages/Layouts/NotFound";
import PermissionForUser, {
  AbilityContext,
} from "./Authentication/PermissionForUser";
import Menu from "./Pages/Layouts/Menu";
import {
  MembershipContext,
  MembershipProvider,
} from "./Pages/MemberPages/Context/MembershipContext"; // Replace with the correct path
import MemberRegister from "./Pages/MemberPages/MemberRegister"; // Replace with the correct path
import Payment from "./Pages/MemberPages/Payment"; // Replace with the correct path
import Membership from "./Pages/MemberPages/Membership";
import Announcement from "./Pages/MemberPages/Announcement";
import About from "./Pages/About";

function AppWithRolePermission() {
  const { user } = useAuth();
  const ability = PermissionForUser(user);

  return (
    <AbilityContext.Provider value={ability}>
      <BrowserRouter>
        <Routes>
          <Route element={<Menu />}>
            <Route path="/" element={<Login />} />
            <Route path="/library/*" element={<MemberRoute />} />
            <Route path="/community/*" element={<CommunityMemberRoute />} />
            <Route
              path="Payment"
              element={
                <MembershipProvider>
                  <Payment />
                </MembershipProvider>
              }
            />

            <Route
              path="Membership"
              element={
                <MembershipProvider>
                  <Membership />
                </MembershipProvider>
              }
            />

            <Route path="about" element={<About />} />
            <Route path="announcement" element={<Announcement />} />
            <Route
              path="/UserRegister"
              element={
                <MembershipProvider>
                  <MemberRegister />
                </MembershipProvider>
              }
            />
          </Route>
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/Admin" element={<AdminMenu />} />
          <Route path="/*" element={<AdminRoute />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AbilityContext.Provider>
  );
}

function App() {
  return (
    <>
      <AuthProvider>
        <AppWithRolePermission />
      </AuthProvider>
    </>
  );
}

export default App;
