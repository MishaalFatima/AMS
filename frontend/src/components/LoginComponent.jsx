// src/components/LoginComponent.jsx

import { useState, useContext } from "react";
import img from "../images/7e1b90195590875.Y3JvcCwzMDQyLDIzODAsMTU4LDA-removebg-preview.png";
import { Link, useNavigate } from "react-router-dom";
import HeaderComponent from "./header";
import { AuthContext } from "../contexts/AuthContext";

export default function LoginComponent() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [account, setAccount] = useState({ UserName: "", password: "" });
  const [error, setError]     = useState("");

  function changeHandler(e) {
    setError("");
    setAccount((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function submitHandler(e) {
    e.preventDefault();
    setError("");

    let res;
    try {
      res = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(account),
      });
    } catch (err) {
      console.error(err);
      setError("Network error—please try again.");
      return;
    }

    if (!res.ok) {
      let msg = "Username or password is incorrect.";
      try {
        const json = await res.json();
        msg = json.message || Object.values(json.errors || {}).flat()[0] || msg;
      } catch {}
      setError(msg);
      return;
    }

    let data;
    try {
      data = await res.json();
      console.log("💾 login response:", data);

    } catch {
      setError("Unexpected server response. Please try again.");
      return;
    }

    if (!data.token || !Array.isArray(data.user?.permissions)) {
      setError("Login succeeded but permissions were missing.");
      return;
    }

    // 1) Delegate persistence of token, user & perms to AuthContext
    login(data.token, data.user, data.permissions);

    // 2) Redirect to the shared dashboard
    navigate("/dashboard");
  }

  return (
    <div>
      <HeaderComponent />
      <section className="h-100 gradient-form">
        <div className="container py-5 h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-xl-10">
              <div className="card rounded-3 text-black">
                <div className="row g-0">
                  {/* Form side */}
                  <div className="col-lg-6">
                    <div className="card-body p-md-5 mx-md-4">
                      <div className="text-center">
                        <img src={img} alt="logo" style={{ width: 120 }} />
                        <h4>We are The Fixing Team</h4>
                      </div>

                      <form onSubmit={submitHandler}>
                        <p className={`text-center mb-4 ${error ? "text-danger" : "text-muted"}`}>
                          {error || "Please login to your account"}
                        </p>

                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            name="UserName"
                            className="form-control"
                            placeholder="UserName"
                            value={account.UserName}
                            onChange={changeHandler}
                            required
                          />
                        </div>
                        <div className="form-outline mb-4">
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            value={account.password}
                            onChange={changeHandler}
                            required
                          />
                        </div>

                        <div className="text-center pt-1 mb-4">
                          <button
                            type="submit"
                            className="btn btn-block gradient-custom-2 mb-3 px-5 text-white"
                          >
                            Log in
                          </button>
                        </div>

                        <div className="d-flex justify-content-center pb-4">
                          <p className="mb-0 me-2">Don't have an account?</p>
                          <Link to="/register" className="btn btn-outline-danger">
                            Create new
                          </Link>
                        </div>
                      </form>
                    </div>
                  </div>

                  {/* Image side */}
                  <div className="col-lg-6 d-flex align-items-center gradient-custom-2 image">
                    <div className="px-3 py-4 p-md-5 mx-md-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
