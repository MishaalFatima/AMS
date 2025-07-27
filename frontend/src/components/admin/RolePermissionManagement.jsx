// src/components/admin/RolePermissionManagement.jsx
import { useState, useEffect } from "react";
import AdminNavBar from "../NavBar";

export default function RolePermissionManagement() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);  // now array of {id,name}
  const [loading, setLoading] = useState(true);
  const [newRoleName, setNewRoleName] = useState("");
  const [savingRole, setSavingRole] = useState(false);
  const [savingPerms, setSavingPerms] = useState({});
  const token = localStorage.getItem("authToken");

  // 1) Fetch roles & master permissions
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [rolesRes, permsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/roles", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("http://127.0.0.1:8000/api/permissions", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        if (!rolesRes.ok || !permsRes.ok) {
          throw new Error("Failed to load");
        }
        const [rolesData, permsData] = await Promise.all([
          rolesRes.json(),
          permsRes.json(),
        ]);

        // store permissions as {id,name}
        setPermissions(permsData);

        // build each role’s permsSet by permission ID
        setRoles(
          rolesData.map((r) => ({
            ...r,
            permsSet: new Set(r.permissions.map((p) => p.id)),
          }))
        );
      } catch (err) {
        console.error(err);
        alert("Error loading roles or permissions");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, [token]);

  // 2) Toggle a given permission ID on/off for a specific role
  const toggle = (roleIdx, permId) => {
    setRoles((rs) => {
      const next = [...rs];
      const role = { ...next[roleIdx] };
      if (role.permsSet.has(permId)) {
        role.permsSet.delete(permId);
      } else {
        role.permsSet.add(permId);
      }
      next[roleIdx] = role;
      return next;
    });
  };

  // 3) Save a role’s current permsSet back to the API
  const savePerms = async (role, idx) => {
    setSavingPerms((s) => ({ ...s, [role.id]: true }));
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/roles/${role.id}/permissions`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            permissions: Array.from(role.permsSet), // array of IDs
          }),
        }
      );
      if (!res.ok) throw new Error(`Status ${res.status}`);
      alert(`Updated permissions for role "${role.name}"`);
    } catch (err) {
      console.error(err);
      alert("Failed to save permissions");
    } finally {
      setSavingPerms((s) => ({ ...s, [role.id]: false }));
    }
  };

  // 4) Create a brand‑new role
  const createRole = async () => {
    if (!newRoleName.trim()) return;
    setSavingRole(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newRoleName.trim() }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const created = await res.json();
      setRoles((rs) => [
        ...rs,
        { ...created, permsSet: new Set() }
      ]);
      setNewRoleName("");
    } catch (err) {
      console.error(err);
      alert("Could not create role");
    } finally {
      setSavingRole(false);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavBar />
        <div className="container text-center mt-5">
          <div className="spinner-border" role="status" />
          <p>Loading roles & permissions…</p>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavBar />
      <div className="container my-4">
        <h2>Roles &amp; Permissions</h2>

        {/* New Role */}
        <div className="d-flex align-items-center mb-4">
          <input
            className="form-control me-2"
            placeholder="New role name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            disabled={savingRole}
          />
          <button
            className="btn btn-primary"
            onClick={createRole}
            disabled={savingRole}
          >
            {savingRole ? "Creating…" : "Add Role"}
          </button>
        </div>

        {/* Permission Matrix */}
        <div style={{ overflowX: "auto" }}>
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Role ↓ / Permission →</th>
                {permissions.map((perm) => (
                  <th key={perm.id}>{perm.name}</th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((role, i) => (
                <tr key={role.id}>
                  <td>{role.name}</td>
                  {permissions.map((perm) => (
                    <td
                      key={perm.id}
                      className="text-center"
                      style={{ verticalAlign: "middle" }}
                    >
                      <input
                        type="checkbox"
                        checked={role.permsSet.has(perm.id)}
                        onChange={() => toggle(i, perm.id)}
                      />
                    </td>
                  ))}
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => savePerms(role, i)}
                      disabled={savingPerms[role.id]}
                    >
                      {savingPerms[role.id] ? "Saving…" : "Save"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
