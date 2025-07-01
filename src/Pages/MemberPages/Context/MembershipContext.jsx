import React, { createContext, useState } from "react";

// Create the context
export const MembershipContext = createContext();

// Create a provider component
export const MembershipProvider = ({ children }) => {
  const [userId, setUserid] = useState(null); // Store user registration data
  const [membershipPlan, setMembershipPlan] = useState(null); // Store selected membership plan
  const [total, setTotal] = useState(null);

  return (
    <MembershipContext.Provider
      value={{
        userId,
        setUserid,
        membershipPlan,
        setMembershipPlan,
        total,
        setTotal,
      }}
    >
      {children}
    </MembershipContext.Provider>
  );
};
