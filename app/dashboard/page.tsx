'use client'

import { useEffect, useState, useCallback } from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'

type Case = {
  id: string
  status: string
  createdAt: string
  studentName: string
  studentEmail: string
  university: string
  course: string
  year: string
  message: string
  category: string
  urgency: string
  safeguarding: boolean
  disposition: string
  confidence: number
  reasoning: string
  injectionFlag: boolean
  studentReply: string | null
  staffSummary: string | null
  clarifyQuestion: string | null
}

type Filter = 'all' | 'critical' | 'high' | 'medium' | 'low' | 'safeguarding' | 'resolved'

const urgencyMeta: Record<string, { bg: string; color: string; dot: string; label: string }> = {
  critical: { bg: '#FFF1F1', color: '#B91C1C', dot: '#EF4444', label: 'Critical' },
  high:     { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B', label: 'High' },
  medium:   { bg: '#EFF6FF', color: '#1E40AF', dot: '#3B82F6', label: 'Medium' },
  low:      { bg: '#F9FAFB', color: '#6B7280', dot: '#9CA3AF', label: 'Low' },
}

const statusMeta: Record<string, { bg: string; color: string; label: string }> = {
  new:         { bg: '#EEF2FF', color: '#4338CA', label: 'New' },
  in_progress: { bg: '#FFFBEB', color: '#92400E', label: 'In progress' },
  resolved:    { bg: '#ECFDF5', color: '#065F46', label: 'Resolved' },
}

const categoryLabels: Record<string, string> = {
  visa_immigration: 'Visa / Immigration',
  health_wellbeing: 'Wellbeing',
  academic:         'Academic',
  financial:        'Financial',
  housing:          'Housing',
  other:            'Other',
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all',          label: 'All active' },
  { key: 'critical',     label: 'Critical' },
  { key: 'high',         label: 'High' },
  { key: 'medium',       label: 'Medium' },
  { key: 'low',          label: 'Low' },
  { key: 'safeguarding', label: 'Safeguarding' },
  { key: 'resolved',     label: 'Resolved' },
]

const avatarColors = ['#4F46E5', '#7C3AED', '#0891B2', '#059669', '#B45309', '#DC2626']

function Avatar({ name, size = 34 }: { name: string; size?: number }) {
  const initials = name.trim().split(/\s+/).map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const idx = name.charCodeAt(0) % avatarColors.length
  const c1 = avatarColors[idx]
  const c2 = avatarColors[(idx + 2) % avatarColors.length]
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `linear-gradient(135deg, ${c1}, ${c2})`, color: '#fff', fontSize: size * 0.35, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, letterSpacing: '-0.02em' }}>
      {initials}
    </div>
  )
}

function UrgencyBadge({ urgency }: { urgency: string }) {
  const m = urgencyMeta[urgency] ?? urgencyMeta.low
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: m.bg, color: m.color, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap' as const }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
      {m.label}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const m = statusMeta[status] ?? statusMeta.new
  return (
    <span style={{ background: m.bg, color: m.color, fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20, whiteSpace: 'nowrap' as const }}>
      {m.label}
    </span>
  )
}

