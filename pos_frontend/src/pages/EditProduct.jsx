import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, ArrowLeft, Upload, FileText, X, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import './ProductForm.css'

export default function EditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', price: '', description: '', status: 'Active' })
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [document, setDocument] = useState(null)          // new file chosen
  const [existingDoc, setExistingDoc] = useState(null)    // already saved doc info { url, name }
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const role = sessionStorage.getItem('user_role') || 'User'

  useEffect(() => {
    if (role !== 'Admin') {
      toast.error('Access denied. Admin role required.')
      navigate('/admin/dashboard')
    }
  }, [role, navigate])

  useEffect(() => {
    api.get(`products/${id}/`)
      .then(res => {
        const p = res.data
        setForm({ name: p.name, price: p.price, description: p.description || '', status: p.status })
        if (p.image_url) setPreview(p.image_url)
        if (p.document_url) setExistingDoc({ url: p.document_url, name: p.document_name || 'Document' })
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setFetching(false))
  }, [id])

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleImage = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 1 * 1024 * 1024) { toast.error('Image must be under 1MB'); return }
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) { toast.error('Only JPG, PNG, WEBP allowed'); return }
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleDocument = e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Document must be under 5MB'); return }
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ]
    if (!allowed.includes(file.type)) { toast.error('Only PDF, DOC, DOCX, XLS, XLSX allowed'); return }
    setDocument(file)
    setExistingDoc(null) // new file replaces existing display
  }

  const removeNewDocument = () => {
    setDocument(null)
    const input = window.document.getElementById('documentInput')
    if (input) input.value = ''
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.price) { toast.error('Name and Price are required'); return }
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (image)    fd.append('image', image)
      if (document) fd.append('document', document)
      await api.put(`products/${id}/`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Product updated successfully!')
      navigate('/admin/products')
    } catch {
      toast.error('Failed to update product')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="page-loader"><div className="spinner" /></div>
      </main>
    </div>
  )

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="page-header">
          <div>
            <h1>Edit Product</h1>
            <p className="page-sub">Update the product details below</p>
          </div>
          <button className="btn btn-ghost" onClick={() => navigate('/admin/products')} id="backBtn">
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              {/* Left column */}
              <div className="form-col">
                <div className="form-group">
                  <label htmlFor="name">Product Name <span className="required-star">*</span></label>
                  <input id="name" name="name" type="text" className="form-control"
                    placeholder="e.g. Fanuc 31i Controller"
                    value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="price">Price <span className="required-star">*</span></label>
                  <input id="price" name="price" type="text" className="form-control"
                    placeholder="e.g. 3Lac or 18000"
                    value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" name="description" className="form-control"
                    rows="4" placeholder="Describe the product..."
                    value={form.description} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select id="status" name="status" className="form-control"
                    value={form.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* ── Document field — OPTIONAL ── */}
                <div className="form-group">
                  <label>
                    Product Document <span className="optional-badge">Optional</span>
                  </label>

                  {/* New file chosen */}
                  {document ? (
                    <div className="doc-attached">
                      <FileText size={18} className="doc-icon" />
                      <span className="doc-name">{document.name}</span>
                      <button type="button" className="doc-remove" onClick={removeNewDocument} title="Remove">
                        <X size={14} />
                      </button>
                    </div>
                  ) : existingDoc ? (
                    /* Existing saved document */
                    <div className="doc-attached doc-existing">
                      <FileText size={18} className="doc-icon" />
                      <span className="doc-name">{existingDoc.name}</span>
                      <a href={existingDoc.url} target="_blank" rel="noreferrer"
                        className="doc-view-link" title="View document">
                        <ExternalLink size={14} />
                      </a>
                      <label htmlFor="documentInput" className="doc-change-btn" title="Replace document">
                        Replace
                      </label>
                    </div>
                  ) : (
                    /* No document */
                    <label className="doc-upload-zone" htmlFor="documentInput">
                      <FileText size={24} />
                      <span>Click to attach document</span>
                      <small>PDF, DOC, DOCX, XLS, XLSX · Max 5MB</small>
                      <em className="no-doc-hint">No document yet</em>
                    </label>
                  )}

                  <input id="documentInput" type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    onChange={handleDocument} hidden />
                </div>
              </div>

              {/* Right column – image */}
              <div className="form-col">
                <div className="form-group">
                  <label>Product Image</label>
                  <label className="img-upload-zone" htmlFor="imageInput">
                    {preview ? (
                      <img src={preview} alt="Preview" className="img-preview" />
                    ) : (
                      <div className="upload-placeholder">
                        <Upload size={32} />
                        <span>Click to change image</span>
                        <small>JPG, PNG, WEBP · Max 1MB</small>
                      </div>
                    )}
                  </label>
                  <input id="imageInput" type="file" accept="image/*"
                    onChange={handleImage} hidden />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading} id="updateBtn">
                {loading ? <><div className="spinner-sm" /> Updating...</> : <><Save size={16} /> Update Product</>}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin/products')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
