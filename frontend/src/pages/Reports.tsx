import React, { useState, useRef, useMemo, useEffect } from 'react'
import { 
  BarChart3, TrendingUp, Target, CheckCircle2, 
  Download, Upload, Filter, Calendar, 
  Layers, Sparkles, Activity, 
  Award, Search, Stethoscope, ShoppingBag, Briefcase, Loader2,
  DollarSign, Users, Eye, X, ExternalLink
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

// Strict 3-color status helper for Plan vs Fact (<35% Red, 35-74% Yellow, >=75% Green)
const getPlanFactProgressConfig = (percent: number) => {
  if (percent < 35) {
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500',
      lightBg: 'bg-rose-50 dark:bg-rose-950/40',
      border: 'border-rose-200 dark:border-rose-900/60',
      label: 'Отставание'
    }
  }
  if (percent < 75) {
    return {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      lightBg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-900/60',
      label: 'В процессе'
    }
  }
  return {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-900/60',
    label: 'Выполнено'
  }
}

// Influencer Marketing & Bloggers Dataset
const bloggersReportData = [
  {
    id: 'b1',
    project: 'Extragel',
    blogger: 'Шахзода Мухаммедова',
    handle: '@shakhzoda__mukhammedova',
    platform: 'Instagram',
    category: 'Beauty & Lifestyle',
    profileUrl: 'https://www.instagram.com/shakhzoda__mukhammedova/',
    postUrl: 'https://www.instagram.com/reel/C-shakhzoda-extragel/',
    publishDate: '12 сентября 2026',
    followers: '4.2M',
    reach: '180K',
    views: '148,200',
    format: 'Reels + 2 Stories',
    price: '$650',
    priceNum: 650,
    profileVisits: 3950,
    promoSales: 318,
    revenue: '$3,816',
    roi: '+487%',
    er: '9.4%',
    geo: 'Ташкент (74%), Самарканд (14%), Регионы (12%)',
    demographics: 'Женщины 82%, Мужчины 18% (20–35 лет)',
    manager: 'Азиз Т. (+998 90 123-45-67)',
    notes: 'Интеграция с фокусом на натуральность состава и быстрое снятие симптомов. Живой формат распаковки, личный опыт блогера и активный промокод на скидку 15% в аптечных сетях.'
  },
  {
    id: 'b2',
    project: 'Extragel',
    blogger: 'Доктор Алимов (Health & Life)',
    handle: '@dr_alimov_health',
    platform: 'Telegram',
    category: 'Медицина & Здоровье',
    profileUrl: 'https://t.me/dr_alimov_health',
    postUrl: 'https://t.me/dr_alimov_health/1420',
    publishDate: '08 сентября 2026',
    followers: '120K',
    reach: '45K',
    views: '42,000',
    format: 'Экспертный пост с опросом',
    price: '$200',
    priceNum: 200,
    profileVisits: 1120,
    promoSales: 94,
    revenue: '$1,128',
    roi: '+464%',
    er: '7.8%',
    geo: 'Ташкент (65%), Андижан (18%), Бухара (17%)',
    demographics: 'Женщины 54%, Мужчины 46% (25–45 лет)',
    manager: 'Азиз Т. (+998 90 123-45-67)',
    notes: 'Экспертный разбор механизма действия препарата с клиническими акцентами и интерактивным опросом целевой аудитории.'
  },
  {
    id: 'b3',
    project: 'Extragel',
    blogger: 'Мадина Мамасидикова',
    handle: '@madina_lifestyle',
    platform: 'Instagram',
    category: 'Lifestyle & Семья',
    profileUrl: 'https://www.instagram.com/madina_lifestyle/',
    postUrl: 'https://www.instagram.com/stories/highlights/madina_family/',
    publishDate: '15 сентября 2026',
    followers: '850K',
    reach: '95K',
    views: '88,500',
    format: 'Stories распаковка аптечки',
    price: '$300',
    priceNum: 300,
    profileVisits: 1840,
    promoSales: 142,
    revenue: '$1,704',
    roi: '+468%',
    er: '8.2%',
    geo: 'Ташкент (80%), Фергана (12%), Наманган (8%)',
    demographics: 'Женщины 89%, Мужчины 11% (22–40 лет)',
    manager: 'Наргиза К. (+998 93 555-44-33)',
    notes: 'Семейный контент: аптечка в поездку с детьми. Интеграция в формате серии Stories-распаковки с демонстрацией применения.'
  },
  {
    id: 'b4',
    project: 'Extragel',
    blogger: 'Фитнес Ташкент (Артём)',
    handle: '@tashkent_fit_artem',
    platform: 'TikTok',
    category: 'Фитнес & ЗОЖ Ташкент',
    profileUrl: 'https://www.tiktok.com/@tashkent_fit_artem',
    postUrl: 'https://www.tiktok.com/@tashkent_fit_artem/video/739120',
    publishDate: '20 сентября 2026',
    followers: '320K',
    reach: '60K',
    views: '65,000',
    format: 'Динамичный ролик с тренировки',
    price: '$180',
    priceNum: 180,
    profileVisits: 980,
    promoSales: 65,
    revenue: '$780',
    roi: '+333%',
    er: '11.1%',
    geo: 'Ташкент (85%), Чирчик (10%), Другие (5%)',
    demographics: 'Мужчины 58%, Женщины 42% (18–30 лет)',
    manager: 'Наргиза К. (+998 93 555-44-33)',
    notes: 'Динамичный ролик после интенсивной силовой тренировки. Акцент на быстрое восстановление связок и суставов.'
  },
  {
    id: 'b5',
    project: 'Masculan',
    blogger: 'Улугбек Men Style',
    handle: '@ulugbek_style',
    platform: 'Instagram',
    category: 'Мужской стиль & Тренды',
    profileUrl: 'https://www.instagram.com/ulugbek_style/',
    postUrl: 'https://www.instagram.com/reel/C-ulugbek_masculan/',
    publishDate: '10 сентября 2026',
    followers: '450K',
    reach: '75K',
    views: '71,200',
    format: 'Reels обзор трендов',
    price: '$350',
    priceNum: 350,
    profileVisits: 2450,
    promoSales: 180,
    revenue: '$2,160',
    roi: '+517%',
    er: '8.9%',
    geo: 'Ташкент (78%), Самарканд (12%), Навои (10%)',
    demographics: 'Мужчины 76%, Женщины 24% (21–38 лет)',
    manager: 'Азиз Т. (+998 90 123-45-67)',
    notes: 'Стильный Reels в эстетике премиум-сегмента Masculan. Высокий интерес мужской аудитории и отличная конверсия в аптечные покупки.'
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
  const [activeReportTab, setActiveReportTab] = useState<'analytics' | 'plans' | 'bloggers' | 'companies' | 'rnp_table'>('bloggers')
  const [selectedBloggerModal, setSelectedBloggerModal] = useState<any | null>(null)
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
        const mapped = res.data.map((b: any) => {
          const cleanHandle = (b.handle || '').replace(/^@/, '')
          const profileUrl = b.profile_url || (
            b.platform?.toLowerCase() === 'telegram' ? `https://t.me/${cleanHandle}` :
            b.platform?.toLowerCase() === 'tiktok' ? `https://www.tiktok.com/@${cleanHandle}` :
            b.platform?.toLowerCase() === 'youtube' ? `https://www.youtube.com/@${cleanHandle}` :
            `https://www.instagram.com/${cleanHandle}/`
          )
          const promoSales = b.link_clicks || 85
          const priceNum = parseInt((b.price || '0').replace(/[^\d]/g, ''), 10) || 250
          return {
            id: b.id,
            project: projectNames[b.project_id] || (b.project_id ? `Проект #${b.project_id}` : 'Extragel'),
            blogger: b.name,
            handle: b.handle,
            platform: b.platform || 'Instagram',
            category: b.category || 'Beauty & Lifestyle',
            profileUrl,
            postUrl: b.post_url || profileUrl,
            publishDate: b.publish_date || 'Сентябрь 2026',
            followers: b.followers || '250K',
            reach: b.reach || '65K',
            views: (b.views || 0).toLocaleString(),
            format: b.format || 'Reels + Stories',
            price: b.price || `$${priceNum}`,
            priceNum,
            profileVisits: b.profile_visits || 1200,
            promoSales,
            revenue: `$${(promoSales * 12).toLocaleString()}`,
            roi: `+${Math.round(((promoSales * 12) / (priceNum || 1)) * 100)}%`,
            er: b.er || '8.4%',
            geo: b.geo || 'Ташкент (72%), Самарканд (16%), Регионы (12%)',
            demographics: b.demographics || 'Женщины 75%, Мужчины 25% (20–35 лет)',
            manager: b.manager || 'Азиз Т. (+998 90 123-45-67)',
            notes: b.notes || 'Интеграция с акцентом на преимущества продукта, живую распаковку и промокод со скидкой 15% в аптечных сетях.'
          }
        })
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

  const svgWidth = 1000
  const svgHeight = 260
  const padding = 40
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
    <div className="w-full space-y-7">
      {/* Hidden file input for CSV */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".csv" 
        className="hidden" 
      />

      {/* Header with Title & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white dark:bg-[#181b20] p-6 lg:p-7 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-[#4f46e5] to-[#7c3aed] text-white rounded-2xl shadow-md flex items-center justify-center shrink-0">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Отчёты и Аналитика
              </h1>
              {isLoadingRnp && (
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              )}
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Наглядная динамика выполнения планов, спринтов, визитов и блогосферы
            </p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center bg-slate-100/90 dark:bg-[#121418] rounded-xl px-2 py-1 border border-slate-200 dark:border-[#2b303c]">
            <Calendar className="w-4 h-4 ml-1.5 text-indigo-500 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
            >
              <option value="Сентябрь 2026" className="dark:bg-[#181b20]">Сентябрь 2026</option>
              <option value="Август 2026" className="dark:bg-[#181b20]">Август 2026</option>
              <option value="Июнь 2026" className="dark:bg-[#181b20]">Июнь 2026</option>
            </select>
          </div>

          {/* Project Selector */}
          <div className="flex items-center bg-slate-100/90 dark:bg-[#121418] rounded-xl px-2 py-1 border border-slate-200 dark:border-[#2b303c]">
            <Filter className="w-4 h-4 ml-1.5 text-indigo-500 shrink-0" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL" className="dark:bg-[#181b20]">Все проекты</option>
              <option value="Extragel" className="dark:bg-[#181b20]">Extragel</option>
              <option value="Masculan" className="dark:bg-[#181b20]">Masculan</option>
              <option value="Энтеросгель" className="dark:bg-[#181b20]">Энтеросгель</option>
            </select>
          </div>

          {/* Excel Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md cursor-pointer"
            title="Экспорт в Excel / CSV"
          >
            <Download className="w-4 h-4" />
            <span>Экспорт .CSV</span>
          </button>

          {/* Import CSV Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#252a36] dark:hover:bg-[#2e3444] text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition cursor-pointer"
            title="Импорт отчёта"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Загрузить</span>
          </button>
        </div>
      </div>

      {/* Upload Feedback Toast */}
      {uploadFeedback && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{uploadFeedback}</span>
        </div>
      )}

      {/* Primary Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#2b303c] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveReportTab('analytics')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition shrink-0 cursor-pointer ${
            activeReportTab === 'analytics'
              ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222632]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Сводная аналитика (Графики)</span>
        </button>

        <button
          onClick={() => setActiveReportTab('plans')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition shrink-0 cursor-pointer ${
            activeReportTab === 'plans'
              ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222632]'
          }`}
        >
          <Target className="w-5 h-5" />
          <span>План / Факт спринтов</span>
        </button>

        <button
          onClick={() => setActiveReportTab('bloggers')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition shrink-0 cursor-pointer ${
            activeReportTab === 'bloggers'
              ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222632]'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Маркетинг & Блогеры ({filteredBloggers.length})</span>
        </button>

        <button
          onClick={() => setActiveReportTab('companies')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition shrink-0 cursor-pointer ${
            activeReportTab === 'companies'
              ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222632]'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Партнёры и B2B ({filteredCompanies.length})</span>
        </button>

        <button
          onClick={() => setActiveReportTab('rnp_table')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition shrink-0 cursor-pointer ${
            activeReportTab === 'rnp_table'
              ? 'bg-[#4f46e5] text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222632]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Сводная таблица РНП</span>
        </button>
      </div>

      {/* TAB 1: VISUAL ANALYTICS & INTERACTIVE CHARTS */}
      {activeReportTab === 'analytics' && (
        <div className="space-y-7 animate-fade-in">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* KPI 1: Overall Plan Completion */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Общий план месяца</span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5" /> +12.4%
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">88.4%</span>
                <span className="text-sm text-slate-400 font-semibold">из 100% цели</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden mb-2.5">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '88.4%' }} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Опережение целевого графика на 3 дня
              </p>
            </div>

            {/* KPI 2: Field Visits (Doctors & Pharmacies) */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Визиты (Врачи & Аптеки)</span>
                <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                  <Stethoscope className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">385</span>
                <span className="text-sm text-slate-400 font-semibold">/ 410 план</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden mb-2.5">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '93.9%' }} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                93.9% выполнения полевого плана визитов
              </p>
            </div>

            {/* KPI 3: Marketing & Influencer Reach */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Охват блогосферы</span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 font-extrabold text-xs border border-purple-200 dark:border-purple-800">
                  {filteredBloggers.length} блогеров
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {(totalBloggerReach / 1000).toFixed(0)}K
                </span>
                <span className="text-sm text-slate-400 font-semibold">просмотров</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden mb-2.5">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: '91%' }} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {totalPromoOrders} прямых заказов по промокодам
              </p>
            </div>

            {/* KPI 4: Sprints & Task Completion */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-orange-400" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Спринты и Задачи</span>
                <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                  <Activity className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">42</span>
                <span className="text-sm text-slate-400 font-semibold">/ 48 задач</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden mb-2.5">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '87.5%' }} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                87.5% задач закрыто вовремя
              </p>
            </div>
          </div>

          {/* MAIN CHART: Performance Dynamics (Plan vs Fact Spline) */}
          <div className="bg-white dark:bg-[#181b20] p-6 lg:p-8 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span>Динамика выполнения плана по неделям</span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                    Интерактивный график
                  </span>
                </h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Сравнение запланированного темпа и фактического результата по 5 неделям месяца
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-5 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-800 dark:text-slate-200 font-bold">Факт (Выполнено)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-0.5 border-t-2 border-dashed border-indigo-400" />
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">План (Цель)</span>
                </div>
              </div>
            </div>

            {/* SVG Spline Chart */}
            <div className="relative w-full overflow-x-auto">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-60 sm:h-72 lg:h-80 select-none"
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
                        stroke="#e2e8f0" 
                        className="dark:stroke-[#2b303c]" 
                        strokeDasharray="4 4" 
                      />
                      <text 
                        x={padding - 10} 
                        y={y + 4} 
                        textAnchor="end" 
                        className="text-xs fill-slate-400 dark:fill-slate-500 font-mono font-semibold"
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
                    strokeWidth="3" 
                    strokeDasharray="6 6" 
                  />
                )}

                {/* Fact Curve (Solid line with glow) */}
                {factSpline && factSpline.path && (
                  <path 
                    d={factSpline.path} 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="4" 
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
                          r="10" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="2.5" 
                          strokeOpacity="0.5"
                        />
                      )}
                      {/* Background circle */}
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r={isSelected ? 7 : 5} 
                        className="fill-white dark:fill-[#181b20]" 
                        stroke="#10b981" 
                        strokeWidth={isSelected ? 3.5 : 2.5} 
                      />

                      {/* X-axis labels */}
                      <text 
                        x={pt.x} 
                        y={svgHeight - 12} 
                        textAnchor="middle" 
                        className={`text-xs ${
                          isSelected 
                            ? 'font-black fill-[#4f46e5] dark:fill-indigo-400' 
                            : 'font-semibold fill-slate-500 dark:fill-slate-400'
                        }`}
                      >
                        {d.week}
                      </text>

                      {/* Point value badge */}
                      <text 
                        x={pt.x} 
                        y={pt.y - 12} 
                        textAnchor="middle" 
                        className={`text-xs font-black ${
                          isSelected 
                            ? 'fill-emerald-600 dark:fill-emerald-400' 
                            : 'fill-slate-700 dark:fill-slate-300'
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
            <div className="mt-5 p-4 bg-slate-50 dark:bg-[#121418] rounded-2xl border border-slate-200 dark:border-[#2b303c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-sm border border-emerald-200 dark:border-emerald-800">
                  W{selectedChartWeek + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Детализация: {activeWeekInfo.label} ({activeWeekInfo.week})
                  </h4>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Нажмите на любую точку графика для просмотра данных недели
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="bg-white dark:bg-[#181b20] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2b303c]">
                  <span className="text-slate-400 text-xs block font-medium">План недели:</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">{activeWeekInfo.plan}%</span>
                </div>

                <div className="bg-white dark:bg-[#181b20] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2b303c]">
                  <span className="text-slate-400 text-xs block font-medium">Факт недели:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{activeWeekInfo.fact}%</span>
                </div>

                <div className="bg-white dark:bg-[#181b20] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2b303c]">
                  <span className="text-slate-400 text-xs block font-medium">Полевые визиты:</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {activeWeekInfo.visitsFact} / {activeWeekInfo.visitsPlan}
                  </span>
                </div>

                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  activeWeekInfo.fact >= activeWeekInfo.plan
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                }`}>
                  {activeWeekInfo.fact >= activeWeekInfo.plan ? 'План перевыполнен' : 'Небольшое отставание'}
                </div>
              </div>
            </div>
          </div>

          {/* TWO COLUMN GRID: Categories Breakdown & Team Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Category Breakdown */}
            <div className="bg-white dark:bg-[#181b20] p-6 lg:p-7 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Target className="w-5 h-5 text-indigo-500" />
                  <span>Выполнение по направлениям бизнеса</span>
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Цель: 100%</span>
              </div>

              <div className="space-y-5">
                {/* Item 1 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-blue-500" />
                      Визиты к врачам и рецептурный охват
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-base">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>План: 100 визитов</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Факт: 92 визита</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      Аптечные сети (Ташкент + Регионы)
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-base">88%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>План: 210 аптек</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Факт: 185 аптек</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Инфлюенс-маркетинг & Соцсети
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-base">95%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '95%' }} />
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>План: 400K просмотров</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Факт: 415K просмотров</span>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-500" />
                      Партнерские отели, SPA и заведения (B2B)
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-base">78%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }} />
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>План: 10 локаций</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">Факт: 8 локаций</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Team Leaderboard */}
            <div className="bg-white dark:bg-[#181b20] p-6 lg:p-7 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Рейтинг эффективности команды</span>
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">KPI рейтинг</span>
              </div>

              <div className="space-y-3.5">
                {teamLeaderboard.map((member, index) => (
                  <div 
                    key={member.id}
                    className="p-4 bg-slate-50 dark:bg-[#121418] rounded-2xl border border-slate-200/80 dark:border-[#2b303c] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Rank badge */}
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        index === 0 
                          ? 'bg-amber-400 text-slate-950' 
                          : index === 1 
                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white' 
                          : 'bg-slate-200 dark:bg-[#222632] text-slate-600 dark:text-slate-400'
                      }`}>
                        {index + 1}
                      </span>

                      {/* Avatar initials */}
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                        {member.avatar}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{member.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                            member.percent >= 95 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : member.percent >= 85
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                          }`}>
                            {member.badge}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{member.role}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {member.percent}%
                      </div>
                      <p className="text-xs font-semibold text-slate-400">
                        {member.fact}/{member.plan} план
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Executive Insights / Quick Takeaways */}
          <div className="p-6 bg-gradient-to-r from-indigo-50/90 to-blue-50/90 dark:from-[#1b202c] dark:to-[#171c26] rounded-3xl border border-indigo-100 dark:border-[#2b354a]">
            <h4 className="text-sm font-extrabold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Ключевые выводы аналитики за {selectedMonth}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-800 dark:text-slate-200">
              <div className="flex items-start gap-3 bg-white/80 dark:bg-[#181b20]/80 p-4 rounded-2xl border border-indigo-100/60 dark:border-[#2b354a]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="font-bold text-slate-900 dark:text-white">Визиты к врачам:</strong> Ташкент закрывает цель на 100%, ортопеды и травматологи обеспечили стабильный поток назначений.
                </span>
              </div>
              <div className="flex items-start gap-3 bg-white/80 dark:bg-[#181b20]/80 p-4 rounded-2xl border border-indigo-100/60 dark:border-[#2b354a]">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="font-bold text-slate-900 dark:text-white">Инфлюенсеры:</strong> Пост Шахзоды Мухаммедовой дал максимальную отдачу: 318 прямых заказов при бюджете $650.
                </span>
              </div>
              <div className="flex items-start gap-3 bg-white/80 dark:bg-[#181b20]/80 p-4 rounded-2xl border border-indigo-100/60 dark:border-[#2b354a]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="font-bold text-slate-900 dark:text-white">Фокус внимания:</strong> По проекту Masculan необходимо ускорить установку промостоек в регионах (сейчас 40% плана).
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPRINTS & OPERATIONAL PLANS */}
      {activeReportTab === 'plans' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#181b20] p-6 lg:p-7 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-1">
              План / Факт спринтов по проектам
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6">
              Текущий статус выполнения операционных задач и спринтов команды
            </p>

            <div className="space-y-6">
              {filteredPlans.map(proj => {
                const projConfig = getPlanFactProgressConfig(proj.overallProgress)

                return (
                  <div 
                    key={proj.id} 
                    className="p-5 sm:p-6 bg-slate-50 dark:bg-[#121418] rounded-3xl border border-slate-200 dark:border-[#2b303c]"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-3.5 h-3.5 rounded-full ${projConfig.bg} shadow-xs`} />
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {proj.project}
                        </h3>
                        <span className="text-sm font-semibold text-slate-400">({proj.month})</span>
                      </div>

                      <div className="flex items-center gap-3.5">
                        <span className={`text-sm sm:text-base font-black ${projConfig.text}`}>
                          Выполнение: {proj.overallProgress}%
                        </span>
                        <div className="w-36 sm:w-44 bg-slate-200 dark:bg-[#20242e] h-3 rounded-full overflow-hidden p-0.5 border border-slate-300/40 dark:border-[#2c3140]">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${projConfig.bg}`} 
                            style={{ width: `${Math.min(proj.overallProgress, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Items list - Prominent Plan vs Fact Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
                      {proj.items.map((it, idx) => {
                        const itemConfig = getPlanFactProgressConfig(it.percent)
                        const isOverTarget = it.fact >= it.plan
                        const remaining = Math.max(0, it.plan - it.fact)

                        return (
                          <div 
                            key={idx} 
                            className="bg-white dark:bg-[#181b20] p-5 rounded-2xl border border-slate-200/90 dark:border-[#272b36] shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-[#383e4e] transition-all flex flex-col justify-between"
                          >
                            <div>
                              {/* Top row: Status Badge and Percentage */}
                              <div className="flex items-center justify-between gap-2 mb-3">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs border ${itemConfig.lightBg} ${itemConfig.text} ${itemConfig.border}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${itemConfig.bg}`} />
                                  {itemConfig.label}
                                </span>
                                <span className={`text-lg font-black tracking-tight ${itemConfig.text}`}>
                                  {it.percent}%
                                </span>
                              </div>

                              {/* Task Title */}
                              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 min-h-[44px] leading-snug">
                                {it.name}
                              </h4>

                              {/* Prominent Plan vs Fact Dual Box */}
                              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50/90 dark:bg-[#101216] border border-slate-100 dark:border-[#20242f] mb-4">
                                <div>
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                                    План
                                  </span>
                                  <div className="flex items-baseline gap-1.5">
                                    <span className="text-2xl font-black text-slate-800 dark:text-slate-200 tracking-tight">
                                      {it.plan}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-400">
                                      {it.unit}
                                    </span>
                                  </div>
                                </div>

                                <div className="border-l border-slate-200/80 dark:border-[#242834] pl-3.5">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
                                    Факт
                                  </span>
                                  <div className="flex items-baseline gap-1.5">
                                    <span className={`text-2xl font-black tracking-tight ${itemConfig.text}`}>
                                      {it.fact}
                                    </span>
                                    <span className="text-xs font-semibold text-slate-400">
                                      {it.unit}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Visual Progress Bar & Progress Details */}
                            <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-[#20242f]">
                              <div className="w-full bg-slate-100 dark:bg-[#101216] h-2.5 rounded-full overflow-hidden border border-slate-200/60 dark:border-[#242834]">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${itemConfig.bg}`}
                                  style={{ width: `${Math.min(it.percent, 100)}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                                <span>Прогресс: {it.percent}%</span>
                                <span className={isOverTarget ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}>
                                  {isOverTarget ? '✓ План выполнен' : `Осталось: ${remaining} ${it.unit}`}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MARKETING & BLOGGERS */}
      {activeReportTab === 'bloggers' && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary KPIs for Marketing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Budget */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Общий бюджет блогеров</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                ${totalBloggerSpend.toLocaleString()}
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-2">Выделенный рекламный фонд</p>
            </div>

            {/* Card 2: Reach */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Суммарный охват</span>
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight">
                455K чел
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-2">Уникальная аудитория каналов</p>
            </div>

            {/* Card 3: Views */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Суммарные просмотры</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                {(totalBloggerReach / 1000).toFixed(0)}K
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-2">Фактический интерес к постам</p>
            </div>

            {/* Card 4: Orders */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Заказов по промокодам</span>
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
                {totalPromoOrders}
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-2">Прямые продажи в аптеках</p>
            </div>
          </div>

          {/* Bloggers Grid - Professional SaaS Standard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredBloggers.map(b => (
              <div 
                key={b.id} 
                onClick={() => setSelectedBloggerModal(b)}
                className="bg-white dark:bg-[#15181e] p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-[#272b36] shadow-xs hover:shadow-md hover:border-indigo-400/80 dark:hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      {b.project} • {b.platform}
                    </span>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {b.blogger}
                    </h4>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50/80 dark:bg-[#101216] border border-slate-100 dark:border-[#20242f]">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-0.5">Стоимость</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">{b.price}</span>
                    </div>
                    <div className="border-x border-slate-200/60 dark:border-[#20242f] px-2">
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-0.5">Просмотры</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">{b.views}</span>
                    </div>
                    <div className="pl-1">
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-0.5">Переходы</span>
                      <span className="text-base font-bold text-slate-900 dark:text-white">{(b.profileVisits || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#20242f] flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <span>Детали интеграции</span>
                  <span>Подробнее →</span>
                </div>
              </div>
            ))}
          </div>

          {/* BLOGGER DETAILS MODAL (PROFESSIONAL SAAS STANDARD) */}
          {selectedBloggerModal && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
              onClick={() => setSelectedBloggerModal(null)}
            >
              <div 
                className="bg-white dark:bg-[#16181f] w-full max-w-2xl lg:max-w-3xl rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#2b303c] shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-slate-900 dark:text-white"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-[#242833]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200/60 dark:border-indigo-800/40 flex items-center justify-center text-lg shrink-0">
                      {selectedBloggerModal.blogger?.slice(0, 2).toUpperCase() || 'BL'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {selectedBloggerModal.project} • {selectedBloggerModal.platform} • {selectedBloggerModal.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {selectedBloggerModal.blogger}
                      </h3>
                      <a
                        href={selectedBloggerModal.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mt-0.5"
                      >
                        <span>{selectedBloggerModal.handle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-start">
                    <a
                      href={selectedBloggerModal.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold transition-all shadow-sm cursor-pointer"
                      title="Открыть страницу блогера в новой вкладке"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Открыть профиль</span>
                    </a>

                    <button 
                      type="button"
                      onClick={() => setSelectedBloggerModal(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#20242e] rounded-lg transition-colors cursor-pointer"
                      title="Закрыть"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Section 1: 3 Core Primary KPIs */}
                <div className="grid grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111317] border border-slate-200/80 dark:border-[#222632]">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Стоимость
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedBloggerModal.price}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      Бюджет интеграции
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111317] border border-slate-200/80 dark:border-[#222632]">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Просмотры видео
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedBloggerModal.views}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      С наших роликов
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111317] border border-slate-200/80 dark:border-[#222632]">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Переходы
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {(selectedBloggerModal.profileVisits || 0).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      Трафик / клики в профиль
                    </span>
                  </div>
                </div>

                {/* Section 2: Secondary Performance & Audience Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#111317]/70 border border-slate-200/70 dark:border-[#222632]">
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">Аудитория канала</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">{selectedBloggerModal.followers}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">Охват публикации</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">{selectedBloggerModal.reach}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">ER (Вовлечение)</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">{selectedBloggerModal.er}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">Заказы (Продажи)</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">{selectedBloggerModal.promoSales}</span>
                  </div>
                </div>

                {/* Section 3: Financial ROI & Unit Economics */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#111317] border border-slate-200/80 dark:border-[#222632]">
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Выручка по промокоду</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{selectedBloggerModal.revenue}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Окупаемость (ROI)</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selectedBloggerModal.roi}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Цена перехода (CPC)</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      ${selectedBloggerModal.profileVisits ? (selectedBloggerModal.priceNum / selectedBloggerModal.profileVisits).toFixed(2) : '0.16'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Цена за просмотр (CPV)</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">$0.004</span>
                  </div>
                </div>

                {/* Section 4: Campaign Details Spec Table */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#20242e]">
                    <span className="text-slate-500 dark:text-slate-400">Формат интеграции</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedBloggerModal.format}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#20242e]">
                    <span className="text-slate-500 dark:text-slate-400">География аудитории</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedBloggerModal.geo}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#20242e]">
                    <span className="text-slate-500 dark:text-slate-400">Демография аудитории</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedBloggerModal.demographics}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#20242e]">
                    <span className="text-slate-500 dark:text-slate-400">Дата публикации</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedBloggerModal.publishDate}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#20242e]">
                    <span className="text-slate-500 dark:text-slate-400">Ответственный менеджер</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedBloggerModal.manager}</span>
                  </div>
                </div>

                {/* Section 5: Campaign Notes */}
                {selectedBloggerModal.notes && (
                  <div className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-[#111317]/60 border border-slate-200/70 dark:border-[#222632] text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                      Заметка по интеграции:
                    </span>
                    {selectedBloggerModal.notes}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#242833]">
                  <a
                    href={selectedBloggerModal.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <span>Открыть аккаунт блогера</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-2.5">
                    {selectedBloggerModal.postUrl && (
                      <a
                        href={selectedBloggerModal.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-[#20242e] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#282d3a] transition-colors"
                      >
                        Смотреть пост ↗
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedBloggerModal(null)}
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PARTNERS & VENUES */}
      {activeReportTab === 'companies' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#181b20] p-6 lg:p-7 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-1">
              Партнёрские заведения, Отели и B2B локации
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6">
              Спецпроекты, дистрибуция брендированных материалов и тейбл-тентов
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCompanies.map(c => (
                <div 
                  key={c.id} 
                  className="bg-slate-50 dark:bg-[#121418] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#2b303c] flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/50">
                          {c.project} • {c.category}
                        </span>
                        <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-2">
                          {c.name}
                        </h4>
                        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{c.location}</p>
                      </div>
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shrink-0 border border-indigo-200 dark:border-indigo-800">
                        {c.status}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#181b20] p-4 rounded-2xl border border-slate-200/80 dark:border-[#2b303c] my-3 leading-relaxed">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Предоставленные материалы:</span>
                      {c.itemsProvided}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-[#262a35] flex flex-wrap items-center justify-between text-sm font-semibold text-slate-500 dark:text-slate-400 gap-2">
                    <span>Контакт: <strong className="text-slate-900 dark:text-white font-bold">{c.contactPerson}</strong> ({c.phone})</span>
                    <span>Бюджет: <strong className="text-slate-900 dark:text-white font-black text-base">{c.spent}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMPACT RNP TABLE */}
      {activeReportTab === 'rnp_table' && (
        <div className="space-y-6 animate-fade-in">
          {/* RNP Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181b20] p-5 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
            <div className="flex items-center gap-2.5 flex-1 max-w-lg">
              <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
              <input
                type="text"
                placeholder="Поиск по показателю, роли или имени..."
                value={rnpSearch}
                onChange={(e) => setRnpSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#121418] border border-slate-200 dark:border-[#2b303c] rounded-xl px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={rnpSectionFilter}
                onChange={(e) => setRnpSectionFilter(e.target.value)}
                className="bg-slate-50 dark:bg-[#121418] border border-slate-200 dark:border-[#2b303c] rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden cursor-pointer"
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

              <span className="text-sm font-bold text-slate-400 shrink-0">
                Найдено: {filteredRnp.length}
              </span>
            </div>
          </div>

          {/* Compact Clean Table */}
          <div className="bg-white dark:bg-[#181b20] rounded-3xl border border-slate-200/90 dark:border-[#2b303c] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#121418] border-b border-slate-200 dark:border-[#2b303c] text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-5 font-bold">Показатель / Задача</th>
                    <th className="py-4 px-4 font-bold">Ответственный</th>
                    <th className="py-4 px-4 font-bold text-center">План</th>
                    <th className="py-4 px-4 font-bold text-center">Факт</th>
                    <th className="py-4 px-5 font-bold text-center">% Выполнения</th>
                    <th className="py-4 px-4 font-bold text-center">Прогноз</th>
                    <th className="py-4 px-5 font-bold text-center">W1 - W5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#262a35]">
                  {filteredRnp.slice(0, 35).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-[#20242e]/60 transition">
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                        <div>
                          <span className="text-sm sm:text-base font-bold">{item.indicator}</span>
                          <span className="text-xs text-slate-400 block font-medium mt-0.5">{item.sectionName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-200 font-semibold">
                        <div>
                          <span>{item.person || '—'}</span>
                          <span className="text-xs text-slate-400 block font-normal">{item.role || '—'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                        {item.planMonth}
                      </td>
                      <td className="py-4 px-4 text-center font-black text-slate-900 dark:text-white">
                        {item.factMonth}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center gap-2.5">
                          <div className="w-20 bg-slate-100 dark:bg-[#2b303c] h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                item.percentMonth >= 80
                                  ? 'bg-emerald-500'
                                  : item.percentMonth >= 35
                                  ? 'bg-amber-400'
                                  : 'bg-red-500'
                              }`} 
                              style={{ width: `${Math.min(item.percentMonth, 100)}%` }} 
                            />
                          </div>
                          <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white w-9">
                            {item.percentMonth}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {item.forecast}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400">
                          <span className={item.w1 && Number(item.w1.fact) >= Number(item.w1.plan) ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>W1</span>•
                          <span className={item.w2 && Number(item.w2.fact) >= Number(item.w2.plan) ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>W2</span>•
                          <span className={item.w3 && Number(item.w3.fact) >= Number(item.w3.plan) ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>W3</span>•
                          <span className={item.w4 && Number(item.w4.fact) >= Number(item.w4.plan) ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>W4</span>•
                          <span className={item.w5 && Number(item.w5.fact) >= Number(item.w5.plan) ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>W5</span>
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
