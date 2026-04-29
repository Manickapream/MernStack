import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import './Products.css'

export default function Products({ hideNavbar = false }) {
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
    <div className="products-page">
      {!hideNavbar && <Navbar theme="light" />}

      {/* Search Section */}
      <section className="products-search-section">
        <h1 className="products-title">Our Products</h1>
        <p className="products-subtitle">
          Browse our range of high-performance CNC controllers, drives, and automation solutions.
        </p>
        <div className="products-search-bar">
          <Search size={18} className="products-search-icon" />
          <input
            id="searchInput"
            type="text"
            placeholder="Search by Product Name / Controller / Manufacturer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="products-search-input"
          />
          {search && (
            <button className="products-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <main className="products-content">
        {loading ? (
          <div className="products-loader">
            <div className="products-spinner" />
            <span>Loading products...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="products-empty">
            <Search size={48} />
            <h3>No products found</h3>
            <p>Try a different search term</p>
          </div>
        ) : (
          <>
            <p className="products-results-count">
              <span className="count-num">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''} found
            </p>
            <div className="products-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="products-footer">
        <p>© 2026 VS Tech Manufacturing Solutions. All rights reserved.</p>
      </footer>
    </div>
  )
}
