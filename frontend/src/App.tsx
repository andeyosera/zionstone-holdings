import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import KakamegaPage from './pages/KakamegaPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"            element={<HomePage />} />
        <Route path="/properties"  element={<PropertiesPage />} />
        <Route path="/kakamega"    element={<KakamegaPage />} />
        <Route path="/login"       element={<LoginPage />} />
        <Route path="/register"    element={<RegisterPage />} />
        <Route path="/dashboard"   element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App