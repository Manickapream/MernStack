import React, { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import "./Contact.css";

function Contact({ hideNavbar = false }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    updates: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        updates: formData.updates,
        message: formData.message
      };

      await api.post('contacts/', payload);
      alert("Message Submitted Successfully!");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        updates: false,
        message: "",
      });
    } catch (error) {
      console.error("Submission error", error);
      alert("Failed to submit message. Please try again.");
    }
  };

  return (
    <div style={{ background: "#e8897d", minHeight: "100vh" }}>
      {!hideNavbar && <Navbar theme="light" />}
      <section className="contact-section" id="contact" style={{ minHeight: "calc(100vh - 80px)", padding: "20px 30px 50px" }}>
        <div className="contact-wrapper">
        {/* Left Side */}
        <div className="contact-left">
          <h1>Contact us</h1>

          <p>
            Interested in working together? Fill out some info and we will be in
            touch shortly. We can’t wait to hear from you!
          </p>
        </div>

        {/* Right Side */}
        <div className="contact-right">
          <form className="contact-form" onSubmit={handleSubmit}>
            {/* Name */}
            <label>Name</label>

            <div className="name-row">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            {/* Checkbox */}
            <div className="checkbox-row">
              <input
                type="checkbox"
                name="updates"
                checked={formData.updates}
                onChange={handleChange}
              />
              <span>Sign up for news and updates</span>
            </div>

            {/* Message */}
            <label>Message</label>
            <textarea
              name="message"
              rows="5"
              placeholder="Write your message..."
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit">SEND</button>
          </form>
        </div>
      </div>
      </section>
    </div>
  );
}

export default Contact;
