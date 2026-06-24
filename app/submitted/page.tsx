'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type TriageResult = {
  caseId: string | null
  disposition: string
  urgency: string
  safeguarding: boolean
  studentReply: string | null
  clarifyQuestion: string | null
}

type TriageForm = {
  name: string; email: string; university: string
  course: string; year: string; message: string
}

/* ── Shared left branding panel ── */
const features = [
  { icon: '🔒', title: 'Fully confidential', desc: 'Your query is private and secure' },
  { icon: '⚡', title: 'AI-triaged instantly', desc: 'Routed to the right team in seconds' },
  { icon: '🛡️', title: 'Safeguarding built-in', desc: 'Crisis flags handled automatically' },
  { icon: '📋', title: 'One working day', desc: 'Average response time for all cases' },
]

function LeftPanel() {
  return (
    <div
      className="hidden lg:flex"
      style={{
        width: 420, flexShrink: 0, flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 40px',
        background: 'linear-gradient(160deg, #0D0B2B 0%, #1A1756 45%, #2D1B69 100%)',
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)' }} />
      <div style={{ position: 'absolute', bottom: -60, left: -60, width: 260, height: 260, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, background: 'rgba(255,255,255,0.1)', borderRadius: 14, fontSize: 26, marginBottom: 20, border: '1px solid rgba(255,255,255,0.15)' }}>
          🎓
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Student Support Centre
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', margin: '0 0 40px', lineHeight: 1.6 }}>
          Get help with academic, financial, housing, visa, or wellbeing queries — confidentially.
        </p>
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
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '6px 12px', marginBottom: 20 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', boxShadow: '0 0 6px #4ADE80' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}>Gemini AI · Active</span>
        </div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', margin: 0 }}>© 2026 University Help Centre · AI-Triage</p>
      </div>
    </div>
  )
}

/* ── Shared card wrapper ── */
function ResultCard({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div style={{ width: '100%', maxWidth: 480, background: '#FFFFFF', borderRadius: 20, boxShadow: '0 4px 24px rgba(79,70,229,0.1), 0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      <div style={{ height: 4, background: accent }} />
      <div style={{ padding: '24px 28px 26px' }}>
        {children}
      </div>
    </div>
  )
}

/* ── Reference pill ── */
function RefPill({ caseId }: { caseId?: string | null }) {
  return (
    <div style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#ECFDF5', color: '#065F46', fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 20 }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        Request received
      </span>
      {caseId && <span style={{ fontSize: 11, color: '#C4C9D4' }}>Ref: {caseId.slice(-8).toUpperCase()}</span>}
    </div>
  )
}

function BackLink() {
  return (
    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#9CA3AF', textDecoration: 'none', marginTop: 16 }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
      Submit another request
    </Link>
  )
}

/* ── Outcome screens ── */
function CrisisScreen({ result }: { result: TriageResult }) {
  return (
    <ResultCard accent="linear-gradient(90deg, #DC2626, #EF4444)">
      <RefPill caseId={result.caseId} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFF1F1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🆘</div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#B91C1C', margin: '0 0 2px' }}>We're here for you</h2>
          <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: 0 }}>A member of our team has been notified</p>
        </div>
      </div>
      {result.studentReply && (
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151', background: '#FFF9F9', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 14px', marginBottom: 16 }}>
          {result.studentReply}
        </p>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div style={{ background: '#DC2626', color: '#FFFFFF', borderRadius: 10, padding: '14px', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Call 999</div>
          <div style={{ fontSize: 11.5, marginTop: 3, opacity: 0.85 }}>Immediate danger</div>
        </div>
        <div style={{ border: '1.5px solid #FCA5A5', color: '#DC2626', borderRadius: 10, padding: '14px', textAlign: 'center', background: '#FFF' }}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Samaritans</div>
          <div style={{ fontSize: 11.5, marginTop: 3, color: '#9CA3AF' }}>116 123 · 24/7 free</div>
        </div>
      </div>
      <BackLink />
    </ResultCard>
  )
}

function HandleNowScreen({ result }: { result: TriageResult }) {
  return (
    <ResultCard accent="linear-gradient(90deg, #4F46E5, #7C3AED)">
      <RefPill caseId={result.caseId} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💡</div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', margin: '0 0 2px' }}>Here's what we found</h2>
          <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: 0 }}>Automatically resolved by our AI</p>
        </div>
      </div>
      {result.studentReply && (
        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#374151', background: '#F8F7FF', border: '1px solid #E8E4F3', borderRadius: 10, padding: '14px 16px', marginBottom: 14, whiteSpace: 'pre-line' }}>
          {result.studentReply}
        </p>
      )}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12.5, color: '#6B7280', textDecoration: 'none' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        This didn't fully answer my question
      </Link>
    </ResultCard>
  )
}

function ClarifyScreen({ result, form }: { result: TriageResult; form: TriageForm | null }) {
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [newResult, setNewResult] = useState<TriageResult | null>(null)
  const [focused, setFocused] = useState(false)

  async function handleSubmit() {
    if (!answer.trim() || !form) return
    setSubmitting(true); setError('')
    try {
      const combined = `${form.message}\n\nFurther information provided:\nQuestion asked: ${result.clarifyQuestion ?? 'Could you tell us more?'}\nStudent answer: ${answer.trim()}`
      const res = await fetch('/api/triage', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, message: combined }) })
      if (!res.ok) throw new Error()
      setNewResult(await res.json())
    } catch { setError('Something went wrong. Please try again.') }
    finally { setSubmitting(false) }
  }

  if (newResult) {
    if (newResult.safeguarding || newResult.urgency === 'critical') return <CrisisScreen result={newResult} />
    if (newResult.disposition === 'handle_now') return <HandleNowScreen result={newResult} />
    return <EscalateScreen result={newResult} />
  }

  return (
    <ResultCard accent="linear-gradient(90deg, #D97706, #F59E0B)">
      <RefPill caseId={result.caseId} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🔍</div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', margin: '0 0 2px' }}>One quick question</h2>
          <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: 0 }}>This helps us route you to the right team</p>
        </div>
      </div>
      <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderLeft: '3px solid #F59E0B', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
        <p style={{ fontSize: 13.5, color: '#374151', fontStyle: 'italic', margin: 0, lineHeight: 1.6 }}>
          {result.clarifyQuestion ?? 'Could you tell us a bit more about your situation?'}
        </p>
      </div>
      <textarea
        value={answer} onChange={e => setAnswer(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        placeholder="Type your answer here…" rows={3}
        style={{
          width: '100%', borderRadius: 8,
          border: `1.5px solid ${focused ? '#4F46E5' : '#E8E4F3'}`,
          background: '#FAFAFF', padding: '10px 12px', fontSize: 13.5,
          lineHeight: 1.6, color: '#111827', resize: 'none', outline: 'none',
          boxSizing: 'border-box', fontFamily: 'inherit',
          boxShadow: focused ? '0 0 0 3px rgba(79,70,229,0.1)' : 'none',
          transition: 'border-color 0.15s, box-shadow 0.15s',
          marginBottom: error ? 8 : 12,
        }}
      />
      {error && <p style={{ fontSize: 12, color: '#EF4444', marginBottom: 10 }}>{error}</p>}
      <button
        onClick={handleSubmit} disabled={!answer.trim() || submitting || !form}
        style={{
          width: '100%', height: 42, borderRadius: 9, border: 'none',
          background: !answer.trim() || submitting ? '#A5B4FC' : 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          color: '#FFFFFF', fontSize: 14, fontWeight: 600,
          cursor: !answer.trim() || submitting ? 'not-allowed' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit',
          boxShadow: !answer.trim() || submitting ? 'none' : '0 3px 10px rgba(79,70,229,0.3)',
        }}
      >
        {submitting && <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />}
        {submitting ? 'Submitting…' : 'Submit answer'}
      </button>
      <BackLink />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </ResultCard>
  )
}

