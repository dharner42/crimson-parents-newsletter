import { useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        toast.success('Check your email to confirm your account!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #A51C30 0%, #6d1020 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md mx-4">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl"
               style={{ background: 'linear-gradient(135deg, #A51C30 0%, #6d1020 100%)' }}>
            🎓
          </div>
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-1">Crimson Parents</h1>
          <p className="text-sm text-gray-500 tracking-widest uppercase">Newsletter Builder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              style={{ '--tw-ring-color': '#A51C30' } as React.CSSProperties}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 mt-2"
            style={{ background: loading ? '#999' : 'linear-gradient(135deg, #A51C30 0%, #6d1020 100%)' }}
          >
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-sm text-gray-500 hover:text-gray-700 underline underline-offset-2"
          >
            {mode === 'signin' ? "Need an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Harvard Business School · Crimson Parents Club
        </p>
      </div>
    </div>
  )
}
