import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import img from "../images/logo.png";

function header() {
  return (
    <div>
      <Navbar data-bs-theme="dark" className="head">
        <img
          className="mx-5"
          src={img}
          style={{
            width: 70,
            height: 55,
            backgroundColor: "white",
            marginLeft: "0px",
          }}
          alt="logo"
        />
        <Container>
          <Navbar.Brand href="#home"></Navbar.Brand>
          <Nav className="ms-auto react-router-link-wrapper">
            <Link className="text-dark" to="/home">
              Home
            </Link>
            <Link className="text-dark" to="/register">
              Register
            </Link>
            <Link className="text-dark" to="/login">
              Login
            </Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default header;
