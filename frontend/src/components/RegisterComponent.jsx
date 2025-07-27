// src/components/RegisterComponent.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faKey,
  faLock,
  faFile,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import img from "../images/register.png";
import HeaderComponent from "./header";

function RegisterComponent() {
  const navigate = useNavigate();

  // 👇 new: load roles from your DB
  const [rolesList, setRolesList] = useState([]);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/public/roles", {
      headers: {
        Accept: "application/json",
        // if you want to protect roles by permission, include:
        // Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not load roles");
        return res.json();
      })
      .then((data) => setRolesList(data))
      .catch((err) => {
        console.error("Roles fetch error:", err);
        alert("Failed to load roles. Please try again.");
      });
  }, []);

  const [previewUri, setPreviewUri] = useState("");
  const [user, setUser] = useState({
    UserName: "",
    email: "",
    phone: "",
    role_id: "",                     // this will now hold the role ID
    password: "",
    password_confirmation: "",
    img_uri: null,
  });

  function fileChangeHandler(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUser((prev) => ({ ...prev, img_uri: file }));

    const reader = new FileReader();
    reader.onload = (evt) => setPreviewUri(evt.target.result);
    reader.readAsDataURL(file);
  }

  function changeHandler(e) {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,              // role comes through as the role ID string
    }));
  }

  async function SubmitHandler(e) {
    e.preventDefault();
    if (user.password !== user.password_confirmation) {
      alert("Passwords do not match");
      return;
    }

    const formData = new FormData();
    for (let key in user) {
      formData.append(key, user[key]);
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!res.ok) {
        let errors;
        try {
          const data = await res.json();
          errors = data.errors ?? data.message ?? data;
        } catch {
          errors = `Server returned status ${res.status}`;
        }
        console.log("Server errors:", errors);
        alert("Registration failed:\n" + JSON.stringify(errors, null, 2));
        return;
      }

      alert("Saved");
      navigate("/login");
    } catch (error) {
      console.log("Network error:", error);
      alert("An error occurred");
    }
  }

  return (
    <div>
      <HeaderComponent />

      <section className="vh-100 mt-5">
        <div className="container h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col-lg-12 col-xl-11">
              <div className="card text-black" style={{ borderRadius: 25 }}>
                <div className="card-body p-md-5">
                  <div className="row justify-content-center">
                    {/* Form Column */}
                    <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                      <p
                        className="text-center h1 fw-bold mb-3 mx-md-4 mt-2"
                        style={{ color: "black" }}
                      >
                        Sign Up
                      </p>
                      <form className="mx-1 mx-md-4" onSubmit={SubmitHandler}>
                        {/* Username */}
                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon className="mx-2" icon={faUser} />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              name="UserName"
                              type="text"
                              placeholder="UserName"
                              className="form-control"
                              onChange={changeHandler}
                              required
                            />
                          </div>
                        </div>

                        {/* Email */}
                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faEnvelope}
                          />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              name="email"
                              type="email"
                              placeholder="Your Email"
                              className="form-control"
                              onChange={changeHandler}
                              required
                            />
                          </div>
                        </div>

                        {/* Phone */}
                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon className="mx-2" icon={faPhone} />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              name="phone"
                              type="text"
                              placeholder="Your Phone Number"
                              className="form-control"
                              onChange={changeHandler}
                            />
                          </div>
                        </div>

                        {/* Role (dynamic!) */}
                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon className="mx-2" icon={faUser} />
                          <div className="form-outline flex-fill mb-0">
                            <select
                              name="role_id"
                              className="form-select"
                              value={user.role_id}
                              onChange={changeHandler}
                              required
                            >
                              <option value="">-- Select Role --</option>
                               {rolesList
                               .filter(r => ['student','admin'].includes(r.name)) // ← only these two
                               .map(r => (
                                <option key={r.id} value={r.id}>
                                  {r.name.charAt(0).toUpperCase() +
                                    r.name.slice(1)}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Password */}
                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon className="mx-2" icon={faLock} />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              name="password"
                              type="password"
                              placeholder="Password"
                              className="form-control"
                              onChange={changeHandler}
                              required
                            />
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon className="mx-2" icon={faKey} />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              name="password_confirmation"
                              type="password"
                              placeholder="Repeat your password"
                              className="form-control"
                              onChange={changeHandler}
                              required
                            />
                          </div>
                        </div>

                        {/* Image Upload */}
                        <div className="d-flex flex-row align-items-center mb-4">
                          <FontAwesomeIcon className="mx-2" icon={faFile} />
                          <div className="form-outline flex-fill mb-0">
                            <input
                              name="img_uri"
                              type="file"
                              className="form-control"
                              onChange={fileChangeHandler}
                            />
                          </div>
                        </div>

                        {/* Preview */}
                        {previewUri && (
                          <div className="d-flex justify-content-center mb-4">
                            <img
                              src={previewUri}
                              alt="Preview"
                              style={{ maxWidth: "50%" }}
                            />
                          </div>
                        )}

                        {/* Terms */}
                        <div className="form-check d-flex justify-content-center mb-3">
                          <input
                            className="form-check-input me-2"
                            type="checkbox"
                            id="form2Example3c"
                            required
                          />
                          <label
                            className="form-check-label"
                            htmlFor="form2Example3c"
                          >
                            I agree to the <a href="#!">Terms of service</a>
                          </label>
                        </div>

                        {/* Submit */}
                        <div className="d-flex justify-content-center mt-5 mb-lg-4">
                          <button
                            type="submit"
                            className="btn btn-dark px-5"
                          >
                            Register
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Image Column */}
                    <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                      <img
                        src={img}
                        alt="Sample"
                        className="img-fluid"
                        style={{ maxHeight: 500 }}
                      />
                    </div>
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

export default RegisterComponent;
