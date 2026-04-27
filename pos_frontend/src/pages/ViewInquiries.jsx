import { useState, useEffect } from 'react'
import { MessageSquare, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import './ViewInquiries.css'

export default function ViewInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const role = sessionStorage.getItem('user_role') || 'User'

  const fetchInquiries = () => {
    api.get('inquiries/')
      .then(res => setInquiries(res.data))
      .catch(() => toast.error('Failed to load inquiries'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchInquiries() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return
    try {
      await api.delete(`inquiries/${id}/`)
      toast.success('Inquiry deleted')
      setInquiries(prev => prev.filter(i => i.id !== id))
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete inquiry')
    }
  }

  const formatDate = (dt) => new Date(dt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="page-header">
          <div>
            <h1>Inquiries</h1>
            <p className="page-sub">{inquiries.length} inquiry record{inquiries.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : inquiries.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={60} />
            <h3>No inquiries yet</h3>
            <p>Customer inquiries will appear here</p>
          </div>
        ) : (
          <div className="card table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Mobile</th>
                  <th>Message</th>
                  <th>Date</th>
                  {role === 'Admin' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq, i) => (
                  <tr key={inq.id}>
                    <td className="row-num">{i + 1}</td>
                    <td>
                      <div className="customer-name">{inq.name}</div>
                      <div className="customer-email">{inq.email}</div>
                    </td>
                    <td>
                      <span className="inq-product">{inq.product_name || '—'}</span>
                    </td>
                    <td>
                      {inq.price ? (
                        <span className="price-chip-inq">₹ {inq.price}</span>
                      ) : '—'}
                    </td>
                    <td>
                      <a href={`tel:${inq.mobile}`} className="mobile-link">{inq.mobile}</a>
                    </td>
                    <td>
                      <div className="inq-message" title={inq.message}>{inq.message}</div>
                    </td>
                    <td>
                      <span className="inq-date">{formatDate(inq.created_at)}</span>
                    </td>
                    {role === 'Admin' && (
                      <td>
                        <button
                          className="btn btn-danger action-btn"
                          onClick={() => handleDelete(inq.id)}
                          id={`del-inq-${inq.id}`}
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
