'use client'

import { useState, useEffect, useCallback } from 'react'
import Head from 'next/head'

/* ── NOC-style System Dashboard — Provider Health Board ──
 *
 * Colorblind-friendly: status encoded via dot shape + text label + position,
 * not color alone. High-contrast palette per spec.
 *
 * Palette:
 *   Blue   #58a6ff (info/healthy)
 *   Orange #d29922 (warning/degraded)
 *   Green  #3fb950 (operational/success)
 *   Red    #da3633 (critical/down)
 */

/* ── Provider definition ── */
const PROVIDERS = [
  { id: 'inmemory',  name: 'InMemory',   type: 'Memory' },
  { id: 'mem0',      name: 'Mem0',       type: 'Memory' },
  { id: 'honcho',    name: 'Honcho',     type: 'Memory' },
  { id: 'skills',    name: 'Skills',     type: 'Knowledge' },
  { id: 'obsidian',  name: 'Obsidian',   type: 'Knowledge' },
  { id: 'archive',   name: 'Archive',    type: 'Knowledge' },
]

const STATUS_WEIGHTS = { healthy: 3, degraded: 2, down: 1 }

/* ── Generate semi-random health data (simulates live telemetry) ── */
function generateSnapshot() {
  const totalProviders = PROVIDERS.length
  const stats = { healthy: 0, degraded: 0, down: 0 }
  let totalLatency = 0
  let totalCacheHits = 0

  const providers = PROVIDERS.map((p) => {
    const healthRoll = Math.random()
    let status
    if (healthRoll < 0.70) {
      status = 'healthy'
      stats.healthy++
    } else if (healthRoll < 0.92) {
      status = 'degraded'
      stats.degraded++
    } else {
      status = 'down'
      stats.down++
    }

    const baseLatency = status === 'healthy' ? 12
      : status === 'degraded' ? 85
      : 320
    const jitter = Math.round(Math.random() * (status === 'healthy' ? 8 : 40))
    const latency = baseLatency + jitter
    totalLatency += latency

    const cacheHit = status === 'healthy'
      ? 87 + Math.round(Math.random() * 10)
      : status === 'degraded'
        ? 60 + Math.round(Math.random() * 20)
        : 15 + Math.round(Math.random() * 20)
    totalCacheHits += cacheHit

    const searchRate = status === 'healthy'
      ? 240 + Math.round(Math.random() * 120)
      : status === 'degraded'
        ? 80 + Math.round(Math.random() * 60)
        : Math.round(Math.random() * 20)

    return {
      ...p,
      status,
      latency,
      cacheHitPct: Math.min(cacheHit, 100),
      searchRate,
      lastChecked: new Date().toLocaleTimeString(),
      uptime: status === 'healthy'
        ? `${(99.5 + Math.random() * 0.49).toFixed(1)}%`
        : status === 'degraded'
          ? `${(95 + Math.random() * 4.5).toFixed(1)}%`
          : `${(70 + Math.random() * 20).toFixed(1)}%`,
    }
  })

  const avgLatency = Math.round(totalLatency / totalProviders)
  const avgCacheHit = Math.round(totalCacheHits / totalProviders)
  const totalSearchRate = providers.reduce((s, p) => s + p.searchRate, 0)
  const healthScore = Math.round(
    ((stats.healthy * 3 + stats.degraded) / (totalProviders * 3)) * 100
  )

  return { providers, stats, avgLatency, avgCacheHit, totalSearchRate, healthScore, ts: Date.now() }
}

/* ── Sub-components ── */

