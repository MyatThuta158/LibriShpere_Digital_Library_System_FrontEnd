import React from "react";
import PropTypes from "prop-types";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./Auth";

function PermissionForRoute({ role }) {
  // const { user } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));

  console.log(user);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  console.log(user.role);
  if (!role.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

PermissionForRoute.propTypes = {
  role: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PermissionForRoute;
