import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import CreatePropertyPage from './pages/CreatePropertyPage'
import EditPropertyPage from './pages/EditPropertyPage'
import KakamegaPage from './pages/KakamegaPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"                    element={<HomePage />} />
        <Route path="/properties"          element={<PropertiesPage />} />

        {/* ⚠️ IMPORTANT: /properties/new MUST come before /properties/:id */}
        {/* Otherwise React Router matches "new" as an :id parameter */}
        <Route path="/properties/new"      element={<CreatePropertyPage />} />
        <Route path="/properties/:id/edit" element={<EditPropertyPage />} />
        <Route path="/properties/:id"      element={<PropertyDetailPage />} />

        <Route path="/kakamega"            element={<KakamegaPage />} />
        <Route path="/login"               element={<LoginPage />} />
        <Route path="/register"            element={<RegisterPage />} />
        <Route path="/dashboard"           element={<DashboardPage />} />
        <Route path="/profile"             element={<ProfilePage />} />
        <Route path="*"                    element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App