// src/components/WelcomePageAdmin.jsx
import React from "react";
import SubNavbar from "./AdminNavBar";
import {
  faBehance,
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function WelcomePageAdmin() {
  return (
    <div>
      <SubNavbar />

      {/* Hero Section */}
      <div className="img-sec1" id="img-sec1">
        <p>All your attendance data at a glance</p>
        <h1 className="h1">
          Manage<b>.</b>Approve<b>.</b>Report
        </h1>
      </div>

      {/* Stats Counters */}
      <div id="section4">
        <section>
          <div className="contain">
            <div className="row">
              <div className="col-md-3 col-sm-6 text-center">
                <i className="fa fa-users medium-icon"></i>
                <span className="timer counter alt-font appear">250</span>
                <p className="counter-title">Total Students</p>
              </div>

              <div className="col-md-3 col-sm-6 text-center">
                <i className="fa fa-check medium-icon"></i>
                <span className="timer counter alt-font appear">180</span>
                <p className="counter-title">Today’s Marks</p>
              </div>

              <div className="col-md-3 col-sm-6 text-center">
                <i className="fa fa-clock-o medium-icon"></i>
                <span className="timer counter alt-font appear">15</span>
                <p className="counter-title">Pending Leaves</p>
              </div>

              <div className="col-md-3 col-sm-6 text-center">
                <i className="fa fa-file-text medium-icon"></i>
                <span className="timer counter alt-font appear">12</span>
                <p className="counter-title">Profile Updates</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Contact / Support */}
      <div
        className="container border contact-form border mb-5"
        style={{
          backgroundColor: "whitesmoke",
          marginTop: "120px",
          padding: "50px",
        }}
        id="sec7"
      >
        <form>
          <div className="row">
            <h2
              className="text-center"
              style={{ fontSize: "40px", fontWeight: "bolder" }}
            >
              Need Assistance?
            </h2>
            <div className="col-md-6">
              <div className="form-group pt-5">
                <input
                  type="text"
                  name="Name"
                  className="form-control"
                  placeholder="Your Name *"
                  defaultValue=""
                />
              </div>
              <div className="form-group pt-5">
                <input
                  type="text"
                  name="Email"
                  className="form-control"
                  placeholder="Your Email *"
                  defaultValue=""
                />
              </div>
              <div className="form-group pt-5">
                <input
                  type="text"
                  name="Subject"
                  className="form-control"
                  placeholder="Subject *"
                  defaultValue=""
                />
              </div>
              <div className="form-group py-5">
                <button
                  type="button"
                  className="btn btn-block fa-lg gradient-custom-2 mb-3 px-5 text-white"
                >
                  Submit Ticket
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group pt-5">
                <textarea
                  name="Message"
                  className="form-control"
                  placeholder="Your Message *"
                  style={{ width: "100%", height: "150px" }}
                  defaultValue=""
                ></textarea>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <div className="section7 text-center p-5 bg-dark text-light" id="sec8">
        <h1 className="h1-sec7">Attendance Admin Team</h1>
        <div className="fa">
          <FontAwesomeIcon className="mx-2" icon={faFacebook} />
          <FontAwesomeIcon className="mx-2" icon={faTwitter} />
          <FontAwesomeIcon className="mx-2" icon={faInstagram} />
          <FontAwesomeIcon className="mx-2" icon={faLinkedin} />
          <FontAwesomeIcon className="mx-2" icon={faBehance} />
        </div>
        <p className="last">
          © 2025 Attendance Management System. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default WelcomePageAdmin;
