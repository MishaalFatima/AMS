// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useCallback
} from "react";

// 1️⃣ Create the context
export const AuthContext = createContext({
  user:       null,     // null = checking, false = unauth, object = logged‑in
  perms:      [],       // array of permission strings
  loading:    true,     // true while we validate
  can:        () => false,
  login:      async () => {},
  logout:     () => {},
  reloadUser: async () => {},
});

export function AuthProvider({ children }) {
  // 2️⃣ Hydrate initial state from localStorage
  const storedUser  = JSON.parse(localStorage.getItem("authUser")  || "null");
  const storedPerms = JSON.parse(localStorage.getItem("authPerms") || "[]");

  const [user,    setUser]    = useState(storedUser);
  const [perms,   setPerms]   = useState(storedPerms);
  const [loading, setLoading] = useState(true);

  // 3️⃣ permission‑check helper
  const can = (permission) => perms.includes(permission);

  // 4️⃣ Single function to (re)fetch the logged‑in user
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      // no token → unauthenticated
      setUser(false);
      setPerms([]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Invalid token");
      const { user: me, permissions } = await res.json();
      setUser(me);
      setPerms(Array.isArray(permissions) ? permissions : []);

      // persist for next reload
      localStorage.setItem("authUser",  JSON.stringify(me));
      localStorage.setItem("authPerms", JSON.stringify(permissions));
    } catch {
      // bad token → clear everything
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("authPerms");
      setUser(false);
      setPerms([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 5️⃣ On mount, run fetchUser once
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 6️⃣ Called after a successful login
  async function login(token, userObj, permissions) {
    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser",  JSON.stringify(userObj));
    localStorage.setItem("authPerms", JSON.stringify(permissions));

    setUser(userObj);
    setPerms(permissions);
    setLoading(false);
  }

  // 7️⃣ Called on logout
  function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("authPerms");
    setUser(false);
    setPerms([]);
  }

  // 8️⃣ Expose context value
  return (
    <AuthContext.Provider
      value={{
        user,
        perms,
        loading,
        can,
        login,
        logout,
        reloadUser: fetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
