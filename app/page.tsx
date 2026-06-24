'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type FormData = { name: string; email: string; university: string; course: string; year: string; message: string }
type FormErrors = Partial<Record<keyof FormData, string>>

const yearOptions = ['Foundation', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Postgraduate', 'PhD']

function Field({
  id, label, type = 'text', placeholder, value, onChange, error, icon,
}: {
  id: string; label: string; type?: string; placeholder: string
  value: string; onChange: (v: string) => void; error?: string; icon: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, letterSpacing: '0.01em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: focused ? '#4F46E5' : error ? '#EF4444' : '#C4C9D4', display: 'flex', transition: 'color 0.15s', pointerEvents: 'none' }}>
          {icon}
        </span>
        <input
          id={id} type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', height: 40, borderRadius: 8,
            border: `1.5px solid ${error ? '#FCA5A5' : focused ? '#4F46E5' : '#E8E4F3'}`,
            background: error ? '#FFF9F9' : '#FFFFFF',
            padding: '0 12px 0 34px', fontSize: 13.5, color: '#111827', outline: 'none',
            boxSizing: 'border-box', fontFamily: 'inherit',
            boxShadow: focused ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        />
      </div>
      {error && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 3 }}>{error}</p>}
    </div>
  )
}

function SelectField({
  id, label, value, onChange, error, options, icon,
}: {
  id: string; label: string; value: string; onChange: (v: string) => void
  error?: string; options: string[]; icon: React.ReactNode
}) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, letterSpacing: '0.01em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <span style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: focused ? '#4F46E5' : error ? '#EF4444' : '#C4C9D4', display: 'flex', transition: 'color 0.15s', pointerEvents: 'none', zIndex: 1 }}>
          {icon}
        </span>
        <select
          id={id} value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{
            width: '100%', height: 40, borderRadius: 8, appearance: 'none',
            border: `1.5px solid ${error ? '#FCA5A5' : focused ? '#4F46E5' : '#E8E4F3'}`,
            background: '#FFFFFF',
            padding: '0 32px 0 34px', fontSize: 13.5, color: value ? '#111827' : '#9CA3AF',
            outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', cursor: 'pointer',
            boxShadow: focused ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        >
          <option value="" disabled>Select year</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#C4C9D4' }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
        </span>
      </div>
      {error && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 3 }}>{error}</p>}
    </div>
  )
}

const features = [
  { icon: '🔒', title: 'Fully confidential', desc: 'Your query is private and secure' },
  { icon: '⚡', title: 'AI-triaged instantly', desc: 'Routed to the right team in seconds' },
  { icon: '🛡️', title: 'Safeguarding built-in', desc: 'Crisis flags handled automatically' },
  { icon: '📋', title: 'One working day', desc: 'Average response time for all cases' },
]

const PersonIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
const MailIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
const UniIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"/><line x1="12" y1="22" x2="12" y2="15.5"/><polyline points="22 8.5 12 15.5 2 8.5"/></svg>
const BookIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
const CalIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>