function StatusDot({ status }) {
  /* Colorblind-friendly: shape + text label + position triad */
  const dotMap = {
    healthy: {
      label: 'Healthy',
      symbol: '●',        // filled circle
      color: '#3fb950',
      bg: 'rgba(63,185,80,0.12)',
    },
    degraded: {
      label: 'Degraded',
      symbol: '◆',        // diamond
      color: '#d29922',
      bg: 'rgba(210,153,34,0.12)',
    },
    down: {
      label: 'Down',
      symbol: '■',        // square
      color: '#da3633',
      bg: 'rgba(218,54,51,0.12)',
    },
  }
  const d = dotMap[status] || dotMap.down
  return (
    <span
      className="status-dot"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '2px 10px 2px 8px',
        borderRadius: 4,
        background: d.bg,
        border: `1px solid ${d.color}`,
        fontSize: 13,
        fontWeight: 600,
        color: d.color,
      }}
      aria-label={d.label}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }} aria-hidden="true">{d.symbol}</span>
      <span>{d.label}</span>
    </span>
  )
}

function SummaryCard({ label, value, unit, icon, color }) {
  return (
    <div style={{
      background: '#161b22',
      border: '1px solid #30363d',
      borderRadius: 8,
      padding: '18px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      flex: '1 1 180px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#8b949e', fontSize: 13, fontWeight: 500 }}>
        <span aria-hidden="true" style={{ fontSize: 16 }}>{icon}</span>
        <span>{label}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span style={{
          fontSize: 28,
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          color: color || '#e6edf3',
        }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 14, color: '#8b949e', fontWeight: 400 }}>{unit}</span>
        )}
      </div>
    </div>
  )
}

const TH_STYLE = {
  textAlign: 'left',
  padding: '10px 16px',
  fontSize: 12,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#8b949e',
  borderBottom: '1px solid #21262d',
  whiteSpace: 'nowrap',
}

const TD_STYLE = {
  padding: '10px 16px',
  fontSize: 14,
  borderBottom: '1px solid #21262d',
  color: '#e6edf3',
}

function LatencyBar({ latency }) {
  const pct = Math.min(latency / 400 * 100, 100)
  let barColor = '#3fb950'
  let barBg = 'rgba(63,185,80,0.15)'
  if (latency > 60) {
    barColor = '#d29922'
    barBg = 'rgba(210,153,34,0.15)'
  }
  if (latency > 200) {
    barColor = '#da3633'
    barBg = 'rgba(218,54,51,0.15)'
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{
        fontVariantNumeric: 'tabular-nums',
        minWidth: 48,
        fontWeight: 600,
        color: barColor,
      }}>
        {latency}ms
      </span>
      <div style={{
        flex: 1,
        maxWidth: 120,
        height: 6,
        borderRadius: 3,
        background: barBg,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          borderRadius: 3,
          background: barColor,
          transition: 'width 0.5s ease',
        }} />
      </div>
    </div>
  )
}

