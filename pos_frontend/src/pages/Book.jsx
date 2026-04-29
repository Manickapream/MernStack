import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./Book.css";

function Book() {
  const navigate = useNavigate();
  const services = [
    {
      title: "Free Consultation",
      duration: "30 minutes",
      price: "FREE",
    },
    {
      title: "Basic Service",
      duration: "1 hour @ ₹1,500",
      price: "₹1,500",
    },
    {
      title: "Advanced Service",
      duration: "2 hours @ ₹3,000",
      price: "₹3,000",
    },
  ];

  return (
    <section className="book-section" id="book">
      {/* Navbar */}
      <Navbar theme="light" />

      {/* Main Content */}
      <div className="book-container">
        {/* Left Side */}
        <div className="book-left">
          <h1>Schedule your appointment</h1>

          <p>
            Streamline your service experience by booking an appointment with us
            today. Our expert team is ready to assist you with the latest in
            technological solutions, ensuring efficiency and precision every
            step of the way.
          </p>

          <div className="book-image-box">
            <div className="book-circle"></div>
          </div>
        </div>

        {/* Right Side */}
        <div className="book-right">
          <div className="booking-card">
            <h3>Select Appointment</h3>

            {services.map((item, index) => (
              <div className="service-item" key={index}>
                <div>
                  <h4>{item.title}</h4>
                  <span>{item.duration}</span>
                </div>

                <button onClick={() => alert("Coming Soon!")}>{item.price}</button>
              </div>
            ))}

            <p className="powered-text">Powered by acuityscheduling</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Book;
