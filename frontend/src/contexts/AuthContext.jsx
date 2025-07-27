import React, { createContext, useState, useEffect } from "react";

// 1) Create the context
export const AuthContext = createContext({
  user: null,         // null=loading, false=unauth, object=logged‑in
  perms: [],          // array of permission strings
  can: () => false,   // helper(p)→bool
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [perms, setPerms] = useState([]);

  // 2) permission‑check helper
  const can = (permission) => perms.includes(permission);

  // 3) On mount, load /api/user
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUser(false);
      return;
    }

    fetch("http://127.0.0.1:8000/api/user", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => {
        console.log("💾 /api/user response:", data);
        setUser(data.user);
        setPerms(Array.isArray(data.permissions) ? data.permissions : []);
      })
      .catch(() => {
        localStorage.removeItem("authToken");
        setUser(false);
        setPerms([]);
      });
  }, []);

  // 4) Called after a successful login
  async function login(token, userObj, permissions) {
    localStorage.setItem("authToken", token);

    console.log("💾 login response:", { user: userObj, permissions });
    setUser(userObj);
    setPerms(Array.isArray(permissions) ? permissions : []);
  }

  // 5) Called on logout
  function logout() {
    localStorage.removeItem("authToken");
    setUser(false);
    setPerms([]);
  }

  // 6) Expose context value
  return (
    <AuthContext.Provider value={{ user, perms, can, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
