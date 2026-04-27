import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Send, ArrowLeft, User, Mail, Phone, MessageSquare, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import './InquiryForm.css'

export default function InquiryForm() {
  const navigate = useNavigate()
  const location = useLocation()

  const productName = location.state?.product_name || ''
  const price = location.state?.price || ''

  const [form, setForm] = useState({
    product_name: productName,
    price: price,
    name: '',
    email: '',
    mobile: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    const mobileRegex = /^[6-9][0-9]{9}$/
    if (!mobileRegex.test(form.mobile)) {
      toast.error('Enter a valid 10-digit Indian mobile number')
      return
    }
    setLoading(true)
    try {
      await api.post('inquiries/', form)
      setSubmitted(true)
      toast.success('Inquiry submitted successfully!')
    } catch {
      toast.error('Failed to submit inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="inquiry-page">
        <div className="orb orb-1" /><div className="orb orb-2" />
        <div className="inquiry-card success-card">
          <div className="success-icon">✅</div>
          <h2>Inquiry Submitted!</h2>
          <p>Thank you <strong>{form.name}</strong>! We've received your inquiry for <strong>{productName}</strong> and will get back to you shortly on <strong>{form.mobile}</strong>.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')} id="backHomeBtn">
            ← Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="inquiry-page">
      <div className="orb orb-1" /><div className="orb orb-2" />

      <div className="inquiry-card">
        {/* Header */}
        <div className="inq-header">
          <div className="inq-brand">
            <div className="inq-brand-icon"><Zap size={18} /></div>
            <span>POS Solution</span>
          </div>
          <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)} id="backBtn">
            <ArrowLeft size={15} /> Back
          </button>
        </div>

        <div className="inq-title-row">
          <h1>Product Enquiry</h1>
          <p>Fill in your details and we'll get back to you</p>
        </div>

        {/* Product info pills */}
        {(productName || price) && (
          <div className="product-info-strip">
            {productName && <div className="info-pill"><span className="pill-label">Product</span> {productName}</div>}
            {price && <div className="info-pill accent"><span className="pill-label">Price</span> ₹ {price}</div>}
          </div>
        )}

        <form onSubmit={handleSubmit} className="inq-form">
          {/* Hidden fields */}
          <input type="hidden" name="product_name" value={form.product_name} />
          <input type="hidden" name="price" value={form.price} />

          <div className="inq-grid">
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Your Name *</label>
              <div className="input-wrap">
                <User size={15} className="input-icon" />
                <input
                  id="name" name="name" type="text"
                  className="form-control inq-input"
                  placeholder="Enter your full name"
                  value={form.name} onChange={handleChange} required />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <div className="input-wrap">
                <Mail size={15} className="input-icon" />
                <input
                  id="email" name="email" type="email"
                  className="form-control inq-input"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required />
              </div>
            </div>

            {/* Mobile */}
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number *</label>
              <div className="input-wrap">
                <Phone size={15} className="input-icon" />
                <input
                  id="mobile" name="mobile" type="tel"
                  className="form-control inq-input"
                  placeholder="10-digit mobile number"
                  pattern="[6-9][0-9]{9}"
                  maxLength="10"
                  value={form.mobile} onChange={handleChange} required />
              </div>
            </div>

            {/* Message – full width */}
            <div className="form-group full-width">
              <label htmlFor="message">Message *</label>
              <div className="input-wrap textarea-wrap">
                <MessageSquare size={15} className="input-icon textarea-icon" />
                <textarea
                  id="message" name="message"
                  className="form-control inq-input inq-textarea"
                  placeholder="Describe your requirement..."
                  rows="4"
                  value={form.message} onChange={handleChange} required />
              </div>
            </div>
          </div>

          <button
            id="submitInqBtn"
            type="submit"
            className="btn btn-primary inq-submit"
            disabled={loading}
          >
            {loading
              ? <><div className="spinner-sm" /> Submitting...</>
              : <><Send size={16} /> Submit Inquiry</>}
          </button>
        </form>
      </div>
    </div>
  )
}
