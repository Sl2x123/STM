import React, { useState, useRef, useMemo, useEffect } from 'react'
import { 
  BarChart3, TrendingUp, Target, CheckCircle2, 
  Download, Upload, Filter, Calendar, 
  Layers, Sparkles, Activity, 
  Award, Search, Stethoscope, ShoppingBag, Briefcase, Loader2
} from 'lucide-react'
import { initialRnpData, RnpItem } from '../data/rnpData'
import { api } from '../lib/api'

// Operational Task Plan / Fact Dataset
const operationalReportData = [
  {
    id: 1,
    project: 'Extragel',
    month: 'Сентябрь 2026',
    overallProgress: 88,
    items: [
      { name: 'Аптечные визиты Ташкент', plan: 120, fact: 95, unit: 'визитов', percent: 79, status: 'In Progress' },
      { name: 'Визиты к врачам (травматологи/ортопеды)', plan: 80, fact: 80, unit: 'визитов', percent: 100, status: 'Done' },
      { name: 'Фармаконадзор и отчеты', plan: 20, fact: 14, unit: 'отчетов', percent: 70, status: 'In Progress' },
    ]
  },
  {
    id: 2,
    project: 'Masculan',
    month: 'Сентябрь 2026',
    overallProgress: 75,
    items: [
      { name: 'Аптечные визиты Самарканд + Регионы', plan: 90, fact: 90, unit: 'визитов', percent: 100, status: 'Done' },
      { name: 'Установка фирменных промостоек', plan: 15, fact: 6, unit: 'штук', percent: 40, status: 'Not Done' },
    ]
  },
  {
    id: 3,
    project: 'Энтеросгель',
    month: 'Сентябрь 2026',
    overallProgress: 92,
    items: [
      { name: 'Фармкружки по сетям 36.6', plan: 30, fact: 28, unit: 'кружков', percent: 93, status: 'Done' },
      { name: 'Мерчендайзинг витрин первой линии', plan: 50, fact: 45, unit: 'точек', percent: 90, status: 'Done' },
    ]
  }
]

// Influencer Marketing & Bloggers Dataset
const bloggersReportData = [
  {
    id: 'b1',
    project: 'Extragel',
    blogger: 'Шахзода Мухаммедова',
    handle: '@shakhzoda__mukhammedova',
    platform: 'Instagram',
    followers: '4.2M',
    reach: '180K',
    views: '148,200',
    format: 'Reels + 2 Stories',
    price: '$650',
    priceNum: 650,
    status: 'Вышел пост',
    profileVisits: 3950,
    promoSales: 318,
    er: '9.4%'
  },
  {
    id: 'b2',
    project: 'Extragel',
    blogger: 'Доктор Алимов (Health & Life)',
    handle: '@dr_alimov_health',
    platform: 'Telegram',
    followers: '120K',
    reach: '45K',
    views: '42,000',
    format: 'Экспертный пост с опросом',
    price: '$200',
    priceNum: 200,
    status: 'Оплачено',
    profileVisits: 1120,
    promoSales: 94,
    er: '7.8%'
  },
  {
    id: 'b3',
    project: 'Extragel',
    blogger: 'Мадина Мамасидикова',
    handle: '@madina_lifestyle',
    platform: 'Instagram',
    followers: '850K',
    reach: '95K',
    views: '88,500',
    format: 'Stories распаковка аптечки',
    price: '$300',
    priceNum: 300,
    status: 'Согласовано',
    profileVisits: 1840,
    promoSales: 142,
    er: '8.2%'
  },
  {
    id: 'b4',
    project: 'Extragel',
    blogger: 'Фитнес Ташкент (Артём)',
    handle: '@tashkent_fit_artem',
    platform: 'TikTok',
    followers: '320K',
    reach: '60K',
    views: '65,000',
    format: 'Динамичный ролик с тренировки',
    price: '$180',
    priceNum: 180,
    status: 'Переговоры',
    profileVisits: 980,
    promoSales: 65,
    er: '11.1%'
  },
  {
    id: 'b5',
    project: 'Masculan',
    blogger: 'Улугбек Men Style',
    handle: '@ulugbek_style',
    platform: 'Instagram',
    followers: '450K',
    reach: '75K',
    views: '71,200',
    format: 'Reels обзор трендов',
    price: '$350',
    priceNum: 350,
    status: 'Вышел пост',
    profileVisits: 2450,
    promoSales: 180,
    er: '8.9%'
  }
]

