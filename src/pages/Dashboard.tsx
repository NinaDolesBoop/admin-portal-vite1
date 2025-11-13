import { useEffect, useMemo, useRef, useState } from 'react'
import '../css/Dashboard.css'  // Add this line

type SparkProps = {
  data: number[]
  width?: number
  height?: number
  stroke?: string
  fill?: string
  showGradient?: boolean
  animationMs?: number
}

function Sparkline({ 
  data, 
  width = 240, 
  height = 60, 
  stroke = '#8b5cf6', 
  fill = 'rgba(139,92,246,0.18)',
  showGradient = true 
  , animationMs = 3500
}: SparkProps) {
  const path = useMemo(() => {
    if (data.length === 0) return ''
    const max = Math.max(...data)
    const min = Math.min(...data)
    const dx = width / (data.length - 1 || 1)
    const scaleY = (v: number) => {
      if (max === min) return height / 2
      return height - ((v - min) / (max - min)) * height
    }
    let d = `M 0 ${scaleY(data[0]).toFixed(2)}`
    data.forEach((v, i) => {
      if (i === 0) return
      d += ` L ${Number(i * dx).toFixed(2)} ${scaleY(v).toFixed(2)}`
    })
    return d
  }, [data, height, width])

  const area = useMemo(() => {
    if (!path) return ''
    const maxX = width
    return `${path} L ${maxX} ${height} L 0 ${height} Z`
  }, [path, width, height])

  const gradientId = useMemo(() => `gradient-${Math.random().toString(36).substr(2, 9)}`, [])

  const lineRef = useRef<SVGPathElement | null>(null)
  const areaRef = useRef<SVGPathElement | null>(null)

  // Animate stroke drawing + area fade when path changes
  useEffect(() => {
    const el = lineRef.current
    const areaEl = areaRef.current
    if (!el) return
    try {
      const len = el.getTotalLength()
      // initialize stroke dash
      el.style.transition = 'none'
      el.style.strokeDasharray = String(len)
      el.style.strokeDashoffset = String(len)
      // area fade init
      if (areaEl) {
        areaEl.style.transition = 'none'
        areaEl.style.opacity = '0'
      }
      // force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.getBoundingClientRect()
      // trigger transition
      el.style.transition = `stroke-dashoffset ${animationMs}ms cubic-bezier(.22,.9,.27,1)`
      el.style.strokeDashoffset = '0'
      if (areaEl) {
        areaEl.style.transition = `opacity ${Math.round(animationMs * 0.75)}ms ease-out ${Math.round(animationMs * 0.1)}ms`
        areaEl.style.opacity = '1'
      }
    } catch (e) {
      // fallback: do nothing
    }
  }, [path, animationMs])

  return (
    <svg className="spark" width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Sparkline chart">
      {showGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.3" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0.05" />
          </linearGradient>
        </defs>
      )}
      <path ref={areaRef} d={area} fill={showGradient ? `url(#${gradientId})` : fill} style={{opacity: 1}} />
      <path 
        ref={lineRef}
        d={path} 
        fill="none" 
        stroke={stroke} 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

function useCountUp(to: number, ms = 800) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms)
      const easeOut = 1 - Math.pow(1 - p, 3)
      setVal(Math.round(to * easeOut))
      if (p < 1) requestAnimationFrame(step)
    }
    const raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [to, ms])
  return val
}

// Icon Components
const UserIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/></svg>
)

const ActivityIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
)

const TrendingIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></svg>
)

const DollarIcon = () => (
  <svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
)

const ArrowUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 19V5M5 12l7-7 7 7"/>
  </svg>
)

const ArrowDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 5v14M19 12l-7 7-7-7"/>
  </svg>
)

