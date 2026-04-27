import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const isAdmin = !!sessionStorage.getItem('admin_id')
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />
}
