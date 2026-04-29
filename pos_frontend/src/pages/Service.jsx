import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Service.css";

function Service({ hideNavbar = false }) {
  const navigate = useNavigate();

  const serviceData = [
    {
      number: "01",
      title: "Industrial Automation",
      desc: "Smart manufacturing systems, PLC integration, robotics and control panel solutions for modern industries.",
    },
    {
      number: "02",
      title: "Product Design",
      desc: "Precision engineering design, prototyping, CAD modeling and production-ready mechanical solutions.",
    },
    {
      number: "03",
      title: "Maintenance Support",
      desc: "Preventive maintenance, troubleshooting and performance optimization for plant equipment.",
    },
  ];

  return (
    <section className="service-section" id="services">
      {/* Navbar */}
      {!hideNavbar && <Navbar theme="light" />}

      {/* Hero Image */}
      <div className="service-banner">
        <div className="banner-overlay"></div>
      </div>

      {/* Intro */}
      <div className="service-intro">
        <h1>Our Services</h1>

        <p>
          Our technology services deliver efficient solutions tailored to your
          unique business needs, driving innovation and scalability. With a
          commitment to excellence, our expert team ensures seamless
          integration and optimal performance for sustainable growth.
        </p>
      </div>

      {/* Cards */}
      <div className="service-grid">
        {serviceData.map((item, index) => (
          <div className="service-card" key={index}>
            <span>{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
            <button onClick={() => navigate('/products')}>Learn More</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Service;
