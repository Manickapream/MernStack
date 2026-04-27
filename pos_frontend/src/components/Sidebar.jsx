import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, PlusCircle, MessageSquare, LogOut, Zap, Menu, X } from 'lucide-react'
import './Sidebar.css'

const navItems = [
  { to: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products',     icon: Package,         label: 'Products' },
  { to: '/admin/products/add', icon: PlusCircle,      label: 'Add Product' },
  { to: '/admin/inquiries',    icon: MessageSquare,   label: 'Inquiries' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleLogout() {
    if (window.confirm('Are you sure you want to logout?')) {
      sessionStorage.clear()
      window.location.href = '/'
    }
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        <div className="mobile-brand">
          <div className="mobile-brand-icon"><Zap size={16} /></div>
          <span>POS Solution</span>
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Overlay backdrop */}
      {mobileOpen && <div className="sidebar-overlay" onClick={closeMobile} />}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileOpen ? 'sidebar--open' : ''}`}>
        {/* Close button (mobile only) */}
        <button className="sidebar-close" onClick={closeMobile} aria-label="Close menu">
          <X size={20} />
        </button>

        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon"><Zap size={20} /></div>
          <div>
            <div className="brand-name">POS Solution</div>
            <div className="brand-sub">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={closeMobile}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