function ShieldIcon({ size = 13, color = '#DC2626' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#9CA3AF', marginBottom: 10 }}>{children}</div>
}

function LightBox({ children }: { children: React.ReactNode }) {
  return <div style={{ background: '#F8F7FF', borderRadius: 10, padding: '14px', fontSize: 14, lineHeight: 1.75, color: '#374151', whiteSpace: 'pre-line' as const }}>{children}</div>
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function SkeletonRow() {
  return (
    <tr>
      {[28, 56, 120, 90, 80, 160, 56, 64].map((w, i) => (
        <td key={i} style={{ padding: '14px 16px' }}>
          <div className="animate-pulse" style={{ height: 14, borderRadius: 6, background: '#F3F4F6', width: w }} />
        </td>
      ))}
    </tr>
  )
}

export default function Dashboard() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<Filter>('all')
  const [selectedCase, setSelectedCase] = useState<Case | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  const fetchCases = useCallback(async () => {
    try {
      const r = await fetch('/api/cases')
      if (!r.ok) throw new Error('Failed')
      setCases(await r.json())
    } catch {
      setError('Unable to load cases — please refresh.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCases() }, [fetchCases])

  const activeCases   = cases.filter(c => c.status !== 'resolved')
  const resolvedCases = cases.filter(c => c.status === 'resolved')

  const filteredCases =
    activeFilter === 'resolved'     ? resolvedCases :
    activeFilter === 'all'          ? activeCases :
    activeFilter === 'safeguarding' ? activeCases.filter(c => c.safeguarding) :
                                      activeCases.filter(c => c.urgency === activeFilter)

  const safeguardingCount = activeCases.filter(c => c.safeguarding).length
  const pendingCount      = activeCases.filter(c => c.status === 'new').length

  async function updateStatus(caseId: string, status: string) {
    setUpdatingStatus(status)
    try {
      await fetch(`/api/cases/${caseId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      await fetchCases()
      setDrawerOpen(false)
    } finally {
      setUpdatingStatus(null)
    }
  }

  function openCase(c: Case) { setSelectedCase(c); setDrawerOpen(true) }

  const pillCount = (f: Filter) =>
    f === 'resolved'     ? resolvedCases.length :
    f === 'safeguarding' ? activeCases.filter(c => c.safeguarding).length :
                           activeCases.filter(c => c.urgency === f).length

  return (
    <div className="flex flex-col md:flex-row min-h-screen" style={{ background: '#F3F4F8' }}>

      {/* ── Mobile top bar ── */}
      <div className="flex md:hidden items-center px-4 shrink-0" style={{ background: 'linear-gradient(135deg,#1E1B4B,#2D2A72)', height: 54 }}>
        <span style={{ fontSize: 16 }}>🎓</span>
        <span style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginLeft: 10 }}>Student Support</span>
      </div>

      {/* ── Sidebar ── */}
      <div className="hidden md:flex flex-col shrink-0" style={{ width: 230, background: 'linear-gradient(175deg,#1E1B4B 0%,#26236B 100%)', minHeight: '100vh' }}>
        {/* Brand */}
        <div style={{ padding: '28px 20px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(79,70,229,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🎓</div>
            <div>
              <div style={{ color: '#fff', fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>Student Support</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginTop: 2 }}>Staff Portal</div>
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 16px' }} />

        {/* Nav */}
        <nav style={{ padding: '12px 10px', flex: 1 }}>
          {[
            { label: 'Active Cases', filter: 'all' as Filter, count: activeCases.length, icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            )},
            { label: 'Safeguarding', filter: 'safeguarding' as Filter, count: safeguardingCount, icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            )},
            { label: 'Resolved', filter: 'resolved' as Filter, count: resolvedCases.length, icon: (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            )},
          ].map(({ label, filter, count, icon }) => {
            const active = activeFilter === filter
            return (
              <div
                key={filter}
                onClick={() => setActiveFilter(filter)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                  borderRadius: 10, cursor: 'pointer', marginBottom: 2,
                  background: active ? 'rgba(255,255,255,0.13)' : 'transparent',
                  color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ opacity: active ? 1 : 0.6 }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: active ? 500 : 400, flex: 1 }}>{label}</span>
                {count > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 7px', borderRadius: 20, background: active ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)', color: active ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                    {count}
                  </span>
                )}
              </div>
            )
          })}
        </nav>

        <div style={{ margin: '0 16px', height: 1, background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E' }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Gemini AI · Active</span>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>

        {/* Page header */}
        <div style={{ background: '#fff', borderBottom: '1px solid #EDEAF8', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 17, fontWeight: 600, color: '#111827', margin: 0 }}>
              {activeFilter === 'resolved' ? 'Resolved Cases' : activeFilter === 'safeguarding' ? 'Safeguarding' : activeFilter === 'all' ? 'All Active Cases' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)} Priority`}
            </h1>
            <p style={{ fontSize: 12, color: '#9CA3AF', margin: '2px 0 0', }}>
              {loading ? 'Loading…' : `${filteredCases.length} ${filteredCases.length === 1 ? 'case' : 'cases'}`}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={fetchCases}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F5F3FF', color: '#4F46E5', border: '1px solid #DDD6FE', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
              Refresh
            </button>
            <button
              onClick={async () => {
                await fetch('/api/auth/logout', { method: 'POST' })
                window.location.href = '/login'
              }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#F9FAFB', color: '#6B7280', border: '1px solid #E5E7EB', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign out
            </button>
          </div>
        </div>

        <div style={{ padding: '20px 24px', flex: 1 }}>
          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: 'Active Cases',    value: loading ? '—' : activeCases.length,   icon: '📋', accent: '#4F46E5', accentBg: '#EEF2FF' },
              { label: 'Pending Review',  value: loading ? '—' : pendingCount,          icon: '⏳', accent: '#D97706', accentBg: '#FFFBEB' },
              { label: 'Safeguarding',    value: loading ? '—' : safeguardingCount,     icon: '🛡️', accent: '#DC2626', accentBg: '#FFF1F1', alert: !loading && safeguardingCount > 0 },
            ].map(({ label, value, icon, accent, accentBg, alert }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 14, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: `1px solid ${alert ? '#FECACA' : '#EDEAF8'}`, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: '100%', background: alert ? '#DC2626' : accent, borderRadius: '14px 0 0 14px' }} />
                <div style={{ width: 36, height: 36, borderRadius: 10, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 10 }}>
                  {icon}
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: alert ? '#DC2626' : '#111827', lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500, marginTop: 4, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', scrollbarWidth: 'none' as const }}>
            {FILTERS.map(f => {
              const isActive = activeFilter === f.key
              const cnt = f.key === 'all' ? activeCases.length : pillCount(f.key)
              const activeColor = f.key === 'resolved' ? '#065F46' : f.key === 'safeguarding' ? '#DC2626' : '#4F46E5'
              const activeBg = f.key === 'resolved' ? '#065F46' : f.key === 'safeguarding' ? '#DC2626' : '#4F46E5'
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  style={{
                    flexShrink: 0,
                    height: 34,
                    padding: '0 14px',
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    border: isActive ? 'none' : '1.5px solid #E8E4F3',
                    background: isActive ? activeBg : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#6B7280',
                    boxShadow: isActive ? `0 2px 8px ${activeColor}30` : '0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {f.label}
                  {cnt > 0 && (
                    <span style={{
                      fontSize: 11,
                      fontWeight: 700,
                      background: isActive ? 'rgba(255,255,255,0.25)' : '#F0EEFF',
                      color: isActive ? '#FFFFFF' : '#7C6FCD',
                      padding: '1px 7px',
                      borderRadius: 20,
                    }}>
                      {cnt}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(79,70,229,0.06), 0 1px 3px rgba(0,0,0,0.04)', border: '1px solid #EEEAF8', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FAFAFA' }}>
                    {['#', 'Priority', 'Student', 'Category', 'Message', 'Received', 'Status'].map(col => (
                      <th key={col} style={{ textAlign: 'left', padding: '10px 16px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: '#C4C9D4', textTransform: 'uppercase', borderBottom: '1px solid #F0F0F5', whiteSpace: 'nowrap', background: '#FDFCFF' }}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
                  ) : filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '60px 24px', textAlign: 'center' }}>
                        <div style={{ fontSize: 32, marginBottom: 12 }}>
                          {activeFilter === 'resolved' ? '✅' : activeFilter === 'safeguarding' ? '🛡️' : '🎉'}
                        </div>
                        <div style={{ fontSize: 15, fontWeight: 500, color: '#374151', marginBottom: 4 }}>
                          {activeFilter === 'resolved' ? 'No resolved cases yet' : activeFilter === 'safeguarding' ? 'No safeguarding flags' : 'All caught up!'}
                        </div>
                        <div style={{ fontSize: 13, color: '#9CA3AF' }}>
                          {activeFilter === 'all' ? 'No active cases at the moment.' : `No ${activeFilter} cases to show.`}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map((c, i) => (
                      <tr
                        key={c.id}
                        onClick={() => openCase(c)}
                        style={{
                          borderBottom: '1px solid #F4F4F8',
                          cursor: 'pointer',
                          transition: 'background 0.12s',
                          background: i % 2 !== 0 ? '#FAFAFD' : '#FFFFFF',
                          ...(c.safeguarding ? { borderLeft: '3px solid #EF4444' } : {}),
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#F0EFFF' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = i % 2 !== 0 ? '#FAFAFD' : '#FFFFFF' }}
                      >
                        <td style={{ padding: '10px 16px', width: 36 }}>
                          <span style={{ fontSize: 11, color: '#C4C9D4', fontWeight: 600 }}>{i + 1}</span>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                            <UrgencyBadge urgency={c.urgency} />
                            {c.safeguarding && <ShieldIcon size={11} />}
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ fontSize: 13, fontWeight: 500, color: '#1F2937', whiteSpace: 'nowrap' }}>
                            {c.studentName}
                            {c.injectionFlag && <span style={{ marginLeft: 6, fontSize: 10, background: '#FFFBEB', color: '#92400E', padding: '1px 6px', borderRadius: 4, fontWeight: 600 }}>⚠</span>}
                          </div>
                          <div style={{ fontSize: 11, color: '#B0B7C3', marginTop: 1 }}>{c.studentEmail}</div>
                        </td>
                        <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 12, color: '#8892A4' }}>
                            {categoryLabels[c.category] ?? c.category}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ fontSize: 13, color: '#6B7280', whiteSpace: 'nowrap' }}>
                            {c.message.length > 55 ? c.message.slice(0, 55) + '…' : c.message}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', whiteSpace: 'nowrap' }}>
                          <span style={{ fontSize: 12, color: '#B0B7C3' }}>{relativeTime(c.createdAt)}</span>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <StatusBadge status={c.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile card list */}
          <div className="block md:hidden space-y-3">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="animate-pulse" style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F3F4F6' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 13, background: '#F3F4F6', borderRadius: 6, width: '50%', marginBottom: 6 }} />
                      <div style={{ height: 11, background: '#F3F4F6', borderRadius: 6, width: '70%' }} />
                    </div>
                  </div>
                  <div style={{ height: 11, background: '#F3F4F6', borderRadius: 6, marginBottom: 4 }} />
                  <div style={{ height: 11, background: '#F3F4F6', borderRadius: 6, width: '80%' }} />
                </div>
              ))
            ) : filteredCases.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>
                  {activeFilter === 'resolved' ? '✅' : '🎉'}
                </div>
                <span style={{ fontSize: 14, color: '#9CA3AF' }}>
                  {activeFilter === 'all' ? 'No active cases.' : `No ${activeFilter} cases.`}
                </span>
              </div>
            ) : (
              filteredCases.map((c, i) => (
                <div
                  key={c.id}
                  style={{ background: '#fff', borderRadius: 14, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #EDEAF8', ...(c.safeguarding ? { borderLeft: '3px solid #EF4444' } : {}) }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 11, color: '#D1D5DB', fontWeight: 600 }}>#{i + 1}</span>
                      {c.studentName}
                      {c.safeguarding && <ShieldIcon size={12} />}
                    </span>
                    <UrgencyBadge urgency={c.urgency} />
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10 }}>{c.studentEmail}</div>
                  <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.55, marginBottom: 12 }}>
                    {c.message.length > 100 ? c.message.slice(0, 100) + '…' : c.message}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <StatusBadge status={c.status} />
                      <span style={{ fontSize: 11, color: '#9CA3AF', alignSelf: 'center' }}>{relativeTime(c.createdAt)}</span>
                    </div>
                    <button
                      onClick={() => openCase(c)}
                      style={{ background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      View →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Drawer ── */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="p-0 gap-0" style={{ width: '500px', maxWidth: '100vw', overflowY: 'auto', background: '#FAFBFF' }}>
          {selectedCase && (
            <>
              <div style={{ padding: '24px 22px 18px', background: '#fff', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <Avatar name={selectedCase.studentName} size={44} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 600, color: '#111827', marginBottom: 3 }}>{selectedCase.studentName}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.6 }}>
                      {selectedCase.studentEmail}
                    </div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>
                      {selectedCase.university} · {selectedCase.course} · {selectedCase.year}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <UrgencyBadge urgency={selectedCase.urgency} />
                  <span style={{ fontSize: 11, background: '#F9FAFB', color: '#6B7280', padding: '3px 9px', borderRadius: 20, border: '1px solid #F3F4F6', fontWeight: 500 }}>
                    {categoryLabels[selectedCase.category] ?? selectedCase.category}
                  </span>
                  {selectedCase.safeguarding && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#FFF1F1', color: '#B91C1C', fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 20 }}>
                      <ShieldIcon size={11} color="#B91C1C" /> Safeguarding
                    </span>
                  )}
                </div>
              </div>

              <div style={{ padding: '18px 22px', borderBottom: '1px solid #F3F4F6' }}>
                <SectionLabel>Original message</SectionLabel>
                <LightBox>{selectedCase.message}</LightBox>
              </div>

              <div style={{ padding: '18px 22px', borderBottom: '1px solid #F3F4F6' }}>
                <SectionLabel>AI triage result</SectionLabel>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 10 }}>
                  Confidence {selectedCase.confidence > 0 ? `${Math.round(selectedCase.confidence * 100)}%` : 'N/A'}
                </div>
                {selectedCase.confidence > 0 ? (
                  <div style={{ background: '#EEF2FF', borderLeft: '3px solid #4F46E5', padding: '12px 14px', borderRadius: '0 8px 8px 0' }}>
                    <p style={{ fontSize: 13, fontStyle: 'italic', color: '#374151', margin: 0, lineHeight: 1.7 }}>{selectedCase.reasoning}</p>
                  </div>
                ) : (
                  <div style={{ background: '#F9FAFB', borderRadius: 8, padding: '12px 14px' }}>
                    <p style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>AI triage was unavailable for this submission.</p>
                  </div>
                )}
                {selectedCase.injectionFlag && (
                  <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 8, padding: '10px 14px', marginTop: 10 }}>
                    <p style={{ fontSize: 13, color: '#92400E', margin: 0 }}>⚠ Possible prompt injection detected.</p>
                  </div>
                )}
              </div>

              {(selectedCase.studentReply || selectedCase.clarifyQuestion || selectedCase.staffSummary) && (
                <div style={{ padding: '18px 22px', borderBottom: '1px solid #F3F4F6' }}>
                  {selectedCase.disposition === 'handle_now' && selectedCase.studentReply && (
                    <><SectionLabel>Reply sent to student</SectionLabel><LightBox>{selectedCase.studentReply}</LightBox></>
                  )}
                  {selectedCase.disposition === 'clarify' && selectedCase.clarifyQuestion && (
                    <>
                      <SectionLabel>Clarification question</SectionLabel>
                      <div style={{ background: '#EEF2FF', borderLeft: '3px solid #4F46E5', padding: '12px 14px', borderRadius: '0 8px 8px 0' }}>
                        <p style={{ fontSize: 13, fontStyle: 'italic', color: '#374151', margin: 0 }}>{selectedCase.clarifyQuestion}</p>
                      </div>
                    </>
                  )}
                  {selectedCase.disposition === 'escalate' && selectedCase.staffSummary && (
                    <><SectionLabel>Staff summary</SectionLabel><LightBox>{selectedCase.staffSummary}</LightBox></>
                  )}
                </div>
              )}

              <div style={{ padding: '18px 22px' }}>
                <SectionLabel>Update status</SectionLabel>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['new', 'in_progress', 'resolved'] as const).map(s => {
                    const isActive = selectedCase.status === s
                    const isUpdating = updatingStatus === s
                    const label = s === 'in_progress' ? 'In progress' : s.charAt(0).toUpperCase() + s.slice(1)
                    const m = statusMeta[s]
                    return (
                      <button
                        key={s}
                        disabled={updatingStatus !== null}
                        onClick={() => updateStatus(selectedCase.id, s)}
                        style={{ flex: 1, height: 40, borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: updatingStatus !== null ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s', border: isActive ? 'none' : '1.5px solid #E5E7EB', background: isActive ? m.color : '#fff', color: isActive ? '#fff' : '#6B7280', opacity: updatingStatus !== null && !isUpdating ? 0.4 : 1 }}
                      >
                        {isUpdating && <div className="animate-spin" style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff', borderRadius: '50%' }} />}
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
