import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Zap, LogIn, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import api from '../api/axios'
import './Home.css'

export default function Home() {
  const [products, setProducts] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('products/')
      .then(res => { setProducts(res.data); setFiltered(res.data) })
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    ))
  }, [search, products])

  return (
    <div className="home-page">
      {/* Top bar */}
      <header className="home-topbar">
        <div className="home-brand" onClick={() => navigate('/login')} style={{ cursor: 'pointer' }} title="Admin Login">
          <div className="home-brand-icon"><Zap size={20} /></div>
          <span className="home-brand-text">POS Solution</span>
        </div>
        {/* <button className="btn btn-ghost" onClick={() => navigate('/login')} id="adminLoginBtn">
          <LogIn size={16} />
          Admin Login
          <ChevronRight size={14} />
        </button> */}
      </header>

      {/* Hero */}
      <section className="home-hero">
        <div className="hero-badge">Industrial CNC &amp; Automation</div>
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
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </section>

      {/* Products Grid */}
      <main className="home-content">
        {loading ? (
          <div className="page-loader">
            <div className="spinner" />
            <span>Loading products...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Search size={48} />
            <h3>No products found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <>
            <p className="results-count">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="product-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 POS Solution. All rights reserved.</p>
      </footer>
    </div>
  )
}