export default function Dashboard() {
  const [usersPeriod, setUsersPeriod] = useState('12M')
  const [volumePeriod, setVolumePeriod] = useState('12M')

  // Mock metrics with trends
  const stats = {
    totalUsers: 48210,
    usersTrend: 12.5,
    activeTraders: 12980,
    tradersTrend: 8.3,
    totalTrades: 972345,
    tradesTrend: -2.1,
    totalBalance: 12345678.45,
    balanceTrend: 15.7,
  }

  // Enhanced data sets
  const growthUsers = [120, 130, 150, 165, 170, 190, 220, 230, 240, 260, 300, 340]
  const volumeTrades = [22, 18, 25, 28, 30, 26, 35, 38, 36, 40, 44, 50]
  const balanceGrowth = volumeTrades.map((v, i) => v * (1 + i * 0.05))
  
  // Animated counts
  const totalUsers = useCountUp(stats.totalUsers, 1000)
  const activeTraders = useCountUp(stats.activeTraders, 1100)
  const totalTrades = useCountUp(stats.totalTrades, 1200)
  const totalBalance = useCountUp(Math.round(stats.totalBalance), 1300)

  // Calculate aggregate stats for charts
  
  

  // Helpers to support independent chart periods
  const periodToNum = (p: string) => (p === '6M' ? 6 : p === '12M' ? 12 : 24)

  const sliceForPeriod = (arr: number[], period: string) => {
    const n = periodToNum(period)
    if (n <= arr.length) return arr.slice(-n)
    const out: number[] = []
    while (out.length < n) out.push(...arr)
    return out.slice(-n)
  }

  // Data + aggregates per-chart (respect current independent periods)
  const usersData = sliceForPeriod(growthUsers, usersPeriod)
  const userGrowthTotalPeriod = usersData.reduce((a, b) => a + b, 0)
  const userGrowthAvgPeriod = Math.round(userGrowthTotalPeriod / usersData.length)

  const volumeData = sliceForPeriod(volumeTrades, volumePeriod)
  const tradeVolumeTotalPeriod = volumeData.reduce((a, b) => a + b, 0)
  const tradeVolumeAvgPeriod = Math.round(tradeVolumeTotalPeriod / volumeData.length)

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard Overview</h1>
        </div>
        <div className="dashboard-meta">
          <div className="live-indicator">
            <span className="live-dot"></span>
            Live Data
          </div>
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* Total Users */}
        <div className="kpi-card card variant-purple">
          <div className="kpi-content">
            <div className="kpi-header">
              <div className="kpi-icon">
                <UserIcon />
              </div>
              <div className={`kpi-trend ${stats.usersTrend > 0 ? 'up' : 'down'}`}>
                {stats.usersTrend > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {Math.abs(stats.usersTrend)}%
              </div>
            </div>
            <div className="kpi-body">
              <span className="kpi-label">Total Users</span>
              <div className="kpi-value">{totalUsers.toLocaleString()}</div>
              <div className="kpi-subtitle">
                <span>+{Math.round(stats.totalUsers * (stats.usersTrend / 100)).toLocaleString()} this month</span>
              </div>
            </div>
            <div className="kpi-footer">
              <div className="spark-wrapper">
                <Sparkline 
                  data={growthUsers} 
                  stroke="#8b5cf6" 
                  fill="rgba(139,92,246,0.2)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Traders */}
        <div className="kpi-card card variant-green">
          <div className="kpi-content">
            <div className="kpi-header">
              <div className="kpi-icon">
                <ActivityIcon />
              </div>
              <div className={`kpi-trend ${stats.tradersTrend > 0 ? 'up' : 'down'}`}>
                {stats.tradersTrend > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {Math.abs(stats.tradersTrend)}%
              </div>
            </div>
            <div className="kpi-body">
              <span className="kpi-label">Active Traders</span>
              <div className="kpi-value">{activeTraders.toLocaleString()}</div>
              <div className="kpi-subtitle">
                <span>{((activeTraders / totalUsers) * 100).toFixed(1)}% of total users</span>
              </div>
            </div>
            <div className="kpi-footer">
              <div className="spark-wrapper">
                <Sparkline 
                  data={growthUsers.map(v => v * 0.7)} 
                  stroke="#10b981" 
                  fill="rgba(16,185,129,0.2)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total Trades */}
        <div className="kpi-card card variant-blue">
          <div className="kpi-content">
            <div className="kpi-header">
              <div className="kpi-icon">
                <TrendingIcon />
              </div>
              <div className={`kpi-trend ${stats.tradesTrend > 0 ? 'up' : 'down'}`}>
                {stats.tradesTrend > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {Math.abs(stats.tradesTrend)}%
              </div>
            </div>
            <div className="kpi-body">
              <span className="kpi-label">Total Trades</span>
              <div className="kpi-value">{totalTrades.toLocaleString()}</div>
              <div className="kpi-subtitle">
                <span>~{Math.round(totalTrades / 30).toLocaleString()} per day</span>
              </div>
            </div>
            <div className="kpi-footer">
              <div className="spark-wrapper">
                <Sparkline 
                  data={volumeTrades} 
                  stroke="#60a5fa" 
                  fill="rgba(96,165,250,0.2)"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Total Balance */}
        <div className="kpi-card card variant-amber">
          <div className="kpi-content">
            <div className="kpi-header">
              <div className="kpi-icon">
                <DollarIcon />
              </div>
              <div className={`kpi-trend ${stats.balanceTrend > 0 ? 'up' : 'down'}`}>
                {stats.balanceTrend > 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
                {Math.abs(stats.balanceTrend)}%
              </div>
            </div>
            <div className="kpi-body">
              <span className="kpi-label">Total Balance</span>
              <div className="kpi-value">${(totalBalance / 1000000).toFixed(2)}M</div>
              <div className="kpi-subtitle">
                <span>+${((totalBalance * (stats.balanceTrend / 100)) / 1000).toFixed(0)}K this month</span>
              </div>
            </div>
            <div className="kpi-footer">
              <div className="spark-wrapper">
                <Sparkline 
                  data={balanceGrowth} 
                  stroke="#f59e0b" 
                  fill="rgba(245,158,11,0.2)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-grid">
        {/* User Growth Chart */}
        <div className="chart-card card">
          <div className="card-header">
            <div className="chart-header-content">
              <div className="title">User Growth Trend</div>
              <div className="chart-meta">
                <div className="chart-stat">
                  <span className="chart-stat-label">Total Growth</span>
                  <span className="chart-stat-value">{userGrowthTotalPeriod.toLocaleString()}</span>
                </div>
                <div className="chart-stat">
                  <span className="chart-stat-label">Avg per Month</span>
                  <span className="chart-stat-value">{userGrowthAvgPeriod.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="chart-controls">
              {['6M', '12M', '24M'].map(period => (
                <button
                  key={period}
                  className={`chart-btn ${usersPeriod === period ? 'active' : ''}`}
                  onClick={() => setUsersPeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-body">
            <div className="chart-container">
              <div className="chart-grid-bg"></div>
              <Sparkline 
                data={sliceForPeriod(growthUsers, usersPeriod)} 
                width={680} 
                height={220} 
                stroke="#8b5cf6"
                showGradient
              />
            </div>
          </div>
        </div>

        {/* Trade Volume Chart */}
        <div className="chart-card card">
          <div className="card-header">
            <div className="chart-header-content">
              <div className="title">Trade Volume</div>
              <div className="chart-meta">
                <div className="chart-stat">
                  <span className="chart-stat-label">Total Volume</span>
                  <span className="chart-stat-value">{tradeVolumeTotalPeriod.toLocaleString()}K</span>
                </div>
                <div className="chart-stat">
                  <span className="chart-stat-label">Avg per Month</span>
                  <span className="chart-stat-value">{tradeVolumeAvgPeriod.toLocaleString()}K</span>
                </div>
              </div>
            </div>
            <div className="chart-controls">
              {['6M', '12M', '24M'].map(period => (
                <button
                  key={period}
                  className={`chart-btn ${volumePeriod === period ? 'active' : ''}`}
                  onClick={() => setVolumePeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-body">
            <div className="chart-container">
              <div className="chart-grid-bg"></div>
              <Sparkline 
                data={sliceForPeriod(volumeTrades, volumePeriod)} 
                width={680} 
                height={220} 
                stroke="#60a5fa"
                showGradient
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}