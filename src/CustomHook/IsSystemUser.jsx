import React from "react";

function IsSystemUser() {
  const user = JSON.parse(localStorage.getItem("user")); ///----This get user from local storatge----//
  const userRole = user?.role || null;
  const isMember = userRole == "member" ? true : false;

  console.log("ismember", isMember);
  return { user, isMember };
}

export default IsSystemUser;
