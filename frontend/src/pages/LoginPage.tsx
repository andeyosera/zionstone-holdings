import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../stores/auth.store'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await authService.login(form.email, form.password)
      setAuth(result.user, result.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF] flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0A1F5C] flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A56DB] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">Z</span>
          </div>
          <div>
            <p className="text-white font-bold tracking-tight">ZIONSTONE HOLDINGS</p>
            <p className="text-white/40 text-xs">Building Better. Hosting Smarter.</p>
          </div>
        </div>

        <div>
          <h2 className="text-white text-4xl font-bold leading-tight mb-4">
            Welcome back to<br/>
            <span className="text-[#3B82F6]">Zionstone</span>
          </h2>
          <p className="text-white/60 leading-relaxed">
            Your gateway to the best properties across Kakamega County. Sign in to manage your bookings and listings.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { n: '48+', l: 'Properties' },
              { n: '4.8★', l: 'Avg Rating' },
              { n: '300+', l: 'Happy Guests' },
              { n: '12', l: 'Towns' },
            ].map(s => (
              <div key={s.l} className="bg-white/10 rounded-xl p-4">
                <p className="text-white font-bold text-2xl">{s.n}</p>
                <p className="text-white/50 text-xs mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/30 text-xs">
          © 2024 Zionstone Holdings Ltd · Kakamega County, Kenya
        </p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#0A1F5C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <p className="font-bold text-[#0A1F5C]">ZIONSTONE HOLDINGS</p>
          </div>

          <h1 className="text-3xl font-bold text-[#0A1F5C] mb-2">Sign in</h1>
          <p className="text-gray-500 mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#1A56DB] font-medium hover:underline">
              Create one free
            </Link>
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700
                            rounded-lg px-4 py-3 mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm(f => ({...f, email: e.target.value}))}
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm
                           focus:outline-none focus:border-[#1A56DB] focus:ring-2
                           focus:ring-[#1A56DB]/20 transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={form.password}
                onChange={e => setForm(f => ({...f, password: e.target.value}))}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm
                           focus:outline-none focus:border-[#1A56DB] focus:ring-2
                           focus:ring-[#1A56DB]/20 transition-all placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A56DB] text-white py-3.5 rounded-lg font-semibold
                         text-sm hover:bg-[#0A1F5C] transition-colors disabled:opacity-60
                         disabled:cursor-not-allowed shadow-sm mt-2"
            >
              {loading ? 'Signing in...' : 'Sign in to Zionstone'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              By signing in you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

          {/* Quick test credentials */}
          <div className="mt-4 bg-[#F5F8FF] border border-[#EBF2FF] rounded-lg p-4">
            <p className="text-xs font-semibold text-[#0A1F5C] mb-2">
              🧪 Test credentials
            </p>
            <p className="text-xs text-gray-500">
              Guest: <span className="font-mono text-[#1A56DB]">achieng@gmail.com</span>
            </p>
            <p className="text-xs text-gray-500">
              Host: <span className="font-mono text-[#1A56DB]">james@zionstone.co.ke</span>
            </p>
            <p className="text-xs text-gray-500">
              Password: <span className="font-mono text-[#1A56DB]">password123</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}