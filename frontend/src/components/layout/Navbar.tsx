import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/auth.store'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) =>
    location.pathname === path
      ? 'text-brand-blue font-medium'
      : 'text-zinc-600 hover:text-brand-blue'

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-zinc-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-navy rounded-lg flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">Z</span>
          </div>
          <div className="leading-none">
            <span className="font-display font-bold text-brand-navy text-lg tracking-tight">
              ZION<span className="text-brand-blue">STONE</span>
            </span>
            <p className="text-[9px] tracking-widest uppercase text-zinc-400 font-body">
              Holdings Ltd
            </p>
          </div>
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/properties"
            className={`text-sm transition-colors ${isActive('/properties')}`}>
            Explore Properties
          </Link>
          <Link to="/kakamega"
            className={`text-sm transition-colors ${isActive('/kakamega')}`}>
            Kakamega
          </Link>
          
          {!user && (
            <Link to="/register"
              className="text-sm text-zinc-600 hover:text-brand-blue transition-colors">
              Become a Host
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link to="/dashboard"
                className="text-sm text-zinc-600 hover:text-brand-blue transition-colors">
                Dashboard
              </Link>
              <Link to="/profile"
                className="text-sm text-zinc-600 hover:text-brand-blue transition-colors">
                Profile
              </Link>
  
              <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center">
                <span className="text-brand-navy font-semibold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-outline text-xs py-2 px-4">
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="text-sm text-zinc-600 hover:text-brand-blue transition-colors px-3 py-2">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-5">
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}