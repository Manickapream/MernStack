import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Pencil, Trash2, Package } from 'lucide-react'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import './ViewProducts.css'

export default function ViewProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const role = sessionStorage.getItem('user_role') || 'User'

  const fetchProducts = () => {
    api.get('products/all/')
      .then(res => setProducts(res.data))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await api.delete(`products/${id}/`)
      toast.success('Product deleted')
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete product')
    }
  }

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <div className="page-header">
          <div>
            <h1>Products</h1>
            <p className="page-sub">{products.length} product{products.length !== 1 ? 's' : ''} total</p>
          </div>
          {role === 'Admin' && (
            <button className="btn btn-primary" onClick={() => navigate('/admin/products/add')} id="addProductBtn">
              <PlusCircle size={16} />
              Add Product
            </button>
          )}
        </div>

        {loading ? (
          <div className="page-loader"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <Package size={60} />
            <h3>No products yet</h3>
            <p>Click "Add Product" to get started</p>
          </div>
        ) : (
          <div className="card table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Status</th>
                  {role === 'Admin' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id}>
                    <td className="text-muted">{i + 1}</td>
                    <td>
                      <div className="product-thumb-wrap">
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.name} className="product-thumb" />
                        ) : (
                          <div className="product-thumb thumb-placeholder">
                            <Package size={16} />
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="product-name-cell">{p.name}</div>
                      {p.description && <div className="product-desc-cell">{p.description}</div>}
                    </td>
                    <td>
                      <span className="price-chip">₹ {p.price}</span>
                    </td>
                    <td>
                      <span className={`badge ${p.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {p.status}
                      </span>
                    </td>
                    {role === 'Admin' && (
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn btn-ghost action-btn"
                            onClick={() => navigate(`/admin/products/edit/${p.id}`)}
                            id={`edit-${p.id}`}
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            className="btn btn-danger action-btn"
                            onClick={() => handleDelete(p.id, p.name)}
                            id={`delete-${p.id}`}
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
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
