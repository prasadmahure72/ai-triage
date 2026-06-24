'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Login failed. Please try again.')
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #2D2A72 50%, #1E1B4B 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Background decoration */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.15)' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(139,92,246,0.12)' }} />
      </div>

      <div style={{ width: '100%', maxWidth: 420, position: 'relative' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 60,
              height: 60,
              background: 'rgba(255,255,255,0.12)',
              borderRadius: 16,
              fontSize: 30,
              marginBottom: 16,
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            🎓
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#FFFFFF', margin: 0, letterSpacing: '-0.01em' }}>
            Staff Dashboard
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: '6px 0 0' }}>
            University Help Centre
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 20,
            padding: '36px 32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 600, color: '#1E1B4B', margin: '0 0 6px' }}>
            Sign in to your account
          </h2>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: '0 0 28px' }}>
            Enter your staff credentials to continue
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@university.ac.uk"
                required
                autoFocus
                style={{
                  width: '100%',
                  height: 44,
                  borderRadius: 10,
                  border: '1.5px solid #E5E7EB',
                  padding: '0 14px',
                  fontSize: 14,
                  color: '#111827',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#4F46E5' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#E5E7EB' }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%',
                    height: 44,
                    borderRadius: 10,
                    border: '1.5px solid #E5E7EB',
                    padding: '0 44px 0 14px',
                    fontSize: 14,
                    color: '#111827',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = '#4F46E5' }}
                  onBlur={e => { e.currentTarget.style.borderColor = '#E5E7EB' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9CA3AF',
                    padding: 4,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: 13,
                  color: '#B91C1C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              style={{
                width: '100%',
                height: 46,
                borderRadius: 12,
                background: loading || !email || !password
                  ? '#A5B4FC'
                  : 'linear-gradient(135deg, #4F46E5, #6366F1)',
                color: '#FFFFFF',
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'opacity 0.15s',
                boxShadow: loading || !email || !password ? 'none' : '0 4px 12px rgba(79,70,229,0.35)',
                fontFamily: 'inherit',
                marginTop: 4,
              }}
            >
              {loading && (
                <div style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              )}
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        {/* Footer hint */}
        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 20 }}>
                &copy; copyright 2026, AI-Triage
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
