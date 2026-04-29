import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, IndianRupee, MessageCircle, Download,
  FileText, AlertCircle, Package, Zap
} from 'lucide-react'
import Navbar from '../components/Navbar'
import api from '../api/axios'
import './Product.css'

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    api.get(`products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return (
      <div className="product-page">
        <div className="page-loader">
          <div className="spinner" />
          <span>Loading product...</span>
        </div>
      </div>
    )
  }

  if (!product) return null

  const hasDocument = !!product.document_url

  const handleEnquiry = () => {
    navigate('/inquiry', { state: { product_name: product.name, price: product.price } })
  }

  return (
    <div className="product-page">
      <Navbar theme="light" />

      {/* Product Detail */}
      <main className="product-detail">
        <div className="product-detail-grid">
          {/* Image Side */}
          <div className="product-detail-image">
            <div className="detail-img-wrap">
              {product.image_url ? (
                <>
                  {!imgLoaded && (
                    <div className="img-skeleton">
                      <Package size={40} />
                    </div>
                  )}
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className={`detail-img ${imgLoaded ? 'loaded' : ''}`}
                    onLoad={() => setImgLoaded(true)}
                  />
                </>
              ) : (
                <div className="detail-img-placeholder">
                  <Package size={48} />
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Info Side */}
          <div className="product-detail-info">
            {/* Price */}
            <div className="detail-price">
              <IndianRupee size={20} strokeWidth={2.5} />
              <span className="detail-price-value">{product.price}</span>
            </div>

            {/* Name */}
            <h1 className="detail-name">{product.name}</h1>

            {/* Description */}
            {product.description && (
              <p className="detail-description">{product.description}</p>
            )}

            {/* Document Status */}
            <div className="detail-doc-status">
              {hasDocument ? (
                <span className="doc-badge doc-badge--available">
                  <FileText size={13} /> Document Available
                </span>
              ) : (
                <span className="doc-badge doc-badge--unavailable">
                  <AlertCircle size={13} /> Document Currently Unavailable
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="detail-divider" />

            {/* Actions */}
            <div className="detail-actions">
              <button className="btn btn-primary detail-btn" onClick={handleEnquiry} id="enquiryBtn">
                <MessageCircle size={17} />
                Send Enquiry
              </button>

              {hasDocument ? (
                <a
                  href={product.document_url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="btn btn-ghost detail-btn"
                  id="downloadDocBtn"
                >
                  <Download size={17} />
                  Download Document
                </a>
              ) : (
                <button className="btn btn-ghost detail-btn detail-btn--disabled" disabled id="downloadDocBtn">
                  <FileText size={17} />
                  Document Unavailable
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="product-footer">
        <p>© 2026 VS Tech Manufacturing Solutions. All rights reserved.</p>
      </footer>
    </div>
  )
}
