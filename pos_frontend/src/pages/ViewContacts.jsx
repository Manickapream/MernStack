import { useState, useEffect } from 'react'
import { Contact2, Trash2, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import './ViewInquiries.css'

export default function ViewContacts() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const role = sessionStorage.getItem('user_role') || 'User'

  const fetchContacts = () => {
    api.get('contacts/')
      .then(res => setContacts(res.data))
      .catch(() => toast.error('Failed to load contacts'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchContacts() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact message?')) return
    try {
      await api.delete(`contacts/${id}/`)
      toast.success('Message deleted')
      setContacts(prev => prev.filter(c => c._id !== id))
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete message')
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
            <h1>Contact Messages</h1>
            <p className="page-sub">{contacts.length} message{contacts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : contacts.length === 0 ? (
          <div className="empty-state">
            <Contact2 size={60} />
            <h3>No messages yet</h3>
            <p>Customer contact messages will appear here</p>
          </div>
        ) : (
          <div className="card table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Customer</th>
                  <th>Updates?</th>
                  <th>Message</th>
                  <th>Date</th>
                  {role === 'Admin' && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact, i) => (
                  <tr key={contact._id}>
                    <td className="row-num">{i + 1}</td>
                    <td>
                      <div className="customer-name">{contact.firstName} {contact.lastName}</div>
                      <div className="customer-email">{contact.email}</div>
                    </td>
                    <td>
                      {contact.updates ? (
                        <span className="doc-badge doc-badge--available">
                          <CheckCircle size={12} /> Yes
                        </span>
                      ) : 'No'}
                    </td>
                    <td>
                      <div className="inq-message" title={contact.message}>{contact.message}</div>
                    </td>
                    <td>
                      <span className="inq-date">{formatDate(contact.createdAt)}</span>
                    </td>
                    {role === 'Admin' && (
                      <td>
                        <button
                          className="btn btn-danger action-btn"
                          onClick={() => handleDelete(contact._id)}
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
