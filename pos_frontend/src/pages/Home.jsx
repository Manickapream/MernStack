import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, Cpu } from "lucide-react";
import Navbar from "../components/Navbar";
import Products from "./Products";
import Service from "./Service";
import About from "./About";
import Contact from "./Contact";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <Navbar theme="light" />

      {/* Hero Section */}
      <section className="hero-section">
        {/* Animated Background Elements */}
        <div className="hero-bg-glow glow-1"></div>
        <div className="hero-bg-glow glow-2"></div>
        <div className="hero-bg-glow glow-3"></div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            Pioneering Industrial Automation
          </div>

          <h1>
            <span className="text-gradient">Innovative</span> Technology<br />
            Solutions for Tomorrow
          </h1>

          <p>
            Harness the power of cutting-edge technology to drive your business
            forward. Explore innovative solutions that redefine efficiency,
            inspire creativity, and elevate your competitive edge.
          </p>

          <div className="hero-cta-group">
            <button className="btn-primary" onClick={() => navigate('/products')}>
              Explore Products <ArrowRight size={18} />
            </button>
            <button className="btn-secondary" onClick={() => navigate('/contact')}>
              Contact Sales
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <Zap size={28} className="stat-icon" />
              <div>
                <strong>99.9%</strong>
                <span>Uptime Reliability</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <Shield size={28} className="stat-icon" />
              <div>
                <strong>100%</strong>
                <span>Secure Systems</span>
              </div>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <Cpu size={28} className="stat-icon" />
              <div>
                <strong>24/7</strong>
                <span>Technical Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Embedded Pages (Single Page Layout) */}
      <div id="products"><Products hideNavbar={true} /></div>
      <div id="services"><Service hideNavbar={true} /></div>
      <div id="about"><About hideNavbar={true} /></div>
      <div id="contact"><Contact hideNavbar={true} /></div>
    </div>
  );
}

export default Home;
