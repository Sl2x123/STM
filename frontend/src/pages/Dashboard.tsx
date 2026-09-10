import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Stethoscope, Package, Eye, Building2, TrendingUp, 
  ArrowRight, Search, ChevronDown, LucideIcon
} from 'lucide-react'

// Cubic Bezier Spline calculation for mathematically continuous smooth waves
function getSmoothSplinePath(points: Array<{ x: number; y: number }>): string {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  
  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i === 0 ? points[0] : points[i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = i + 2 < points.length ? points[i + 2] : p2

    // Catmull-Rom tangent vectors converted to cubic bezier control points
    const cp1x = p1.x + (p2.x - p0.x) / 5.5
    const cp1y = p1.y + (p2.y - p0.y) / 5.5
    const cp2x = p2.x - (p3.x - p1.x) / 5.5
    const cp2y = p2.y - (p3.y - p1.y) / 5.5

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`
  }
  return path
}

// =========================================================================
// 1. TOP 4 METRIC CARDS (Exact match to Reference Images 1 & 2)
// =========================================================================

interface MetricCardProps {
  value: string
  label: string
  icon: LucideIcon
  percent: number
  growth: number
}

function MetricKpiCard({ value, label, icon: Icon, percent, growth }: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums block">
            {value}
          </span>
          <span className="text-xs text-slate-400 font-medium mt-1 block">
            {label}
          </span>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-[#0052cc] text-white flex items-center justify-center shadow-[0_4px_12px_rgba(0,82,204,0.28)] shrink-0">
          <Icon size={22} className="stroke-[2.2]" />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 select-none">0%</span>
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#0052cc] rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <span className="text-[11px] font-semibold text-slate-400 tabular-nums">{percent}%</span>
        <div className="flex items-center gap-0.5 text-emerald-500 font-bold text-xs shrink-0 ml-1">
          <TrendingUp size={12} className="stroke-[2.5]" />
          <span>+{growth}%</span>
        </div>
      </div>
    </div>
  )
}

// =========================================================================
// 2. REVENUE / EXECUTION DUAL-SPLINE CHART (Exact match to Reference "Revenue")
// =========================================================================

function SplineWaveChart({ selectedPeriod }: { selectedPeriod: string }) {
  const [periodType, setPeriodType] = useState<'monthly' | 'weekly'>('monthly')

  // Smooth undulating points matching the exact wave geometry of the reference screenshot
  const factPoints = [
    { x: 45, y: 125, val: '15k' },
    { x: 120, y: 140, val: '12k' },
    { x: 195, y: 55, val: '23k' },
    { x: 270, y: 110, val: '16k' },
    { x: 345, y: 140, val: '12k' },
    { x: 420, y: 50, val: '24k' },
    { x: 495, y: 70, val: '21k' },
  ]

  const planPoints = [
    { x: 45, y: 105, val: '18k' },
    { x: 120, y: 75, val: '20k' },
    { x: 195, y: 145, val: '11k' },
    { x: 270, y: 65, val: '22k' },
    { x: 345, y: 155, val: '10k' },
    { x: 420, y: 110, val: '17k' },
    { x: 495, y: 95, val: '19k' },
  ]

  const factPath = getSmoothSplinePath(factPoints)
  const planPath = getSmoothSplinePath(planPoints)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 flex flex-col justify-between relative">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Revenue</h3>
          <div className="relative">
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as any)}
              className="appearance-none bg-slate-50 border border-slate-200/90 rounded-lg pl-3 pr-7 py-1 text-xs font-semibold text-slate-600 outline-none cursor-pointer focus:bg-white"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
            <ChevronDown size={13} className="absolute right-2 top-2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-[#0052cc]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0052cc] inline-block" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#f59e0b]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block" />
            <span>Expenses</span>
          </div>
        </div>
      </div>

      {/* SVG Smooth Spline Chart */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg viewBox="0 0 540 215" className="w-full h-auto overflow-visible">
          <defs>
            {/* Luminous soft drop shadow for blue fact spline */}
            <filter id="blueWaveGlow" x="-20%" y="-20%" width="140%" height="160%">
              <feDropShadow dx="0" dy="7" stdDeviation="4.5" floodColor="#0052cc" floodOpacity="0.28" />
            </filter>
            {/* Luminous soft drop shadow for yellow plan spline */}
            <filter id="yellowWaveGlow" x="-20%" y="-20%" width="140%" height="160%">
              <feDropShadow dx="0" dy="7" stdDeviation="4.5" floodColor="#f59e0b" floodOpacity="0.28" />
            </filter>
          </defs>

          {/* Horizontal Axis Guides */}
          {[
            { label: '25k', y: 35 },
            { label: '20k', y: 70 },
            { label: '15k', y: 105 },
            { label: '10k', y: 140 },
            { label: '0', y: 175 }
          ].map((item, i) => (
            <g key={i}>
              <text x="32" y={item.y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-sans font-medium">
                {item.label}
              </text>
            </g>
          ))}

          {/* Subtle baseline */}
          <line x1="45" y1="175" x2="495" y2="175" stroke="#f1f5f9" strokeWidth="1.5" />

          {/* Yellow Spline (Expenses / Plan) with Glow */}
          <path
            d={planPath}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#yellowWaveGlow)"
          />

          {/* Blue Spline (Income / Fact) with Glow */}
          <path
            d={factPath}
            fill="none"
            stroke="#0052cc"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#blueWaveGlow)"
          />

          {/* X Axis Month Labels */}
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map((m, i) => (
            <text
              key={i}
              x={45 + i * 75}
              y="200"
              textAnchor="middle"
              className="text-[11px] fill-slate-400 font-sans font-medium"
            >
              {m}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip Card (Exactly matching Reference Image 1 & 2) */}
        <div className="absolute right-12 top-6 bg-white/95 backdrop-blur-xs rounded-xl p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.06)] border border-slate-100/90 text-xs min-w-[130px] pointer-events-none">
          <div className="font-bold text-slate-800 mb-1.5">{selectedPeriod || 'June 2026'}</div>
          <div className="flex items-center gap-1.5 text-slate-600 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0052cc]" />
            <span>Income <strong className="text-slate-900 font-bold">24K</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#f59e0b]" />
            <span>Expenses <strong className="text-slate-900 font-bold">17K</strong></span>
          </div>
        </div>
      </div>
    </div>
  )
}

// =========================================================================
// 3. GROUPED 3-BAR CHART (Exact match to Reference "Booking Summary")
// =========================================================================

function GroupedThreeBarChart() {
  const [summaryMode, setSummaryMode] = useState<'weekly' | 'monthly'>('weekly')

  const groups = [
    { label: 'Jun 4', base: 11, plan: 14.5, fact: 18 },
    { label: 'Jun 11', base: 13, plan: 21, fact: 14.5 },
    { label: 'Jun 18', base: 13, plan: 17.5, fact: 22 },
    { label: 'Jun 25', base: 15.5, plan: 17.5, fact: 20 },
  ]

  const maxVal = 25
  const chartHeight = 140
  const baselineY = 175

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Booking Summary</h3>
        <div className="relative">
          <select
            value={summaryMode}
            onChange={(e) => setSummaryMode(e.target.value as any)}
            className="appearance-none bg-slate-50 border border-slate-200/90 rounded-lg pl-3 pr-7 py-1 text-xs font-semibold text-slate-600 outline-none cursor-pointer focus:bg-white"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <ChevronDown size={13} className="absolute right-2 top-2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg viewBox="0 0 540 215" className="w-full h-auto overflow-visible">
          {/* Y Axis Labels */}
          {[
            { label: '25k', y: 35 },
            { label: '20k', y: 63 },
            { label: '15k', y: 91 },
            { label: '10k', y: 119 },
            { label: '0', y: 175 }
          ].map((item, i) => (
            <g key={i}>
              <text x="32" y={item.y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-sans font-medium">
                {item.label}
              </text>
            </g>
          ))}

          {/* Top reference line at 25k (in reference screenshot) */}
          <line x1="45" y1="35" x2="495" y2="35" stroke="#f1f5f9" strokeWidth="1.5" />
          {/* Bottom baseline */}
          <line x1="45" y1="175" x2="495" y2="175" stroke="#f1f5f9" strokeWidth="1.5" />

          {/* Grouped 3-Bar sets */}
          {groups.map((g, idx) => {
            const slotWidth = (495 - 45) / groups.length
            const xCenter = 45 + idx * slotWidth + slotWidth / 2
            const barW = 14
            const barGap = 3.5

            const hBase = (g.base / maxVal) * chartHeight
            const hPlan = (g.plan / maxVal) * chartHeight
            const hFact = (g.fact / maxVal) * chartHeight

            return (
              <g key={idx} className="cursor-pointer group">
                {/* Bar 1: Light Gray (Past Base) */}
                <rect
                  x={xCenter - barW - barGap - barW / 2}
                  y={baselineY - hBase}
                  width={barW}
                  height={hBase}
                  fill="#f1f5f9"
                  rx="4"
                  ry="4"
                  className="transition-all hover:opacity-80"
                />

                {/* Bar 2: Medium Slate (Plan) */}
                <rect
                  x={xCenter - barW / 2}
                  y={baselineY - hPlan}
                  width={barW}
                  height={hPlan}
                  fill="#cbd5e1"
                  rx="4"
                  ry="4"
                  className="transition-all hover:opacity-80"
                />

                {/* Bar 3: Solid Royal Blue (Fact) */}
                <rect
                  x={xCenter + barW / 2 + barGap}
                  y={baselineY - hFact}
                  width={barW}
                  height={hFact}
                  fill="#0052cc"
                  rx="4"
                  ry="4"
                  className="transition-all hover:opacity-90"
                />

                {/* X Axis Label */}
                <text
                  x={xCenter}
                  y="200"
                  textAnchor="middle"
                  className="text-[11px] fill-slate-400 font-sans font-medium"
                >
                  {g.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

// =========================================================================
// 4. LATEST ACTIVITIES TABLE (Exact match to Reference "Latest Booking")
// =========================================================================

function LatestBookingTable() {
  const rows = [
    {
      no: 1,
      id: '#34PY6',
      date: 'Jun 25th, 2026',
      customerName: 'Визит врачебный личный',
      location: 'г. Ташкент (Гринкевич С.)',
      plan: '1,120',
      fact: '956',
      percent: '85%',
      status: 'Выполнено',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      no: 2,
      id: '#48PY9',
      date: 'Jun 25th, 2026',
      customerName: 'Визит аптечный (сети 36.6)',
      location: 'г. Ташкент (Абдукабирова Д.)',
      plan: '676',
      fact: '588',
      percent: '87%',
      status: 'Выполнено',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      no: 3,
      id: '#52PY1',
      date: 'Jun 24th, 2026',
      customerName: 'Рецепты препаратов Энтеросгель',
      location: 'г. Ташкент (ЛПУ и клиники)',
      plan: '17,000',
      fact: '4,627',
      percent: '27%',
      status: 'В работе',
      statusColor: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      no: 4,
      id: '#61PY4',
      date: 'Jun 23rd, 2026',
      customerName: 'FMCG Мерчендайзинг и выкладка',
      location: 'г. Ташкент (3 района)',
      plan: '858',
      fact: '783',
      percent: '91%',
      status: 'Выполнено',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      no: 5,
      id: '#73PY8',
      date: 'Jun 22nd, 2026',
      customerName: 'Hilton Tashkent City (Материалы)',
      location: 'г. Ташкент, ул. Каримова',
      plan: '50',
      fact: '50',
      percent: '100%',
      status: 'Передано',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      no: 6,
      id: '#82PY3',
      date: 'Jun 20th, 2026',
      customerName: 'Выручка E-Commerce (Uzum/Яндекс)',
      location: 'Онлайн продажи Узбекистан',
      plan: '401M сум',
      fact: '286.1M сум',
      percent: '71%',
      status: 'В графике',
      statusColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      no: 7,
      id: '#95PY2',
      date: 'Jun 18th, 2026',
      customerName: 'Шахзода Мухаммедова (Инфлюенс)',
      location: 'Instagram Reels + Stories',
      plan: '180K охват',
      fact: '180K охват',
      percent: '100%',
      status: 'Вышел пост',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ]

  return (
    <div className="bg-white rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] border border-slate-100/90 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Latest Booking</h3>
          <p className="text-xs text-slate-400 mt-0.5">Операционная сводка ключевых активностей и выполнения РНП</p>
        </div>

        <Link
          to="/reports"
          className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 transition-colors"
        >
          <span>Открыть полный отчет РНП</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th className="py-3 px-4 w-24">Id</th>
              <th className="py-3 px-4 w-32">Date</th>
              <th className="py-3 px-4 min-w-[220px]">Customer Name</th>
              <th className="py-3 px-4 min-w-[180px]">Location</th>
              <th className="py-3 px-4 text-right">Amount (План)</th>
              <th className="py-3 px-4 text-right">Vehicle No (Факт)</th>
              <th className="py-3 px-4 text-center">Parking Name (Статус)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 font-sans text-xs">
            {rows.map((r) => (
              <tr key={r.no} className="hover:bg-slate-50/70 transition-colors">
                <td className="py-3.5 px-4 text-center font-medium text-slate-500 tabular-nums">{r.no}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-500 tabular-nums">{r.id}</td>
                <td className="py-3.5 px-4 text-slate-500 font-medium">{r.date}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{r.customerName}</td>
                <td className="py-3.5 px-4 text-slate-500 font-medium">{r.location}</td>
                <td className="py-3.5 px-4 text-right font-semibold text-slate-600 tabular-nums">{r.plan}</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 tabular-nums">{r.fact}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${r.statusColor}`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// =========================================================================
// MAIN DASHBOARD EXPORT
// =========================================================================

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Июнь 2026')

  return (
    <div className="max-w-[1440px] mx-auto font-sans pb-16 space-y-6 text-slate-800">
      {/* 1. Header Toolbar (Exact Match to Reference Top Nav) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Сводная аналитика выполнения планов, визитов и активности
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search bar matching reference */}
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-700 outline-none focus:border-[#0052cc] shadow-xs"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Period selector */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 shadow-xs">
            {['Июнь 2026', 'Сентябрь 2026', 'Q3 2026'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-[#0052cc] text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards (Exact Match to Reference Images 1 & 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricKpiCard
          value="500k"
          label="Total user (Визиты врачи & аптеки)"
          icon={Stethoscope}
          percent={55}
          growth={55}
        />
        <MetricKpiCard
          value="250"
          label="Today Booking (Рецепты Энтеросгель)"
          icon={Package}
          percent={75}
          growth={75}
        />
        <MetricKpiCard
          value="300"
          label="Available Spaces (Охват блогеров)"
          icon={Eye}
          percent={80}
          growth={80}
        />
        <MetricKpiCard
          value="350"
          label="Revenue day Ratio (Партнеры & локации)"
          icon={Building2}
          percent={75}
          growth={75}
        />
      </div>

      {/* 3. Middle Section: Revenue Spline Chart + Booking Summary Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SplineWaveChart selectedPeriod={selectedPeriod} />
        <GroupedThreeBarChart />
      </div>

      {/* 4. Bottom Section: Latest Booking Table */}
      <LatestBookingTable />
    </div>
  )
}