function EscalateScreen({ result }: { result: TriageResult }) {
  return (
    <ResultCard accent="linear-gradient(90deg, #4F46E5, #6366F1)">
      <RefPill caseId={result.caseId} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📬</div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', margin: '0 0 2px' }}>We've received your request</h2>
          <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: 0 }}>Passed to our support team</p>
        </div>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151', marginBottom: 14 }}>
        A member of our team will be in touch — usually within one working day.
      </p>
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 8, padding: '12px 14px', marginBottom: 4 }}>
        <p style={{ fontSize: 13, color: '#1D4ED8', lineHeight: 1.6, margin: 0 }}>
          If your situation becomes urgent, the Samaritans are available 24/7 on <strong>116 123</strong>.
        </p>
      </div>
      <BackLink />
    </ResultCard>
  )
}

function SpamScreen() {
  return (
    <ResultCard accent="linear-gradient(90deg, #9CA3AF, #D1D5DB)">
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🚫</div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '0 0 2px' }}>Message not submitted</h2>
          <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: 0 }}>This message didn't pass our checks</p>
        </div>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: '#6B7280', marginBottom: 4 }}>
        If you have a genuine support request, please use the form to submit it.
      </p>
      <BackLink />
    </ResultCard>
  )
}

function GenericScreen() {
  return (
    <ResultCard accent="linear-gradient(90deg, #4F46E5, #7C3AED)">
      <RefPill caseId={null} />
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>📬</div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1E1B4B', margin: '0 0 2px' }}>Request received</h2>
          <p style={{ fontSize: 12.5, color: '#9CA3AF', margin: 0 }}>We're on it</p>
        </div>
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.7, color: '#374151', marginBottom: 4 }}>
        We have received your request. A member of our team will be in touch shortly. If you need urgent support, the Samaritans are available 24/7 on <strong>116 123</strong>.
      </p>
      <BackLink />
    </ResultCard>
  )
}

/* ── Page ── */
export default function SubmittedPage() {
  const [mounted, setMounted] = useState(false)
  const [result, setResult] = useState<TriageResult | null>(null)
  const [form, setForm] = useState<TriageForm | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('triageResult')
    if (raw) { try { setResult(JSON.parse(raw)) } catch {} sessionStorage.removeItem('triageResult') }
    const rawForm = sessionStorage.getItem('triageForm')
    if (rawForm) { try { setForm(JSON.parse(rawForm)) } catch {} sessionStorage.removeItem('triageForm') }
    setMounted(true)
  }, [])

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#F5F4FF' }} />

  function screen() {
    if (!result) return <GenericScreen />
    if (result.safeguarding || result.urgency === 'critical') return <CrisisScreen result={result} />
    if (result.disposition === 'handle_now') return <HandleNowScreen result={result} />
    if (result.disposition === 'clarify') return <ClarifyScreen result={result} form={form} />
    if (result.disposition === 'spam') return <SpamScreen />
    return <EscalateScreen result={result} />
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      <LeftPanel />

      {/* Right panel */}
      <div style={{ flex: 1, background: '#F5F4FF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 20px', overflowY: 'auto', minHeight: '100vh' }}>

        {/* Mobile header */}
        <div className="flex lg:hidden" style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, background: '#EEF2FF', borderRadius: 12, fontSize: 24, marginBottom: 12, border: '1px solid #E0DDFF' }}>🎓</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1E1B4B', margin: '0 0 4px' }}>Student Support Centre</h1>
          <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Confidential · AI-powered · Fast response</p>
        </div>

        {screen()}

      </div>
    </div>
  )
}
