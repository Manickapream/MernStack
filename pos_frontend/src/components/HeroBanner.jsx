import { Search } from 'lucide-react'
import './HeroBanner.css'

export default function HeroBanner({ search, onSearchChange }) {
  return (
    <section className="home-hero">
      {/* Floating particles */}
      <div className="hero-particles">
        <span className="particle p1" />
        <span className="particle p2" />
        <span className="particle p3" />
        <span className="particle p4" />
        <span className="particle p5" />
      </div>

      <div className="hero-badge">
        <span className="badge-dot" />
        Industrial CNC &amp; Automation
      </div>

      <h1 className="hero-title">
        Professional <span className="accent-text">POS Products</span>
      </h1>

      <p className="hero-sub">
        Browse our range of high-performance CNC controllers, drives, and automation solutions.
      </p>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          id="searchInput"
          type="text"
          placeholder="Search by Product Name / Controller / Manufacturer..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="search-clear" onClick={() => onSearchChange('')}>
            ✕
          </button>
        )}
      </div>
    </section>
  )
}
