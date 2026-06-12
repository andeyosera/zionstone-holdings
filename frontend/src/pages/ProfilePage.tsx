import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth.store'
import { authService } from '../services/auth.service'
import api from '../services/api'

export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    setForm({ name: user.name, phone: user.phone || '' })
  }, [user, navigate])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await api.patch('/auth/profile', form)
      // Refresh user data
      const updated = await authService.me()
      setAuth(updated, token!)
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="bg-[#0A1F5C] px-6 py-10">
        <div className="max-w-2xl mx-auto">
          <h1 className="font-display text-3xl font-bold text-white">My Profile</h1>
          <p className="text-white/60 mt-1 text-sm">Manage your account details</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-6">

        {/* Avatar section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#0A1F5C] flex items-center
                            justify-center text-white font-bold font-display text-3xl
                            flex-shrink-0 shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-display font-bold text-[#0A1F5C] text-xl">
                {user.name}
              </h2>
              <p className="text-gray-400 text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-[#EBF2FF] text-[#1A56DB] text-xs font-bold
                                 px-3 py-1 rounded-full">
                  {user.role}
                </span>
                {user.isVerified && (
                  <span className="bg-green-50 text-green-700 text-xs font-bold
                                   px-3 py-1 rounded-full border border-green-200">
                    ✓ Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit form */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-display font-bold text-[#0A1F5C] text-lg mb-5">
            Personal Information
          </h3>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700
                            rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2">
              ✅ Profile updated successfully!
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700
                            rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({...f, name: e.target.value}))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:border-[#1A56DB] focus:ring-2
                           focus:ring-[#1A56DB]/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm
                           bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                placeholder="+254 7XX XXX XXX"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm
                           focus:outline-none focus:border-[#1A56DB] focus:ring-2
                           focus:ring-[#1A56DB]/20 transition-all"
              />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            className="mt-6 w-full bg-[#1A56DB] text-white py-3.5 rounded-xl
                       font-semibold hover:bg-[#0A1F5C] transition-colors
                       disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent
                                 rounded-full animate-spin"/>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>

        {/* Account info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-display font-bold text-[#0A1F5C] text-lg mb-4">
            Account Details
          </h3>
          <div className="space-y-3">
            {[
              { label: 'Member since', value: new Date(user.id.slice(0,8) || Date.now()).getFullYear() || '2024' },
              { label: 'Account type', value: user.role },
              { label: 'Verification', value: user.isVerified ? 'Verified ✓' : 'Not verified' },
            ].map(item => (
              <div key={item.label}
                className="flex justify-between items-center py-2.5
                           border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-500">{item.label}</span>
                <span className="text-sm font-semibold text-[#0A1F5C]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}