// Partner Venues & B2B Places
const companiesReportData = [
  {
    id: 'c1',
    project: 'Extragel',
    name: 'Hilton Tashkent City',
    category: 'Гостиница / Отель',
    location: 'ул. Ислама Каримова, 2',
    spent: '$850',
    itemsProvided: 'Диспенсеры в SPA и спортзал (6 шт.), 400 саше, полотенца (50 шт.)',
    contactPerson: 'Улугбек (Wellness Manager)',
    phone: '+998 71 210 88 88',
    status: 'Материалы переданы'
  },
  {
    id: 'c2',
    project: 'Extragel',
    name: 'Steam Bar & Lounge',
    category: 'Бар / Ресторан',
    location: 'ул. Тараса Шевченко, 28',
    spent: '$450',
    itemsProvided: 'Брендированные салфетницы (30 шт.), тейбл-тенты, промо-наборы',
    contactPerson: 'Рустам (Арт-директор)',
    phone: '+998 90 999 11 22',
    status: 'Активно'
  },
  {
    id: 'c3',
    project: 'Extragel',
    name: 'B-Fit Wellness Complex',
    category: 'Фитнес-клуб',
    location: 'ул. Кичик Бешагач, 104',
    spent: '$600',
    itemsProvided: 'Стенд у ринга, 250 пробников, плакаты А1 (4 шт.)',
    contactPerson: 'Сардор (Главный тренер)',
    phone: '+998 97 123 45 67',
    status: 'Согласовано'
  },
  {
    id: 'c4',
    project: 'Extragel',
    name: 'Hyatt Regency Tashkent',
    category: 'Гостиница / Отель',
    location: 'ул. Навои, 1',
    spent: '$1,100',
    itemsProvided: 'Welcome-наборы VIP (200 шт.), саше в ванные комнаты',
    contactPerson: 'Нодира (Guest Relations)',
    phone: '+998 71 207 12 34',
    status: 'Переговоры'
  }
]

// Weekly Plan vs Fact Dynamics Data for SVG Spline Charts
const weeklyDynamicsData = [
  { week: 'W1 (1-7)', plan: 22, fact: 24, label: '1-я Неделя', visitsPlan: 85, visitsFact: 92 },
  { week: 'W2 (8-14)', plan: 45, fact: 49, label: '2-я Неделя', visitsPlan: 175, visitsFact: 190 },
  { week: 'W3 (15-21)', plan: 68, fact: 71, label: '3-я Неделя', visitsPlan: 270, visitsFact: 285 },
  { week: 'W4 (22-28)', plan: 90, fact: 88, label: '4-я Неделя', visitsPlan: 360, visitsFact: 350 },
  { week: 'W5 (29-31)', plan: 100, fact: 94, label: '5-я Неделя', visitsPlan: 410, visitsFact: 385 }
]

// Team Leaderboard Dataset
const teamLeaderboard = [
  { id: 1, name: 'Наргиза Каримова', role: 'Ведущий медпредставитель', plan: 120, fact: 116, percent: 97, avatar: 'НК', badge: 'Лидер месяца' },
  { id: 2, name: 'Азамат Юсупов', role: 'Менеджер проектов & B2B', plan: 95, fact: 89, percent: 94, avatar: 'АЮ', badge: 'Отличный темп' },
  { id: 3, name: 'Тимур Исмаилов', role: 'Фармацевтический представитель', plan: 110, fact: 97, percent: 88, avatar: 'ТИ', badge: 'Стабильно' },
  { id: 4, name: 'Дилшод Алиев', role: 'Мерчендайзинг & Промо', plan: 85, fact: 68, percent: 80, avatar: 'ДА', badge: 'Требует внимания' }
]

