import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/auth.service'
import { useAuthStore } from '../stores/auth.store'

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'GUEST'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      const result = await authService.register(
        form.name, form.email, form.password, form.role
      )
      setAuth(result.user, result.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong')
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
            Join Zionstone.<br/>
            <span className="text-[#3B82F6]">Build your future.</span>
          </h2>
          <p className="text-white/60 leading-relaxed mb-8">
            Whether you're looking for a place to stay or want to list your property — Zionstone is your home.
          </p>

          {[
            { icon: '🏠', title: 'List your property', desc: 'Earn income from your space' },
            { icon: '📅', title: 'Book with confidence', desc: 'Verified properties only' },
            { icon: '💬', title: 'Trusted community', desc: 'Real reviews from real guests' },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-3 mb-5">
              <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center
                              justify-center text-lg flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{item.title}</p>
                <p className="text-white/50 text-xs">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-white/30 text-xs">
          © 2024 Zionstone Holdings Ltd · Kakamega County, Kenya
        </p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#0A1F5C] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <p className="font-bold text-[#0A1F5C]">ZIONSTONE HOLDINGS</p>
          </div>

          <h1 className="text-3xl font-bold text-[#0A1F5C] mb-2">Create account</h1>
          <p className="text-gray-500 mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1A56DB] font-medium hover:underline">
              Sign in
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
                Full name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={e => setForm(f => ({...f, name: e.target.value}))}
                placeholder="James Wanjala"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm
                           focus:outline-none focus:border-[#1A56DB] focus:ring-2
                           focus:ring-[#1A56DB]/20 transition-all placeholder:text-gray-400"
              />
            </div>

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

            {/* Role selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'GUEST', label: '🔍 Find & Book', desc: 'Browse and book properties' },
                  { value: 'HOST',  label: '🏠 List & Earn', desc: 'List my property' },
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setForm(f => ({...f, role: option.value}))}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      form.role === option.value
                        ? 'border-[#1A56DB] bg-[#EBF2FF]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-semibold text-sm text-[#0A1F5C]">{option.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{option.desc}</p>
                  </button>
                ))}
              </div>
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
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm
                           focus:outline-none focus:border-[#1A56DB] focus:ring-2
                           focus:ring-[#1A56DB]/20 transition-all placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={e => setForm(f => ({...f, confirmPassword: e.target.value}))}
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
              {loading ? 'Creating account...' : 'Create my account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              By creating an account you agree to our Terms of Service and Privacy Policy
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}