import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./About.css";

function About({ hideNavbar = false }) {
  const navigate = useNavigate();

  return (
    <section className="about-section" id="about">
      {/* Navbar */}
      {!hideNavbar && <Navbar theme="light" />}

      {/* Main Content */}
      <div className="about-container">
        {/* Left */}
        <div className="about-left">
          <h1>Who we are</h1>

          <p>
            Schedule an appointment with our technology specialists today to
            unlock the full potential of your digital solutions. Our experts are
            ready to provide tailored advice that aligns with your business
            goals.
          </p>

          <div className="about-stats">
            <div className="stat-box">
              <h3>10+</h3>
              <span>Years Experience</span>
            </div>

            <div className="stat-box">
              <h3>250+</h3>
              <span>Projects Delivered</span>
            </div>

            <div className="stat-box">
              <h3>98%</h3>
              <span>Client Satisfaction</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="about-right">
          <div className="device-box">
            <div className="device-inner"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