export default function Home() {
  const router = useRouter()
  const [form, setForm] = useState<FormData>({ name: '', email: '', university: '', course: '', year: '', message: '' })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [msgFocused, setMsgFocused] = useState(false)
  const [btnHover, setBtnHover] = useState(false)

  function setField(f: keyof FormData, v: string) {
    setForm(p => ({ ...p, [f]: v }))
    if (errors[f]) setErrors(p => ({ ...p, [f]: undefined }))
  }

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.trim()) e.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email'
    if (!form.university.trim()) e.university = 'Required'
    if (!form.course.trim()) e.course = 'Required'
    if (!form.year) e.year = 'Please select'
    if (!form.message.trim()) e.message = 'Required'
    else if (form.message.trim().length < 10) e.message = 'At least 10 characters'
    return e
  }

  async function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({}); setSubmitError(''); setLoading(true)
    try {
      const res = await fetch('/api/triage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      const data = await res.json()
      sessionStorage.setItem('triageResult', JSON.stringify(data))
      sessionStorage.setItem('triageForm', JSON.stringify(form))
      router.push('/submitted')
    } catch {
      setLoading(false)
      setSubmitError('Something went wrong. Please try again, or email us at support@university.ac.uk')
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D0B2B 0%, #1E1B4B 60%, #2D1B69 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', width: 56, height: 56, margin: '0 auto 20px' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '3px solid transparent', borderTopColor: '#818CF8', animation: 'spin 0.8s linear infinite' }} />
            <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>⚡</div>
          </div>
          <p style={{ color: '#E0DEFF', fontSize: 17, fontWeight: 500, margin: '0 0 6px' }}>Analysing your request…</p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>Routing to the right team</p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Left branding panel ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: 420, flexShrink: 0, flexDirection: 'column', justifyContent: 'space-between',
          padding: '48px 40px',
          background: 'linear-gradient(160deg, #0D0B2B 0%, #1A1756 45%, #2D1B69 100%)',
          position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Orb decorations */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', top: '50%', right: 20, width: 1, height: '40%', transform: 'translateY(-50%)', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.06), transparent)' }} />

        {/* Top: logo + brand */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, background: 'rgba(255,255,255,0.1)', borderRadius: 14, fontSize: 26, marginBottom: 20, border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
            🎓
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Student Support Centre
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 40px', lineHeight: 1.6 }}>
            Get help with academic, financial, housing, visa, or wellbeing queries — confidentially.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {features.map(f => (
              <div key={f.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                  {f.icon}
                </div>
                <div>
                  <p style={{ fontSize: 13.5, fontWeight: 600, color: '#E0DEFF', margin: '0 0 2px' }}>{f.title}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.38)', margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: AI status + copyright */}
        <div style={{ position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '6px 12px', marginBottom: 20 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Gemini AI · Active</span>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>© 2026 University Help Centre · AI-Triage</p>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div style={{ flex: 1, background: '#F5F4FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', overflowY: 'auto', minHeight: '100vh' }}>

        {/* Mobile-only header */}
        <div className="flex lg:hidden" style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: '#EEF2FF', borderRadius: 12, fontSize: 24, marginBottom: 12, border: '1px solid #E0DDFF' }}>🎓</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1E1B4B', margin: '0 0 4px' }}>Student Support Centre</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Confidential · AI-powered · Fast response</p>
        </div>

        {/* Form card */}
        <div style={{ width: '100%', maxWidth: 480, background: '#FFFFFF', borderRadius: 20, boxShadow: '0 4px 24px rgba(79,70,229,0.1), 0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

          {/* Card top accent */}
          <div style={{ height: 4, background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 50%, #6366F1 100%)' }} />

          <div style={{ padding: '24px 28px 26px' }}>

            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: '0 0 3px', letterSpacing: '-0.01em' }}>Submit a support request</h2>
              <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: 0 }}>All fields are required. Your request is confidential.</p>
            </div>

            {submitError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B91C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <p style={{ fontSize: 12.5, color: '#B91C1C', margin: 0, lineHeight: 1.5 }}>{submitError}</p>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>

              <Field id="name" label="Full name" placeholder="e.g. Prasad Mahure" value={form.name} onChange={v => setField('name', v)} error={errors.name} icon={<PersonIcon />} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field id="email" label="Email address" type="email" placeholder="you@university.ac.uk" value={form.email} onChange={v => setField('email', v)} error={errors.email} icon={<MailIcon />} />
                <Field id="university" label="University" placeholder="e.g. Uni of Leeds" value={form.university} onChange={v => setField('university', v)} error={errors.university} icon={<UniIcon />} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <Field id="course" label="Course" placeholder="e.g. BSc Comp Sci" value={form.course} onChange={v => setField('course', v)} error={errors.course} icon={<BookIcon />} />
                <SelectField id="year" label="Year of study" value={form.year} onChange={v => setField('year', v)} error={errors.year} options={yearOptions} icon={<CalIcon />} />
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: '#F3F0FF', margin: '2px 0' }} />

              {/* Message */}
              <div>
                <label htmlFor="message" style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, letterSpacing: '0.01em' }}>
                  How can we help you?
                </label>
                <textarea
                  id="message"
                  placeholder="Describe your situation in as much detail as you're comfortable sharing…"
                  value={form.message}
                  onChange={e => setField('message', e.target.value)}
                  onFocus={() => setMsgFocused(true)}
                  onBlur={() => setMsgFocused(false)}
                  rows={4}
                  style={{
                    width: '100%', borderRadius: 8,
                    border: `1.5px solid ${errors.message ? '#FCA5A5' : msgFocused ? '#4F46E5' : '#E8E4F3'}`,
                    background: '#FFFFFF',
                    padding: '10px 12px', fontSize: 13.5, lineHeight: 1.6, color: '#111827',
                    resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                    boxShadow: msgFocused ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                />
                {errors.message && <p style={{ fontSize: 11.5, color: '#EF4444', marginTop: 3 }}>{errors.message}</p>}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                onMouseEnter={() => setBtnHover(true)}
                onMouseLeave={() => setBtnHover(false)}
                style={{
                  width: '100%', height: 46, borderRadius: 10, border: 'none',
                  background: btnHover
                    ? 'linear-gradient(135deg, #3730A3, #4338CA, #6D28D9)'
                    : 'linear-gradient(135deg, #4F46E5, #6366F1, #7C3AED)',
                  color: '#FFFFFF', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: btnHover ? '0 6px 20px rgba(79,70,229,0.5)' : '0 3px 10px rgba(79,70,229,0.3)',
                  transform: btnHover ? 'translateY(-1px)' : 'none',
                  transition: 'all 0.16s ease', fontFamily: 'inherit',
                  marginTop: 2,
                }}
              >
                Send request
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>

              {/* Trust row */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 18, paddingTop: 2 }}>
                {['🔒 Confidential', '⚡ AI-Triaged', '📅 1-day reply'].map(t => (
                  <span key={t} style={{ fontSize: 11.5, color: '#B0B7C3' }}>{t}</span>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
