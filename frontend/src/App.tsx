import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProjectsList from './pages/ProjectsList'
import ProjectView from './pages/ProjectView'
import Reports from './pages/Reports'
import Login from './pages/Login'

function ProtectedRoute() {
  const token = localStorage.getItem('auth_token')
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectsList />} />
          <Route path="/project/:id" element={<ProjectView />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

