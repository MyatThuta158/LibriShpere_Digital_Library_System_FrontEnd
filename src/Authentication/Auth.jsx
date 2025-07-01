// import { createContext, useEffect, useMemo, useState, useContext } from "react";
// import Cookies from "js-cookie";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   // Safely get user data from local storage
//   const storedUser = localStorage.getItem("user");
//   const userData =
//     storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
//   const [user, setUser] = useState(userData);

//   // Safely get token data from local storage
//   const storedToken = localStorage.getItem("token");
//   const tokenData =
//     storedToken && storedToken !== "undefined" ? JSON.parse(storedToken) : null;
//   const [token, setToken] = useState(tokenData);

//   useEffect(() => {
//     // Update local storage for user
//     if (user) {
//       localStorage.setItem("user", JSON.stringify(user));
//     } else {
//       localStorage.removeItem("user");
//     }

//     // Update token in cookies and local storage
//     if (token) {
//       Cookies.set("token", token, { expires: 1 });
//       localStorage.setItem("token", JSON.stringify(token));
//     } else {
//       Cookies.remove("token");
//       localStorage.removeItem("token");
//     }
//   }, [user, token]);

//   // Function to log in a user
//   const loginUser = (user, token) => {
//     setUser(user);
//     setToken(token);
//     Cookies.set("token", token, { expires: 1 });
//     localStorage.setItem("user", JSON.stringify(user));
//     localStorage.setItem("token", JSON.stringify(token));
//   };

//   // Function to log out a user
//   const logoutUser = () => {
//     console.log("logout");
//     setUser(null);
//     setToken(null);
//     Cookies.remove("token");
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//   };

//   // Memoize the context value to optimize performance
//   const authContextValue = useMemo(
//     () => ({
//       user,
//       token,
//       loginUser,
//       logoutUser,
//     }),
//     [user, token]
//   );

//   return (
//     <AuthContext.Provider value={authContextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// src/Authentication/Auth.jsx
import { createContext, useEffect, useMemo, useState, useContext } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage
  const storedUser = localStorage.getItem("user");
  const userData =
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  const [user, setUser] = useState(userData);

  const storedToken = localStorage.getItem("token");
  const tokenData =
    storedToken && storedToken !== "undefined" ? JSON.parse(storedToken) : null;
  const [token, setToken] = useState(tokenData);

  // On mount, check token expiration
  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    if (tokenData && loginTime) {
      const elapsed = Date.now() - Number(loginTime);
      const oneDayMs = 24 * 60 * 60 * 1000; // milliseconds in 24h :contentReference[oaicite:5]{index=5}
      if (elapsed > oneDayMs) {
        // Clear all storage if expired :contentReference[oaicite:6]{index=6}
        logoutUser();
      } else {
        // Restore context
        setUser(userData);
        setToken(tokenData);
      }
    }
  }, []); // run once on mount :contentReference[oaicite:7]{index=7}

  // Log in: store user, token, and loginTime
  const loginUser = (user, token) => {
    setUser(user);
    setToken(token);
    const now = Date.now();
    localStorage.setItem("user", JSON.stringify(user)); // persist user :contentReference[oaicite:8]{index=8}
    localStorage.setItem("token", JSON.stringify(token)); // persist token :contentReference[oaicite:9]{index=9}
    localStorage.setItem("loginTime", now.toString()); // track login timestamp :contentReference[oaicite:10]{index=10}
    Cookies.set("token", token, { expires: 1 }); // cookie fallback (1 day)
  };

  // Log out: clear context, cookies, and all localStorage :contentReference[oaicite:11]{index=11}
  const logoutUser = () => {
    setUser(null);
    setToken(null);
    Cookies.remove("token");
    localStorage.clear();
  };

  const authContextValue = useMemo(
    () => ({ user, token, loginUser, logoutUser }),
    [user, token]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