export default function Reports() {
  const [activeReportTab, setActiveReportTab] = useState<'analytics' | 'plans' | 'bloggers' | 'companies' | 'rnp_table'>('analytics')
  const [selectedMonth, setSelectedMonth] = useState('Сентябрь 2026')
  const [selectedProject, setSelectedProject] = useState('ALL')
  const [rnpData, setRnpData] = useState<RnpItem[]>(initialRnpData)
  const [rnpSectionFilter, setRnpSectionFilter] = useState<string>('ALL')
  const [rnpSearch, setRnpSearch] = useState<string>('')
  const [selectedChartWeek, setSelectedChartWeek] = useState<number>(2) // Default to W3
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null)
  const [isLoadingRnp, setIsLoadingRnp] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch RNP items from backend PostgreSQL database
  useEffect(() => {
    let isMounted = true
    const fetchRnp = async () => {
      setIsLoadingRnp(true)
      try {
        const res = await api.get('/rnp/', { params: { month_name: selectedMonth } })
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: RnpItem[] = res.data.map((item: any) => ({
            id: String(item.id),
            section: item.section,
            sectionName: item.section_name,
            role: item.role,
            person: item.person,
            indicator: item.indicator,
            prevFact: item.prev_fact,
            prevPercent: item.prev_percent,
            planMonth: item.plan_month,
            factMonth: item.fact_month,
            percentMonth: item.percent_month,
            forecast: item.forecast,
            w1: { plan: item.w1_plan, fact: item.w1_fact },
            w2: { plan: item.w2_plan, fact: item.w2_fact },
            w3: { plan: item.w3_plan, fact: item.w3_fact },
            w4: { plan: item.w4_plan, fact: item.w4_fact },
            w5: { plan: item.w5_plan, fact: item.w5_fact }
          }))
          setRnpData(mapped)
        }
      } catch (err) {
        console.warn('Using initial RNP dataset (backend offline or loading):', err)
      } finally {
        if (isMounted) setIsLoadingRnp(false)
      }
    }
    fetchRnp()
    return () => { isMounted = false }
  }, [selectedMonth])

  // Fetch live Bloggers and Companies from PostgreSQL
  const [liveBloggers, setLiveBloggers] = useState<any[]>([])
  const [liveCompanies, setLiveCompanies] = useState<any[]>([])

  useEffect(() => {
    let isMounted = true
    api.get('/bloggers/').then(res => {
      if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
        const projectNames: Record<number, string> = { 1: 'Extragel', 2: 'Masculan', 3: 'Энтеросгель', 4: 'Фитосепт' }
        const mapped = res.data.map((b: any) => ({
          id: b.id,
          project: projectNames[b.project_id] || (b.project_id ? `Проект #${b.project_id}` : 'Extragel'),
          blogger: b.name,
          handle: b.handle,
          platform: b.platform,
          followers: b.followers,
          reach: b.reach,
          views: (b.views || 0).toLocaleString(),
          format: b.format,
          price: b.price,
          priceNum: parseInt((b.price || '0').replace(/[^\d]/g, ''), 10) || 0,
          status: b.status,
          profileVisits: b.profile_visits || 1200,
          promoSales: b.link_clicks || 85,
          er: '8.4%'
        }))
        setLiveBloggers(mapped)
      }
    }).catch(() => {})

    api.get('/companies/').then(res => {
      if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
        const projectNames: Record<number, string> = { 1: 'Extragel', 2: 'Masculan', 3: 'Энтеросгель', 4: 'Фитосепт' }
        const mapped = res.data.map((c: any) => ({
          id: c.id,
          project: projectNames[c.project_id] || (c.project_id ? `Проект #${c.project_id}` : 'Extragel'),
          name: c.name,
          category: c.category,
          location: c.location || 'Адрес не указан',
          spent: c.spent,
          itemsProvided: c.items_provided || 'Материалы не указаны',
          contactPerson: c.contact_person || '—',
          phone: c.phone || '—',
          status: c.status
        }))
        setLiveCompanies(mapped)
      }
    }).catch(() => {})

    return () => { isMounted = false }
  }, [])

  const effectiveBloggers = liveBloggers.length > 0 ? liveBloggers : bloggersReportData
  const effectiveCompanies = liveCompanies.length > 0 ? liveCompanies : companiesReportData

  // Filtered datasets based on selectedProject
  const filteredBloggers = useMemo(() => {
    if (selectedProject === 'ALL') return effectiveBloggers
    return effectiveBloggers.filter(b => b.project.toLowerCase() === selectedProject.toLowerCase())
  }, [effectiveBloggers, selectedProject])

  const filteredCompanies = useMemo(() => {
    if (selectedProject === 'ALL') return effectiveCompanies
    return effectiveCompanies.filter(c => c.project.toLowerCase() === selectedProject.toLowerCase())
  }, [effectiveCompanies, selectedProject])

  const filteredPlans = useMemo(() => {
    if (selectedProject === 'ALL') return operationalReportData
    return operationalReportData.filter(p => p.project.toLowerCase() === selectedProject.toLowerCase())
  }, [selectedProject])

  const filteredRnp = useMemo(() => {
    return rnpData.filter(item => {
      const matchSection = rnpSectionFilter === 'ALL' || item.section === rnpSectionFilter
      const indicatorText = (item.indicator || '').toLowerCase()
      const personText = (item.person || '').toLowerCase()
      const sectionText = (item.sectionName || '').toLowerCase()
      const searchTarget = rnpSearch.toLowerCase().trim()
      const matchSearch = !searchTarget || 
        indicatorText.includes(searchTarget) ||
        personText.includes(searchTarget) ||
        sectionText.includes(searchTarget)
      return matchSection && matchSearch
    })
  }, [rnpData, rnpSectionFilter, rnpSearch])

  // Aggregate high-level metrics
  const totalBloggerReach = useMemo(() => {
    return filteredBloggers.reduce((acc, b) => acc + (parseInt(b.views?.replace(/,/g, '') || '0', 10) || 50000), 0)
  }, [filteredBloggers])

  const totalBloggerSpend = useMemo(() => {
    return filteredBloggers.reduce((acc, b) => acc + (b.priceNum || 0), 0)
  }, [filteredBloggers])

  const totalPromoOrders = useMemo(() => {
    return filteredBloggers.reduce((acc, b) => acc + (b.promoSales || 0), 0)
  }, [filteredBloggers])

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['Секция', 'Роль', 'Ответственный', 'Показатель', 'План Месяц', 'Факт Месяц', '% Выполнения', 'Прогноз']
    const rows = filteredRnp.map(item => [
      `"${item.sectionName || ''}"`,
      `"${item.role || ''}"`,
      `"${item.person || ''}"`,
      `"${item.indicator || ''}"`,
      item.planMonth,
      item.factMonth,
      `${item.percentMonth}%`,
      item.forecast
    ])
    const csvContent = 'data:text/csv;charset=utf-8,﻿' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Отчет_${selectedMonth.replace(/\s/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle CSV Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string
        const lines = text.split('\n').filter(l => l.trim().length > 0)
        if (lines.length <= 1) {
          setUploadFeedback('Файл пуст или содержит только заголовок')
          return
        }
        setUploadFeedback(`Успешно загружен файл "${file.name}": обработано ${lines.length - 1} строк`)
        setTimeout(() => setUploadFeedback(null), 5000)
      } catch (err) {
        setUploadFeedback('Ошибка парсинга CSV файла')
      }
    }
    reader.readAsText(file)
  }

  // Helper for generating SVG Spline Path (Cubic Bezier curve)
  const getSplinePath = (data: typeof weeklyDynamicsData, key: 'plan' | 'fact', width: number, height: number, padding: number) => {
    const usableWidth = width - padding * 2
    const usableHeight = height - padding * 2
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * usableWidth
      const y = height - padding - (d[key] / 105) * usableHeight
      return { x, y }
    })

    if (points.length < 2) return { path: '', points }
    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const cpX1 = p0.x + (p1.x - p0.x) / 2
      const cpY1 = p0.y
      const cpX2 = p0.x + (p1.x - p0.x) / 2
      const cpY2 = p1.y
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`
    }
    return { path, points }
  }

  const svgWidth = 650
  const svgHeight = 220
  const padding = 36
  const planSpline = useMemo(() => getSplinePath(weeklyDynamicsData, 'plan', svgWidth, svgHeight, padding), [])
  const factSpline = useMemo(() => getSplinePath(weeklyDynamicsData, 'fact', svgWidth, svgHeight, padding), [])

  // Area under fact curve for gradient fill
  const factAreaPath = useMemo(() => {
    if (!factSpline || !factSpline.points || factSpline.points.length === 0) return ''
    const pts = factSpline.points
    const first = pts[0]
    const last = pts[pts.length - 1]
    const bottomY = svgHeight - padding
    return `${factSpline.path} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`
  }, [factSpline])

  const activeWeekInfo = weeklyDynamicsData[selectedChartWeek] || weeklyDynamicsData[2]

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hidden file input for CSV */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".csv" 
        className="hidden" 
      />

      {/* Header with Title & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#1e2128] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                  Отчёты и Аналитика
                </h1>
                {isLoadingRnp && (
                  <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Наглядная динамика выполнения планов, спринтов, визитов и маркетинга
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Selector */}
          <div className="flex items-center bg-gray-100 dark:bg-[#15171c] rounded-xl p-1 border border-gray-200 dark:border-[#2b303c]">
            <Calendar className="w-4 h-4 ml-2 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-200 px-2 py-1.5 focus:outline-hidden cursor-pointer"
            >
              <option value="Сентябрь 2026" className="dark:bg-[#1e2128]">Сентябрь 2026</option>
              <option value="Август 2026" className="dark:bg-[#1e2128]">Август 2026</option>
              <option value="Июнь 2026" className="dark:bg-[#1e2128]">Июнь 2026</option>
            </select>
          </div>

          {/* Project Selector */}
          <div className="flex items-center bg-gray-100 dark:bg-[#15171c] rounded-xl p-1 border border-gray-200 dark:border-[#2b303c]">
            <Filter className="w-4 h-4 ml-2 text-gray-400" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-200 px-2 py-1.5 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL" className="dark:bg-[#1e2128]">Все проекты</option>
              <option value="Extragel" className="dark:bg-[#1e2128]">Extragel</option>
              <option value="Masculan" className="dark:bg-[#1e2128]">Masculan</option>
              <option value="Энтеросгель" className="dark:bg-[#1e2128]">Энтеросгель</option>
            </select>
          </div>

          {/* Excel Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-medium transition shadow-xs cursor-pointer"
            title="Экспорт в Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Экспорт .CSV</span>
          </button>

          {/* Import CSV Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-[#2b303c] dark:hover:bg-[#343a49] text-gray-700 dark:text-gray-200 rounded-xl text-xs font-medium transition cursor-pointer"
            title="Импорт отчёта"
          >
            <Upload className="w-3.5 h-3.5 text-gray-400" />
            <span>Загрузить</span>
          </button>
        </div>
      </div>

      {/* Upload Feedback Toast */}
      {uploadFeedback && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>{uploadFeedback}</span>
        </div>
      )}

      {/* Primary Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#2b303c] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveReportTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shrink-0 cursor-pointer ${
            activeReportTab === 'analytics'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252830]'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Сводная аналитика (Графики)</span>
        </button>

        <button
          onClick={() => setActiveReportTab('plans')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shrink-0 cursor-pointer ${
            activeReportTab === 'plans'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252830]'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>План / Факт спринтов</span>
        </button>

        <button
          onClick={() => setActiveReportTab('bloggers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shrink-0 cursor-pointer ${
            activeReportTab === 'bloggers'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252830]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Маркетинг & Блогеры ({filteredBloggers.length})</span>
        </button>

        <button
          onClick={() => setActiveReportTab('companies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shrink-0 cursor-pointer ${
            activeReportTab === 'companies'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252830]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Партнёры и B2B ({filteredCompanies.length})</span>
        </button>

        <button
          onClick={() => setActiveReportTab('rnp_table')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition shrink-0 cursor-pointer ${
            activeReportTab === 'rnp_table'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252830]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Сводная таблица РНП</span>
        </button>
      </div>

      {/* TAB 1: VISUAL ANALYTICS & INTERACTIVE CHARTS */}
      {activeReportTab === 'analytics' && (
        <div className="space-y-6 animate-fade-in">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Overall Plan Completion */}
            <div className="bg-white dark:bg-[#1e2128] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-medium">Общий план месяца</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +12.4%
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">88.4%</span>
                <span className="text-xs text-gray-400 font-normal">из 100% цели</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-gray-100 dark:bg-[#2b303c] h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '88.4%' }} />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Опережение целевого графика на 3 дня
              </p>
            </div>

            {/* KPI 2: Field Visits (Doctors & Pharmacies) */}
            <div className="bg-white dark:bg-[#1e2128] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-medium">Визиты (Врачи & Аптеки)</span>
                <span className="p-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                  <Stethoscope className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">385</span>
                <span className="text-xs text-gray-400 font-normal">/ 410 план</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-[#2b303c] h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '93.9%' }} />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                93.9% выполнения полевого плана визитов
              </p>
            </div>

            {/* KPI 3: Marketing & Influencer Reach */}
            <div className="bg-white dark:bg-[#1e2128] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-medium">Охват блогосферы</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-semibold text-[11px]">
                  {filteredBloggers.length} блогеров
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {(totalBloggerReach / 1000).toFixed(0)}K
                </span>
                <span className="text-xs text-gray-400 font-normal">просмотров</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-[#2b303c] h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: '91%' }} />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                {totalPromoOrders} прямых заказов по промокодам
              </p>
            </div>

            {/* KPI 4: Sprints & Task Completion */}
            <div className="bg-white dark:bg-[#1e2128] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-orange-400" />
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                <span className="font-medium">Спринты и Задачи</span>
                <span className="p-1 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
                  <Activity className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">42</span>
                <span className="text-xs text-gray-400 font-normal">/ 48 задач</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-[#2b303c] h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '87.5%' }} />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                87.5% задач закрыто вовремя
              </p>
            </div>
          </div>

          {/* MAIN CHART: Performance Dynamics (Plan vs Fact Spline) */}
          <div className="bg-white dark:bg-[#1e2128] p-6 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Динамика выполнения плана по неделям</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-medium">
                    Интерактивный график
                  </span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Сравнение запланированного темпа и фактического результата по 5 неделям месяца
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Факт (Выполнено)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-0.5 border-t-2 border-dashed border-indigo-400" />
                  <span className="text-gray-500 dark:text-gray-400">План (Цель)</span>
                </div>
              </div>
            </div>

            {/* SVG Spline Chart */}
            <div className="relative w-full overflow-x-auto">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-56 sm:h-64 select-none"
              >
                <defs>
                  {/* Gradient for fact area */}
                  <linearGradient id="factGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                  {/* Subtle vertical glow */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#10b981" floodOpacity="0.3" />
                  </filter>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = svgHeight - padding - (val / 105) * (svgHeight - padding * 2)
                  return (
                    <g key={val}>
                      <line 
                        x1={padding} 
                        y1={y} 
                        x2={svgWidth - padding} 
                        y2={y} 
                        stroke="#e5e7eb" 
                        className="dark:stroke-[#2b303c]" 
                        strokeDasharray="4 4" 
                      />
                      <text 
                        x={padding - 8} 
                        y={y + 3} 
                        textAnchor="end" 
                        className="text-[10px] fill-gray-400 dark:fill-gray-500 font-mono"
                      >
                        {val}%
                      </text>
                    </g>
                  )
                })}

                {/* Shaded Area under Fact */}
                {factAreaPath && (
                  <path d={factAreaPath} fill="url(#factGradient)" />
                )}

                {/* Plan Curve (Dashed line) */}
                {planSpline && planSpline.path && (
                  <path 
                    d={planSpline.path} 
                    fill="none" 
                    stroke="#818cf8" 
                    strokeWidth="2.5" 
                    strokeDasharray="6 6" 
                  />
                )}

                {/* Fact Curve (Solid line with glow) */}
                {factSpline && factSpline.path && (
                  <path 
                    d={factSpline.path} 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                    filter="url(#glow)"
                  />
                )}

                {/* Data Points on Fact Curve */}
                {factSpline && factSpline.points && factSpline.points.map((pt, idx) => {
                  const isSelected = selectedChartWeek === idx
                  const d = weeklyDynamicsData[idx]
                  return (
                    <g 
                      key={idx} 
                      className="cursor-pointer transition transform"
                      onClick={() => setSelectedChartWeek(idx)}
                    >
                      {/* Active indicator circle ring */}
                      {isSelected && (
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r="9" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="2" 
                          strokeOpacity="0.4"
                        />
                      )}
                      {/* Background circle */}
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r={isSelected ? 6 : 4.5} 
                        className="fill-white dark:fill-[#1e2128]" 
                        stroke="#10b981" 
                        strokeWidth={isSelected ? 3 : 2} 
                      />

                      {/* X-axis labels */}
                      <text 
                        x={pt.x} 
                        y={svgHeight - 10} 
                        textAnchor="middle" 
                        className={`text-[11px] ${
                          isSelected 
                            ? 'font-bold fill-indigo-600 dark:fill-indigo-400' 
                            : 'fill-gray-500 dark:fill-gray-400'
                        }`}
                      >
                        {d.week}
                      </text>

                      {/* Point value badge */}
                      <text 
                        x={pt.x} 
                        y={pt.y - 10} 
                        textAnchor="middle" 
                        className={`text-[10px] font-bold ${
                          isSelected 
                            ? 'fill-emerald-600 dark:fill-emerald-400' 
                            : 'fill-gray-600 dark:fill-gray-400'
                        }`}
                      >
                        {d.fact}%
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Interactive Selected Week Detail Strip */}
            <div className="mt-4 p-3.5 bg-gray-50 dark:bg-[#15171c] rounded-xl border border-gray-200 dark:border-[#2b303c] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  W{selectedChartWeek + 1}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 dark:text-white">
                    Детализация: {activeWeekInfo.label} ({activeWeekInfo.week})
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Нажмите на любую точку графика для просмотра данных недели
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="bg-white dark:bg-[#1e2128] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#2b303c]">
                  <span className="text-gray-400 text-[10px] block">План недели:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{activeWeekInfo.plan}%</span>
                </div>

                <div className="bg-white dark:bg-[#1e2128] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#2b303c]">
                  <span className="text-gray-400 text-[10px] block">Факт недели:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{activeWeekInfo.fact}%</span>
                </div>

                <div className="bg-white dark:bg-[#1e2128] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-[#2b303c]">
                  <span className="text-gray-400 text-[10px] block">Полевые визиты:</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">
                    {activeWeekInfo.visitsFact} / {activeWeekInfo.visitsPlan}
                  </span>
                </div>

                <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  activeWeekInfo.fact >= activeWeekInfo.plan
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                }`}>
                  {activeWeekInfo.fact >= activeWeekInfo.plan ? 'План перевыполнен' : 'Небольшое отставание'}
                </div>
              </div>
            </div>
          </div>

          {/* TWO COLUMN GRID: Categories Breakdown & Team Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Category Breakdown */}
            <div className="bg-white dark:bg-[#1e2128] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-500" />
                  <span>Выполнение по направлениям бизнеса</span>
                </h3>
                <span className="text-[11px] text-gray-400">Цель: 100%</span>
              </div>

              <div className="space-y-4">
                {/* Item 1 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                      Визиты к врачам и рецептурный охват
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">92%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#2b303c] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>План: 100 визитов</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Факт: 92 визита</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                      Аптечные сети (Ташкент + Регионы)
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">88%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#2b303c] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>План: 210 аптек</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Факт: 185 аптек</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                      Инфлюенс-маркетинг & Соцсети
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">95%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#2b303c] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '95%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>План: 400K просмотров</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">Факт: 415K просмотров</span>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-amber-500" />
                      Партнерские отели, SPA и заведения (B2B)
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">78%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-[#2b303c] h-2.5 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>План: 10 локаций</span>
                    <span className="text-amber-600 dark:text-amber-400 font-medium">Факт: 8 локаций</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Team Leaderboard */}
            <div className="bg-white dark:bg-[#1e2128] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Рейтинг эффективности команды</span>
                </h3>
                <span className="text-[11px] text-gray-400">Показатель выполнения KPI</span>
              </div>

              <div className="space-y-3">
                {teamLeaderboard.map((member, index) => (
                  <div 
                    key={member.id}
                    className="p-3 bg-gray-50 dark:bg-[#15171c] rounded-xl border border-gray-200/70 dark:border-[#2b303c] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank badge */}
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 
                          ? 'bg-amber-400 text-black' 
                          : index === 1 
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white' 
                          : 'bg-gray-200 dark:bg-[#252830] text-gray-600 dark:text-gray-400'
                      }`}>
                        {index + 1}
                      </span>

                      {/* Avatar initials */}
                      <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                        {member.avatar}
                      </div>

                      <div>
                        <div className="text-xs font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                          <span>{member.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                            member.percent >= 95 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                              : member.percent >= 85
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                          }`}>
                            {member.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">{member.role}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-900 dark:text-white">
                        {member.percent}%
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {member.fact}/{member.plan} план
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Executive Insights / Quick Takeaways */}
          <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 dark:from-[#1b202c] dark:to-[#171c26] rounded-2xl border border-indigo-100 dark:border-[#2b354a]">
            <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Ключевые выводы аналитики за {selectedMonth}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-2 bg-white/70 dark:bg-[#1e2128]/60 p-2.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Визиты к врачам:</strong> Ташкент закрывает цель на 100%, ортопеды и травматологи обеспечили стабильный поток назначений.
                </span>
              </div>
              <div className="flex items-start gap-2 bg-white/70 dark:bg-[#1e2128]/60 p-2.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Инфлюенсеры:</strong> Пост Шахзоды Мухаммедовой дал максимальную отдачу: 318 прямых заказов при бюджете $650.
                </span>
              </div>
              <div className="flex items-start gap-2 bg-white/70 dark:bg-[#1e2128]/60 p-2.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Фокус внимания:</strong> По проекту Masculan необходимо ускорить установку промостоек в регионах (сейчас 40% плана).
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPRINTS & OPERATIONAL PLANS */}
      {activeReportTab === 'plans' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1e2128] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              План / Факт спринтов по проектам
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Текущий статус выполнения операционных задач и спринтов команды
            </p>

            <div className="space-y-6">
              {filteredPlans.map(proj => (
                <div 
                  key={proj.id} 
                  className="p-4 bg-gray-50 dark:bg-[#15171c] rounded-2xl border border-gray-200 dark:border-[#2b303c]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-indigo-600" />
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        {proj.project}
                      </h3>
                      <span className="text-xs text-gray-400">({proj.month})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                        Выполнение: {proj.overallProgress}%
                      </span>
                      <div className="w-24 bg-gray-200 dark:bg-[#2b303c] h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-full rounded-full" 
                          style={{ width: `${proj.overallProgress}%` }} 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    {proj.items.map((it, idx) => (
                      <div 
                        key={idx} 
                        className="bg-white dark:bg-[#1e2128] p-3.5 rounded-xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${
                              it.status === 'Done'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : it.status === 'In Progress'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300'
                            }`}>
                              {it.status === 'Done' ? 'Выполнено' : it.status === 'In Progress' ? 'В процессе' : 'Отставание'}
                            </span>
                            <span className="font-bold text-xs text-gray-900 dark:text-white">
                              {it.percent}%
                            </span>
                          </div>
                          <h4 className="text-xs font-medium text-gray-800 dark:text-gray-200">
                            {it.name}
                          </h4>
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-100 dark:border-[#2b303c] flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                          <span>План: {it.plan} {it.unit}</span>
                          <span className="font-semibold text-gray-700 dark:text-gray-300">
                            Факт: {it.fact} {it.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MARKETING & BLOGGERS */}
      {activeReportTab === 'bloggers' && (
        <div className="space-y-4 animate-fade-in">
          {/* Summary KPIs for Marketing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1e2128] p-4 rounded-xl border border-gray-200/80 dark:border-[#2b303c]">
              <span className="text-xs text-gray-400 block mb-1">Общий бюджет блогеров</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">${totalBloggerSpend.toLocaleString()}</span>
            </div>
            <div className="bg-white dark:bg-[#1e2128] p-4 rounded-xl border border-gray-200/80 dark:border-[#2b303c]">
              <span className="text-xs text-gray-400 block mb-1">Суммарный охват</span>
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">455K чел</span>
            </div>
            <div className="bg-white dark:bg-[#1e2128] p-4 rounded-xl border border-gray-200/80 dark:border-[#2b303c]">
              <span className="text-xs text-gray-400 block mb-1">Суммарные просмотры</span>
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{(totalBloggerReach / 1000).toFixed(0)}K</span>
            </div>
            <div className="bg-white dark:bg-[#1e2128] p-4 rounded-xl border border-gray-200/80 dark:border-[#2b303c]">
              <span className="text-xs text-gray-400 block mb-1">Заказов по промокодам</span>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{totalPromoOrders}</span>
            </div>
          </div>

          {/* Bloggers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBloggers.map(b => (
              <div 
                key={b.id} 
                className="bg-white dark:bg-[#1e2128] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        {b.project} • {b.platform}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                        {b.blogger}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                        {b.handle}
                      </p>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                      b.status === 'Вышел пост'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : b.status === 'Оплачено'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-[#15171c] p-2 rounded-lg mb-3">
                    {b.format}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-gray-100 dark:border-[#2b303c]">
                    <div>
                      <span className="text-[10px] text-gray-400 block">Аудитория</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">{b.followers}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Просмотры</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{b.views}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 block">Заказы</span>
                      <span className="font-bold text-purple-600 dark:text-purple-400">{b.promoSales}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Стоимость: <strong className="text-gray-900 dark:text-white font-bold">{b.price}</strong></span>
                  <span>ER: <strong className="text-indigo-600 dark:text-indigo-400">{b.er}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PARTNERS & VENUES */}
      {activeReportTab === 'companies' && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white dark:bg-[#1e2128] p-5 rounded-2xl border border-gray-200/80 dark:border-[#2b303c] shadow-xs">
            <h2 className="text-base font-bold text-gray-900 dark:text-white mb-1">
              Партнёрские заведения, Отели и B2B локации
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-5">
              Спецпроекты, дистрибуция брендированных материалов и тейбл-тентов
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCompanies.map(c => (
                <div 
                  key={c.id} 
                  className="bg-gray-50 dark:bg-[#15171c] p-4 rounded-xl border border-gray-200 dark:border-[#2b303c] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                          {c.project} • {c.category}
                        </span>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">
                          {c.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{c.location}</p>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 shrink-0">
                        {c.status}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-[#1e2128] p-2.5 rounded-lg border border-gray-200/60 dark:border-[#2b303c] my-2">
                      <span className="text-gray-400 text-[10px] block mb-0.5">Предоставленные материалы:</span>
                      {c.itemsProvided}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200/60 dark:border-[#2b303c] flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Контакт: <strong className="text-gray-700 dark:text-gray-300">{c.contactPerson}</strong> ({c.phone})</span>
                    <span>Бюджет: <strong className="text-gray-900 dark:text-white font-bold">{c.spent}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMPACT RNP TABLE */}
      {activeReportTab === 'rnp_table' && (
        <div className="space-y-4 animate-fade-in">
          {/* RNP Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#1e2128] p-4 rounded-2xl border border-gray-200/80 dark:border-[#2b303c]">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Поиск по показателю, роли или имени..."
                value={rnpSearch}
                onChange={(e) => setRnpSearch(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#15171c] border border-gray-200 dark:border-[#2b303c] rounded-xl px-3 py-1.5 text-xs text-gray-900 dark:text-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={rnpSectionFilter}
                onChange={(e) => setRnpSectionFilter(e.target.value)}
                className="bg-gray-50 dark:bg-[#15171c] border border-gray-200 dark:border-[#2b303c] rounded-xl px-3 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:outline-hidden"
              >
                <option value="ALL">Все категории РНП</option>
                <option value="visits">Визиты и Активности</option>
                <option value="prescriptions">Рецептурный надзор</option>
                <option value="reps">Медицинские представители</option>
                <option value="merch">Мерчендайзинг</option>
                <option value="ecommerce">E-Commerce & Аптеки</option>
                <option value="smm">SMM и Блогеры</option>
                <option value="promo">Спецпроекты / Промо</option>
              </select>

              <span className="text-xs text-gray-400">
                Найдено: {filteredRnp.length}
              </span>
            </div>
          </div>

          {/* Compact Clean Table */}
          <div className="bg-white dark:bg-[#1e2128] rounded-2xl border border-gray-200/80 dark:border-[#2b303c] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 dark:bg-[#15171c] border-b border-gray-200 dark:border-[#2b303c] text-gray-500 dark:text-gray-400">
                    <th className="py-3 px-4 font-semibold">Показатель / Задача</th>
                    <th className="py-3 px-3 font-semibold">Ответственный</th>
                    <th className="py-3 px-3 font-semibold text-center">План</th>
                    <th className="py-3 px-3 font-semibold text-center">Факт</th>
                    <th className="py-3 px-4 font-semibold text-center">% Выполнения</th>
                    <th className="py-3 px-3 font-semibold text-center">Прогноз</th>
                    <th className="py-3 px-4 font-semibold text-center">W1 - W5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-[#262932]">
                  {filteredRnp.slice(0, 35).map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/70 dark:hover:bg-[#252830]/50 transition">
                      <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                        <div>
                          <span>{item.indicator}</span>
                          <span className="text-[10px] text-gray-400 block font-normal">{item.sectionName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-gray-600 dark:text-gray-300">
                        <div>
                          <span>{item.person || '—'}</span>
                          <span className="text-[10px] text-gray-400 block">{item.role || '—'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-gray-800 dark:text-gray-200">
                        {item.planMonth}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-gray-900 dark:text-white">
                        {item.factMonth}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 bg-gray-100 dark:bg-[#2b303c] h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                item.percentMonth >= 90
                                  ? 'bg-emerald-500'
                                  : item.percentMonth >= 70
                                  ? 'bg-blue-500'
                                  : 'bg-amber-500'
                              }`} 
                              style={{ width: `${Math.min(item.percentMonth, 100)}%` }} 
                            />
                          </div>
                          <span className="font-bold text-[11px] text-gray-900 dark:text-white w-8">
                            {item.percentMonth}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center text-gray-600 dark:text-gray-300">
                        {item.forecast}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400">
                          <span className={item.w1 && Number(item.w1.fact) >= Number(item.w1.plan) ? 'text-emerald-600 font-bold' : ''}>W1</span>•
                          <span className={item.w2 && Number(item.w2.fact) >= Number(item.w2.plan) ? 'text-emerald-600 font-bold' : ''}>W2</span>•
                          <span className={item.w3 && Number(item.w3.fact) >= Number(item.w3.plan) ? 'text-emerald-600 font-bold' : ''}>W3</span>•
                          <span className={item.w4 && Number(item.w4.fact) >= Number(item.w4.plan) ? 'text-emerald-600 font-bold' : ''}>W4</span>•
                          <span className={item.w5 && Number(item.w5.fact) >= Number(item.w5.plan) ? 'text-emerald-600 font-bold' : ''}>W5</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
