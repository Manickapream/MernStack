import { Search } from 'lucide-react'
import ProductCard from './ProductCard'
import './ProductGrid.css'

export default function ProductGrid({ products, loading }) {
  if (loading) {
    return (
      <div className="page-loader">
        <div className="spinner" />
        <span>Loading products...</span>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon-wrap">
          <Search size={48} />
        </div>
        <h3>No products found</h3>
        <p>Try a different search term</p>
      </div>
    )
  }

  return (
    <>
      <div className="results-header">
        <p className="results-count">
          <span className="results-number">{products.length}</span> product{products.length !== 1 ? 's' : ''} found
        </p>
      </div>
      <div className="product-grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  )
}
