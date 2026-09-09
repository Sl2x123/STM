import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ProjectsList from './pages/ProjectsList'
import ProjectView from './pages/ProjectView'
import Reports from './pages/Reports'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsList />} />
        <Route path="/project/:id" element={<ProjectView />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}

export default App
