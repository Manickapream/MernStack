import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, MessageSquare, BarChart3, TrendingUp, ArrowRight } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import './Dashboard.css'

export default function Dashboard() {
  const [stats, setStats] = useState({ total_products: 0, total_inquiries: 0, total_all_products: 0 })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const adminName = sessionStorage.getItem('admin_name') || 'Admin'
  const role = sessionStorage.getItem('user_role') || 'User'

  useEffect(() => {
    api.get('dashboard/stats/')
      .then(res => setStats(res.data))
      .catch(() => { })
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    {
      label: 'Active Products',
      value: stats.total_products,
      icon: Package,
      color: 'cyan',
      action: () => navigate('/admin/products'),
    },
    {
      label: 'Total Inquiries',
      value: stats.total_inquiries,
      icon: MessageSquare,
      color: 'purple',
      action: () => navigate('/admin/inquiries'),
    },
    {
      label: 'All Products',
      value: stats.total_all_products,
      icon: BarChart3,
      color: 'green',
      action: () => navigate('/admin/products'),
    },
  ]

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        {/* Header */}
        <div className="page-header">
          <div>
            <h1>Dashboard</h1>
            <p className="welcome-text">Welcome back, <strong>{adminName}</strong> 👋</p>
          </div>
          {role === 'Admin' && (
            <button className="btn btn-primary" onClick={() => navigate('/admin/products/add')} id="addProductBtn">
              <Package size={16} />
              Add Product
            </button>
          )}
        </div>

        {/* Stat Cards */}
        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : (
          <div className="stat-grid">
            {statCards.map(({ label, value, icon: Icon, color, action }) => (
              <div
                key={label}
                className={`stat-card stat-card--${color}`}
                onClick={action}
                role="button"
                id={`stat-${label.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="stat-icon-wrap">
                  <Icon size={22} />
                </div>
                <div className="stat-body">
                  <div className="stat-value">{value}</div>
                  <div className="stat-label">{label}</div>
                </div>
                <ArrowRight size={18} className="stat-arrow" />
              </div>
            ))}
          </div>
        )}

        {/* Quick links */}
        <div className="quick-actions">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-grid">
            {role === 'Admin' && (
              <div className="quick-card" onClick={() => navigate('/admin/products/add')} role="button">
                <Package size={24} />
                <span>Add New Product</span>
                <ArrowRight size={16} />
              </div>
            )}
            <div className="quick-card" onClick={() => navigate('/admin/inquiries')} role="button">
              <MessageSquare size={24} />
              <span>View Inquiries</span>
              <ArrowRight size={16} />
            </div>
            <div className="quick-card" onClick={() => navigate('/admin/products')} role="button">
              <TrendingUp size={24} />
              <span>Manage Products</span>
              <ArrowRight size={16} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
