import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Zap, User, Mail, Lock, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import './Login.css'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('auth/signup/', {
        name: form.name,
        email: form.email,
        password: form.password,
      })
      if (res.data.success) {
        sessionStorage.setItem('admin_id', res.data.admin_id)
        sessionStorage.setItem('admin_name', res.data.name)
        sessionStorage.setItem('admin_email', res.data.email)
        sessionStorage.setItem('user_role', res.data.role)
        toast.success(`Welcome, ${res.data.name}!`)
        navigate('/admin/dashboard')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed. Please try again.'
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
          <h1>Admin Signup</h1>
          <p>Create a new admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrap">
              <User size={16} className="input-icon" />
              <input
                id="name"
                name="name"
                type="text"
                className="form-control login-input"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
          </div>

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
                placeholder="Min 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-control login-input"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            id="signupBtn"
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? (
              <><div className="spinner-sm" /> Creating account...</>
            ) : (
              <><UserPlus size={17} /> Sign Up</>
            )}
          </button>
        </form>

        <p className="login-footer">
          Already have an account? <Link to="/login" className="back-link">Sign In</Link>
        </p>
        <p className="login-footer" style={{ marginTop: '0.5rem' }}>
          <a href="/" className="back-link">← Back to Products</a>
        </p>
      </div>
    </div>
  )
}
