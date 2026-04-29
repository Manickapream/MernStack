import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Products from './pages/Products'
import Product from './pages/Product'
import Book from './pages/Book'
import Service from './pages/Service'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AddProduct from './pages/AddProduct'
import EditProduct from './pages/EditProduct'
import ViewProducts from './pages/ViewProducts'
import ViewInquiries from './pages/ViewInquiries'
import ViewContacts from './pages/ViewContacts'
import InquiryForm from './pages/InquiryForm'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid #334155',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Service />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/book" element={<Book />} />
        <Route path="/inquiry" element={<InquiryForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin (protected) */}
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ViewProducts />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="inquiries" element={<ViewInquiries />} />
          <Route path="contacts" element={<ViewContacts />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