/* ── Tick animation helper ── */
function useAnimatedValue(target, duration = 600) {
  const [current, setCurrent] = useState(target)
  useEffect(() => {
    const start = performance.now()
    const from = current
    const delta = target - from
    if (Math.abs(delta) < 0.5) {
      setCurrent(target)
      return
    }
    let raf
    function tick(now) {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setCurrent(from + delta * ease)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target]) // eslint-disable-line react-hooks/exhaustive-deps
  return Math.round(current)
}

/* ── Main Dashboard Component ── */

export default function SystemDashboard() {
  const [snapshot, setSnapshot] = useState(null)
  const [tick, setTick] = useState(0)
  const [paused, setPaused] = useState(false)

  /* Generate initial data client-side only */
  useEffect(() => {
    setSnapshot(generateSnapshot())
  }, [])

  /* Auto-refresh every 30s */
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setSnapshot(generateSnapshot())
      setTick((t) => t + 1)
    }, 30000)
    return () => clearInterval(id)
  }, [paused])

  /* Manual refresh */
  const refresh = useCallback(() => {
    setSnapshot(generateSnapshot())
    setTick((t) => t + 1)
  }, [])

  if (!snapshot) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0d1117', color: '#8b949e',
        fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
      }}>
        <span>Loading dashboard…</span>
      </div>
    )
  }

  const { providers, stats, avgLatency, avgCacheHit, totalSearchRate, healthScore } = snapshot

  /* ── Countdown for next refresh ── */
  const now = new Date()
  const lastRefresh = new Date(snapshot.ts)
  const secondsSince = Math.floor((now - lastRefresh) / 1000)
  const nextRefreshIn = Math.max(30 - secondsSince, 0)

  return (
    <>
      <Head>
        <title>System Dashboard — Memory Platform Academy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      </Head>

      <div style={styles.pageWrap}>
        {/* ── Top Banner ── */}
        <div style={{
          ...styles.banner,
          borderColor: stats.down > 0 ? '#da3633' : stats.degraded > 0 ? '#d29922' : '#3fb950',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24, lineHeight: 1 }}>📡</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#e6edf3' }}>
                System Status {stats.down > 0 ? '— Degraded' : stats.degraded > 0 ? '— Degraded' : '— All Operational'}
              </div>
              <div style={{ fontSize: 13, color: '#8b949e', marginTop: 2 }}>
                Memory Platform Provider Health
                {' · '}Last refresh: {new Date(snapshot.ts).toLocaleTimeString()}
                {' · '}Next: ~{nextRefreshIn}s
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              padding: '4px 12px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              background: paused ? 'rgba(210,153,34,0.15)' : 'rgba(63,185,80,0.15)',
              color: paused ? '#d29922' : '#3fb950',
              border: `1px solid ${paused ? '#d29922' : '#3fb950'}`,
            }}>
              {paused ? 'Paused' : 'Auto-refresh 30s'}
            </div>
            <button onClick={() => setPaused((p) => !p)} style={styles.btnSmall}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
            <button onClick={refresh} style={styles.btnSmall}>
              🔄 Refresh Now
            </button>
          </div>
        </div>

        {/* ── Summary Row ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24,
        }}>
          <SummaryCard
            label="Health"
            value={`${stats.healthy}/${providers.length}`}
            unit={stats.down + stats.degraded > 0
              ? ` · ${stats.degraded} degraded, ${stats.down} down`
              : ' · all operational'
            }
            icon="🟢"
            color={stats.down > 0 ? '#da3633' : stats.degraded > 0 ? '#d29922' : '#3fb950'}
          />
          <SummaryCard
            label="Avg Latency"
            value={avgLatency}
            unit="ms"
            icon="⚡"
            color={avgLatency > 200 ? '#da3633' : avgLatency > 60 ? '#d29922' : '#3fb950'}
          />
          <SummaryCard
            label="Avg Cache Hit"
            value={avgCacheHit}
            unit="%"
            icon="💾"
            color={avgCacheHit < 60 ? '#da3633' : avgCacheHit < 80 ? '#d29922' : '#3fb950'}
          />
          <SummaryCard
            label="Search Rate"
            value={totalSearchRate}
            unit="req/s"
            icon="🔍"
            color="#58a6ff"
          />
        </div>

        {/* ── Provider Health Table ── */}
        <div style={{
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 8,
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid #21262d',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#e6edf3' }}>
              Provider Health · <span style={{ color: '#8b949e', fontWeight: 400 }}>{providers.length} total</span>
            </span>
            <span style={{ fontSize: 12, color: '#8b949e' }}>
              Tick #{tick}
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
            }}>
              <thead>
                <tr style={{ background: '#0d1117' }}>
                  <th style={TH_STYLE}>Provider</th>
                  <th style={TH_STYLE}>Type</th>
                  <th style={TH_STYLE}>Status</th>
                  <th style={TH_STYLE}>Latency</th>
                  <th style={TH_STYLE}>Cache Hit</th>
                  <th style={TH_STYLE}>Search/sec</th>
                  <th style={TH_STYLE}>Uptime</th>
                  <th style={TH_STYLE}>Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {providers.map((p) => (
                  <tr
                    key={p.id}
                    style={{
                      ...TD_STYLE,
                      background: p.status === 'down'
                        ? 'rgba(218,54,51,0.04)'
                        : p.status === 'degraded'
                          ? 'rgba(210,153,34,0.04)'
                          : 'transparent',
                      borderBottom: '1px solid #21262d',
                    }}
                  >
                    <td style={TD_STYLE}>
                      <span style={{ fontWeight: 600, color: '#e6edf3' }}>{p.name}</span>
                    </td>
                    <td style={{ ...TD_STYLE, color: '#8b949e', fontSize: 13 }}>
                      {p.type}
                    </td>
                    <td style={TD_STYLE}>
                      <StatusDot status={p.status} />
                    </td>
                    <td style={TD_STYLE}>
                      <LatencyBar latency={p.latency} />
                    </td>
                    <td style={TD_STYLE}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{
                          width: 40,
                          height: 6,
                          borderRadius: 3,
                          background: 'rgba(48,54,61,0.6)',
                          overflow: 'hidden',
                        }}>
                          <div style={{
                            width: `${p.cacheHitPct}%`,
                            height: '100%',
                            borderRadius: 3,
                            background: p.cacheHitPct > 80 ? '#3fb950'
                              : p.cacheHitPct > 50 ? '#d29922'
                              : '#da3633',
                            transition: 'width 0.5s ease',
                          }} />
                        </div>
                        <span style={{
                          fontVariantNumeric: 'tabular-nums',
                          fontSize: 13,
                          color: '#e6edf3',
                          fontWeight: 500,
                        }}>
                          {p.cacheHitPct}%
                        </span>
                      </div>
                    </td>
                    <td style={{ ...TD_STYLE, fontVariantNumeric: 'tabular-nums' }}>
                      {p.searchRate}
                    </td>
                    <td style={{ ...TD_STYLE, fontVariantNumeric: 'tabular-nums', color: p.status === 'healthy' ? '#3fb950' : p.status === 'degraded' ? '#d29922' : '#da3633' }}>
                      {p.uptime}
                    </td>
                    <td style={{ ...TD_STYLE, fontSize: 12, color: '#8b949e' }}>
                      {p.lastChecked}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Legend ── */}
        <div style={{
          marginTop: 20,
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          padding: '14px 20px',
          background: '#161b22',
          border: '1px solid #30363d',
          borderRadius: 8,
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Legend
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#3fb950', fontSize: 16 }}>●</span>
            <span style={{ color: '#e6edf3', fontSize: 13 }}>Healthy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#d29922', fontSize: 16 }}>◆</span>
            <span style={{ color: '#e6edf3', fontSize: 13 }}>Degraded</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#da3633', fontSize: 16 }}>■</span>
            <span style={{ color: '#e6edf3', fontSize: 13 }}>Down</span>
          </div>
          <span style={{ color: '#8b949e', fontSize: 12, marginLeft: 'auto' }}>
            Status encoded by symbol shape + text label + position — not color alone
          </span>
        </div>

        {/* ── Footer ── */}
        <div style={{
          marginTop: 24,
          textAlign: 'center',
          fontSize: 12,
          color: '#484f58',
          borderTop: '1px solid #21262d',
          paddingTop: 16,
        }}>
          Memory Platform Academy · System Dashboard · NOC-style Provider Health Board
        </div>
      </div>
    </>
  )
}

/* ── Styles ── */
const styles = {
  pageWrap: {
    minHeight: '100vh',
    background: '#0d1117',
    padding: '32px 24px',
    fontFamily: "'Inter','Segoe UI',system-ui,-apple-system,sans-serif",
    color: '#e6edf3',
    maxWidth: 1280,
    margin: '0 auto',
  },
  banner: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    padding: '16px 20px',
    background: '#161b22',
    border: '1px solid #30363d',
    borderLeft: '4px solid #3fb950',
    borderRadius: 8,
    marginBottom: 24,
  },
  btnSmall: {
    padding: '5px 12px',
    fontSize: 12,
    fontWeight: 600,
    background: '#21262d',
    color: '#c9d1d9',
    border: '1px solid #30363d',
    borderRadius: 6,
    cursor: 'pointer',
    lineHeight: 1.4,
  },
}
