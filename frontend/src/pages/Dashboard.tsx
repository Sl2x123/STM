import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Ticket, MapPin, LineChart, TrendingUp, 
  ArrowRight, Search, ChevronDown, LucideIcon
} from 'lucide-react'
import { api } from '../lib/api'

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
// 1. TOP 4 METRIC CARDS (Exact match to Reference Images 1, 2 & 3)
// =========================================================================

interface MetricCardProps {
  value: string
  label: string
  icon: LucideIcon
  percent: number
  growth: number
  iconBg?: string
  iconColor?: string
  barBg?: string
}

function MetricKpiCard({ 
  value, 
  label, 
  icon: Icon, 
  percent, 
  growth,
  iconBg = 'bg-blue-500/10',
  iconColor = 'text-blue-600 dark:text-blue-400',
  barBg = 'bg-blue-600'
}: MetricCardProps) {
  return (
    <div className="bg-white dark:bg-[#181b20] rounded-2xl p-5 shadow-[0_4px_25px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100/90 dark:border-[#262932] hover:shadow-md dark:hover:border-slate-700/60 transition-all duration-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight tabular-nums block">
            {value}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-400 font-medium mt-1 block">
            {label}
          </span>
        </div>
        <div className={`w-12 h-12 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center shrink-0`}>
          <Icon size={22} className="stroke-[2.2]" />
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 select-none">0%</span>
        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-[#232730] rounded-full overflow-hidden">
          <div 
            className={`h-full ${barBg} rounded-full transition-all duration-700 ease-out`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 tabular-nums">{percent}%</span>
        <div className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs shrink-0 ml-1">
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

function SplineWaveChart({ selectedPeriod, serverMonthlyData }: { selectedPeriod: string; serverMonthlyData?: any[] }) {
  const [periodType, setPeriodType] = useState<'monthly' | 'weekly'>('monthly')
  const [hoverIndex, setHoverIndex] = useState<number>(5) // default to Jun (index 5)

  // Monthly points matching the undulating wave geometry of the reference screenshot
  const defaultMonthlyData = [
    { month: 'Jan', fact: 15, plan: 18, factY: 125, planY: 105, x: 45 },
    { month: 'Feb', fact: 12, plan: 20, factY: 140, planY: 75, x: 120 },
    { month: 'Mar', fact: 23, plan: 11, factY: 55, planY: 145, x: 195 },
    { month: 'Apr', fact: 16, plan: 22, factY: 110, planY: 65, x: 270 },
    { month: 'May', fact: 12, plan: 10, factY: 140, planY: 155, x: 345 },
    { month: 'Jun', fact: 24, plan: 17, factY: 50, planY: 110, x: 420 },
    { month: 'Jul', fact: 21, plan: 19, factY: 70, planY: 95, x: 495 },
  ]

  const monthlyData = (serverMonthlyData && serverMonthlyData.length > 0) ? serverMonthlyData : defaultMonthlyData

  const factPoints = monthlyData.map(d => ({ x: d.x, y: d.factY }))
  const planPoints = monthlyData.map(d => ({ x: d.x, y: d.planY }))

  const factPath = getSmoothSplinePath(factPoints)
  const planPath = getSmoothSplinePath(planPoints)

  const activeData = monthlyData[hoverIndex] || monthlyData[5]

  return (
    <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100/90 dark:border-[#262932] flex flex-col justify-between relative transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Revenue</h3>
          <div className="relative">
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as any)}
              className="appearance-none bg-slate-50 dark:bg-[#20242c] border border-slate-200/90 dark:border-[#2e333e] rounded-lg pl-3 pr-7 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 focus:ring-1 focus:ring-[#0052cc]"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
            <ChevronDown size={13} className="absolute right-2 top-2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-[#2563eb] dark:text-[#3b82f6]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] dark:bg-[#3b82f6] inline-block" />
            <span>Income</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#d97706] dark:text-[#f59e0b]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] dark:bg-[#f59e0b] inline-block" />
            <span>Expenses</span>
          </div>
        </div>
      </div>

      {/* SVG Smooth Spline Chart */}
      <div className="relative w-full overflow-hidden pt-2">
        <svg viewBox="0 0 540 215" className="w-full h-auto overflow-visible">
          {/* Horizontal Axis Guides */}
          {[
            { label: '25k', y: 35 },
            { label: '20k', y: 70 },
            { label: '15k', y: 105 },
            { label: '10k', y: 140 },
            { label: '0', y: 175 }
          ].map((item, i) => (
            <g key={i}>
              <text x="32" y={item.y + 4} textAnchor="end" className="text-[10px] fill-slate-400 dark:fill-slate-500 font-sans font-medium">
                {item.label}
              </text>
            </g>
          ))}

          {/* Subtle baseline */}
          <line x1="45" y1="175" x2="495" y2="175" className="stroke-slate-100 dark:stroke-[#222630]" strokeWidth="1.5" />

          {/* Hover indicator line */}
          {activeData && (
            <line
              x1={activeData.x}
              y1="35"
              x2={activeData.x}
              y2="175"
              stroke="#2563eb"
              strokeOpacity="0.2"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
          )}

          {/* Warm Amber Spline (Expenses / Plan) */}
          <path
            d={planPath}
            fill="none"
            stroke="#d97706"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Royal Sapphire Spline (Income / Fact) */}
          <path
            d={factPath}
            fill="none"
            stroke="#2563eb"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Active Points indicators */}
          {activeData && (
            <g>
              <circle
                cx={activeData.x}
                cy={activeData.planY}
                r="5"
                fill="#d97706"
                stroke="#ffffff"
                strokeWidth="2.2"
                className="transition-all duration-200"
              />
              <circle
                cx={activeData.x}
                cy={activeData.factY}
                r="5.5"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="2.2"
                className="transition-all duration-200"
              />
            </g>
          )}

          {/* Interactive Hover Hotspots and X-Axis Labels */}
          {monthlyData.map((d, i) => (
            <g 
              key={i} 
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
            >
              <rect
                x={d.x - 30}
                y="20"
                width="60"
                height="170"
                fill="transparent"
              />
              <text
                x={d.x}
                y="200"
                textAnchor="middle"
                className={`text-[11px] font-sans font-medium transition-colors ${
                  hoverIndex === i
                    ? 'fill-[#2563eb] font-bold'
                    : 'fill-slate-400 dark:fill-slate-500'
                }`}
              >
                {d.month}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip Card */}
        <div className="absolute right-10 top-6 bg-white/95 dark:bg-[#20242c]/95 backdrop-blur-xs rounded-xl p-3.5 shadow-[0_4px_20px_rgba(0,0,0,0.08)] dark:shadow-black/40 border border-slate-100/90 dark:border-[#2e333e] text-xs min-w-[130px] pointer-events-none transition-all duration-200">
          <div className="font-bold text-slate-800 dark:text-white mb-1.5">
            {activeData.month} {selectedPeriod.includes('202') ? selectedPeriod.split(' ')[1] : '2026'}
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
            <span>Income <strong className="text-slate-900 dark:text-white font-bold">{activeData.fact}K</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#d97706]" />
            <span>Expenses <strong className="text-slate-900 dark:text-white font-bold">{activeData.plan}K</strong></span>
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
  const [activeGroup, setActiveGroup] = useState<number | null>(null)

  const weeklyGroups = [
    { label: 'Jun 4', base: 11, plan: 14.5, fact: 18 },
    { label: 'Jun 11', base: 13, plan: 21, fact: 14.5 },
    { label: 'Jun 18', base: 13, plan: 17.5, fact: 22 },
    { label: 'Jun 25', base: 15.5, plan: 17.5, fact: 20 },
  ]

  const monthlyGroups = [
    { label: 'Week 1', base: 12, plan: 16, fact: 19 },
    { label: 'Week 2', base: 14, plan: 18, fact: 15 },
    { label: 'Week 3', base: 13, plan: 20, fact: 23 },
    { label: 'Week 4', base: 16, plan: 19, fact: 21 },
  ]

  const groups = summaryMode === 'weekly' ? weeklyGroups : monthlyGroups

  const maxVal = 25
  const chartHeight = 140
  const baselineY = 175

  return (
    <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100/90 dark:border-[#262932] flex flex-col justify-between transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Booking Summary</h3>
          <div className="relative">
            <select
              value={summaryMode}
              onChange={(e) => setSummaryMode(e.target.value as any)}
              className="appearance-none bg-slate-50 dark:bg-[#20242c] border border-slate-200/90 dark:border-[#2e333e] rounded-lg pl-3 pr-7 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 outline-none cursor-pointer hover:border-slate-300 dark:hover:border-slate-600 focus:ring-1 focus:ring-[#0052cc]"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
            <ChevronDown size={13} className="absolute right-2 top-2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs font-bold">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-slate-500 inline-block" />
            <span>База</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#d97706] dark:text-[#f59e0b]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] dark:bg-[#f59e0b] inline-block" />
            <span>План</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#2563eb] dark:text-[#3b82f6]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb] dark:bg-[#3b82f6] inline-block" />
            <span>Факт</span>
          </div>
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
              <text x="32" y={item.y + 4} textAnchor="end" className="text-[10px] fill-slate-400 dark:fill-slate-500 font-sans font-medium">
                {item.label}
              </text>
            </g>
          ))}

          {/* Top reference line at 25k */}
          <line x1="45" y1="35" x2="495" y2="35" className="stroke-slate-100 dark:stroke-[#222630]" strokeWidth="1.5" />
          {/* Bottom baseline */}
          <line x1="45" y1="175" x2="495" y2="175" className="stroke-slate-100 dark:stroke-[#222630]" strokeWidth="1.5" />

          {/* Grouped 3-Bar sets */}
          {groups.map((g, idx) => {
            const slotWidth = (495 - 45) / groups.length
            const xCenter = 45 + idx * slotWidth + slotWidth / 2
            const barW = 14
            const barGap = 3.5

            const hBase = (g.base / maxVal) * chartHeight
            const hPlan = (g.plan / maxVal) * chartHeight
            const hFact = (g.fact / maxVal) * chartHeight

            const isHovered = activeGroup === idx

            return (
              <g 
                key={idx} 
                className="cursor-pointer"
                onMouseEnter={() => setActiveGroup(idx)}
                onMouseLeave={() => setActiveGroup(null)}
              >
                {/* Bar 1: Slate (Base) */}
                <rect
                  x={xCenter - barW - barGap - barW / 2}
                  y={baselineY - hBase}
                  width={barW}
                  height={hBase}
                  rx="4"
                  ry="4"
                  className="fill-[#94a3b8] dark:fill-[#475569] transition-all hover:opacity-80"
                />

                {/* Bar 2: Warm Amber (Plan) */}
                <rect
                  x={xCenter - barW / 2}
                  y={baselineY - hPlan}
                  width={barW}
                  height={hPlan}
                  rx="4"
                  ry="4"
                  className="fill-[#d97706] transition-all hover:opacity-90"
                />

                {/* Bar 3: Royal Sapphire (Fact) */}
                <rect
                  x={xCenter + barW / 2 + barGap}
                  y={baselineY - hFact}
                  width={barW}
                  height={hFact}
                  rx="4"
                  ry="4"
                  className="fill-[#2563eb] transition-all hover:opacity-90"
                />

                {/* Tooltip on hover */}
                {isHovered && (
                  <g>
                    <rect
                      x={xCenter - 65}
                      y={baselineY - Math.max(hBase, hPlan, hFact) - 34}
                      width="130"
                      height="26"
                      rx="6"
                      className="fill-slate-900/95 dark:fill-slate-800/95 shadow-sm"
                    />
                    <text
                      x={xCenter}
                      y={baselineY - Math.max(hBase, hPlan, hFact) - 17}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-white"
                    >
                      {g.fact}k факт · {g.plan}k план
                    </text>
                  </g>
                )}

                {/* X Axis Label */}
                <text
                  x={xCenter}
                  y="200"
                  textAnchor="middle"
                  className={`text-[11px] font-sans font-medium transition-colors ${
                    isHovered
                      ? 'fill-[#2563eb] font-bold'
                      : 'fill-slate-400 dark:fill-slate-500'
                  }`}
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
  const [searchTerm, setSearchTerm] = useState('')

  const allRows = [
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
      statusColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
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
      statusColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
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
      statusColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20'
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
      statusColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
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
      statusColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
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
      statusColor: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20'
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
      statusColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
    }
  ]

  const filteredRows = allRows.filter(r => 
    r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-[0_4px_25px_rgba(0,0,0,0.03)] dark:shadow-none border border-slate-100/90 dark:border-[#262932] overflow-hidden transition-colors duration-200">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Latest Booking</h3>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">Операционная сводка ключевых активностей и выполнения РНП</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Фильтр по таблице..."
              className="pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-[#20242c] border border-slate-200/90 dark:border-[#2e333e] rounded-xl text-xs text-slate-700 dark:text-slate-200 outline-none focus:border-[#0052cc]"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
          </div>

          <Link
            to="/reports"
            className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1 transition-colors shrink-0"
          >
            <span>Полный отчет</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-[#222630] text-[11px] font-bold text-slate-400 dark:text-slate-500">
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
          <tbody className="divide-y divide-slate-100/80 dark:divide-[#222630] font-sans text-xs">
            {filteredRows.map((r) => (
              <tr key={r.no} className="hover:bg-slate-50/70 dark:hover:bg-[#20242c]/60 transition-colors">
                <td className="py-3.5 px-4 text-center font-medium text-slate-500 dark:text-slate-400 tabular-nums">{r.no}</td>
                <td className="py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 tabular-nums">{r.id}</td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">{r.date}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">{r.customerName}</td>
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">{r.location}</td>
                <td className="py-3.5 px-4 text-right font-semibold text-slate-600 dark:text-slate-300 tabular-nums">{r.plan}</td>
                <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-white tabular-nums">{r.fact}</td>
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
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    let isMounted = true
    api.get('/dashboard/stats')
      .then(res => {
        if (isMounted && res.data) {
          setStats(res.data)
        }
      })
      .catch(err => {
        console.warn('Dashboard stats fallback:', err)
      })
    return () => { isMounted = false }
  }, [selectedPeriod])

  return (
    <div className="max-w-[1440px] mx-auto font-sans pb-16 space-y-6 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-400 mt-0.5">
            Сводная аналитика выполнения планов, визитов и активности
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Period selector */}
          <div className="bg-slate-100 dark:bg-[#181b20] p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 dark:border-[#262932] shadow-xs">
            {['Июнь 2026', 'Сентябрь 2026', 'Q3 2026'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-[#0052cc] text-white font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#20242c] font-medium'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards (Live from PostgreSQL Server) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricKpiCard
          value={stats ? `${stats.total_projects}` : '4'}
          label="Активных проектов в БД"
          icon={Users}
          percent={stats ? Math.min(100, stats.total_projects * 25) : 80}
          growth={15}
          iconBg="bg-blue-500/10"
          iconColor="text-blue-600 dark:text-blue-400"
          barBg="bg-blue-600"
        />
        <MetricKpiCard
          value={stats ? `$${stats.total_budget?.toLocaleString()}` : '$5,780'}
          label="Бюджет интеграций (Факт)"
          icon={Ticket}
          percent={stats ? Math.round((stats.total_spent_bloggers / (stats.total_budget || 1)) * 100) : 48}
          growth={24}
          iconBg="bg-emerald-500/10"
          iconColor="text-emerald-600 dark:text-emerald-400"
          barBg="bg-emerald-600"
        />
        <MetricKpiCard
          value={stats ? `${stats.total_bloggers + stats.total_companies}` : '12'}
          label="Блогеров и контрагентов"
          icon={MapPin}
          percent={stats ? Math.round((stats.total_bloggers / ((stats.total_bloggers + stats.total_companies) || 1)) * 100) : 50}
          growth={35}
          iconBg="bg-indigo-500/10"
          iconColor="text-indigo-600 dark:text-indigo-400"
          barBg="bg-indigo-600"
        />
        <MetricKpiCard
          value={stats ? `${stats.rnp_completion_rate}%` : '75%'}
          label="Выполнение плана РНП"
          icon={LineChart}
          percent={stats ? stats.rnp_completion_rate : 75}
          growth={stats ? stats.rnp_completion_rate : 75}
          iconBg="bg-amber-500/10"
          iconColor="text-amber-600 dark:text-amber-400"
          barBg="bg-amber-500"
        />
      </div>

      {/* 3. Middle Section: Revenue Spline Chart + Booking Summary Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SplineWaveChart selectedPeriod={selectedPeriod} serverMonthlyData={stats?.monthly_chart} />
        <GroupedThreeBarChart />
      </div>

      {/* 4. Bottom Section: Latest Booking Table */}
      <LatestBookingTable />
    </div>
  )
}
