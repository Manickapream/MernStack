import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, Mail, Lock, LogIn } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import './Login.css'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('auth/login/', form)
      if (res.data.success) {
        sessionStorage.setItem('admin_id', res.data.admin_id)
        sessionStorage.setItem('admin_name', res.data.name)
        sessionStorage.setItem('admin_email', res.data.email)
        sessionStorage.setItem('user_role', res.data.role)
        toast.success(`Welcome, ${res.data.name}!`)
        navigate('/admin/dashboard')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-icon"><Zap size={28} /></div>
          <h1>Admin Login</h1>
          <p>Sign in to access the POS dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrap">
              <Mail size={16} className="input-icon" />
              <input
                id="email"
                name="email"
                type="email"
                className="form-control login-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                className="form-control login-input"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            id="loginBtn"
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? (
              <><div className="spinner-sm" /> Signing in...</>
            ) : (
              <><LogIn size={17} /> Sign In</>
            )}
          </button>
        </form>

        <p className="login-footer">
          Don't have an account? <Link to="/signup" className="back-link">Create Account</Link>
        </p>
        <p className="login-footer" style={{ marginTop: '0.5rem' }}>
          <a href="/" className="back-link">← Back to Products</a>
        </p>
      </div>
    </div>
  )
}
