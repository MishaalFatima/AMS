import SubNavbar from "../NavBar.jsx"; 
import {
  faBehance,
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function WelcomePageStudent() {
  return (
    <div>
      <SubNavbar />
      <div>
        {/* Hero Section */}
        <div className="img-sec1" id="img-sec1">
          <p>Track your attendance in one click</p>
          <h1 className="h1">
            Mark<b>.</b>Leave<b>.</b>View
          </h1>
        </div>

        {/* Stats Counters */}
        <div id="section4">
          <section>
            <div className="contain">
              <div className="row">
                <div className="col-md-3 col-sm-6 text-center">
                  <i className="fa fa-check medium-icon"></i>
                  <span className="timer counter alt-font appear">180</span>
                  <p className="counter-title">Days Present</p>
                </div>

                <div className="col-md-3 col-sm-6 text-center">
                  <i className="fa fa-times medium-icon"></i>
                  <span className="timer counter alt-font appear">20</span>
                  <p className="counter-title">Days Absent</p>
                </div>

                <div className="col-md-3 col-sm-6 text-center">
                  <i className="fa fa-envelope medium-icon"></i>
                  <span className="timer counter alt-font appear">5</span>
                  <p className="counter-title">Leaves Requested</p>
                </div>

                <div className="col-md-3 col-sm-6 text-center">
                  <i className="fa fa-user medium-icon"></i>
                  <span className="timer counter alt-font appear">1</span>
                  <p className="counter-title">Profile Updates</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Contact */}
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
                Need Help?
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
                    name="Phone"
                    className="form-control"
                    placeholder="Your Phone Number *"
                    defaultValue=""
                  />
                </div>
                <div className="form-group py-5">
                  <button
                    type="button"
                    className="btn btn-block fa-lg gradient-custom-2 mb-3 px-5 text-white"
                  >
                    Submit Inquiry
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group pt-5">
                  <textarea
                    name="Msg"
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
          <h1 className="h1-sec7">Attendance Portal Team</h1>
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
    </div>
  );
}

export default WelcomePageStudent;
