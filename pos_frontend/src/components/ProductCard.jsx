import { useNavigate } from 'react-router-dom'
import { MessageCircle, FileText, IndianRupee, Download, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import './ProductCard.css'

export default function ProductCard({ product }) {
  const navigate = useNavigate()

  const handleEnquiry = () => {
    navigate('/inquiry', { state: { product_name: product.name, price: product.price } })
  }

  const hasDocument = !!product.document_url

  const handleDocUnavailable = () => {
    toast('📄 Document not available for this product', {
      icon: '⚠️',
      style: { background: '#1e293b', color: '#f1f5f9', border: '1px solid #334155' },
    })
  }

  return (
    <div className="product-card">
      {/* Price Badge */}
      <div className="product-price-badge">
        <IndianRupee size={13} strokeWidth={2.5} />
        {product.price}
      </div>

      {/* Image */}
      <div className="product-img-wrap" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="product-img" />
        ) : (
          <div className="product-img-placeholder">
            <span>No Image</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="product-info">
        <h3 className="product-name" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>{product.name}</h3>
        {product.description && (
          <p className="product-desc">{product.description}</p>
        )}
      </div>

      {/* Document availability badge */}
      <div className="doc-status-row">
        {hasDocument ? (
          <span className="doc-badge doc-badge--available">
            <FileText size={11} /> Document Available
          </span>
        ) : (
          <span className="doc-badge doc-badge--unavailable">
            <AlertCircle size={11} /> Document Currently Unavailable
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="product-actions">
        <button className="btn btn-primary" onClick={handleEnquiry} id={`enquiry-${product.id}`}>
          <MessageCircle size={15} />
          Enquiry
        </button>

        {hasDocument ? (
          <a
            href={product.document_url}
            target="_blank"
            rel="noreferrer"
            download
            className="btn btn-ghost doc-btn"
            id={`doc-${product.id}`}
          >
            <Download size={15} />
            Document
          </a>
        ) : (
          <button
            className="btn btn-ghost doc-btn doc-btn--disabled"
            onClick={handleDocUnavailable}
            id={`doc-${product.id}`}
          >
            <FileText size={15} />
            Document
          </button>
        )}
      </div>
    </div>
  )
}
