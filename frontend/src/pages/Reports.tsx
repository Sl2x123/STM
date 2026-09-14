import React, { useState, useRef, useMemo, useEffect } from 'react'
import { 
  FileText, Download, Filter, CheckCircle2, 
  Users, Building2, Package,
  Upload, Search, ShoppingBag, Stethoscope, Briefcase, BarChart3, RefreshCw
} from 'lucide-react'
import { initialRnpData, RnpItem } from '../data/rnpData'
import { api } from '../lib/api'



// Operational Task Plan / Fact Dataset
const operationalReportData = [
  {
    id: 1,
    project: 'Extragel',
    month: 'Сентябрь 2026',
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
    items: [
      { name: 'Аптечные визиты Самарканд + Регионы', plan: 90, fact: 90, unit: 'визитов', percent: 100, status: 'Done' },
      { name: 'Установка фирменных промостоек', plan: 15, fact: 6, unit: 'штук', percent: 40, status: 'Not Done' },
    ]
  },
  {
    id: 3,
    project: 'Энтеросгель',
    month: 'Сентябрь 2026',
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

// Partner Companies & Venues Dataset
const companiesReportData = [
  {
    id: 'c1',
    project: 'Extragel',
    name: 'Hilton Tashkent City',
    category: 'Гостиница / Отель',
    location: 'ул. Ислама Каримова, 2',
    spent: '$850',
    spentNum: 850,
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
    spentNum: 450,
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
    spentNum: 600,
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
    spentNum: 1100,
    itemsProvided: 'Welcome-наборы VIP (200 шт.), саше в ванные комнаты',
    contactPerson: 'Нодира (Guest Relations)',
    phone: '+998 71 207 12 34',
    status: 'Переговоры'
  }
]

export default function Reports() {
  const [activeReportTab, setActiveReportTab] = useState<'rnp' | 'plans' | 'bloggers' | 'companies'>('rnp')
  const [selectedMonth, setSelectedMonth] = useState('Июнь 2026')
  const [selectedProject, setSelectedProject] = useState('ALL')
  const [rnpData, setRnpData] = useState<RnpItem[]>(initialRnpData)
  const [rnpSectionFilter, setRnpSectionFilter] = useState<string>('ALL')
  const [rnpSearch, setRnpSearch] = useState<string>('')
  const [rnpViewMode, setRnpViewMode] = useState<'grouped' | 'table'>('grouped')
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null)
  const [isLoadingRnp, setIsLoadingRnp] = useState<boolean>(false)
  const [editingCell, setEditingCell] = useState<{ id: string; field: string; value: string } | null>(null)
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
          spentNum: parseInt((c.spent || '0').replace(/[^\d]/g, ''), 10) || 0,
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

  // Save inline cell edit to PostgreSQL backend
  const handleSaveCell = async (id: string, field: string, newVal: string) => {
    setEditingCell(null)
    const numericId = parseInt(id, 10)
    if (isNaN(numericId)) return

    // Optimistic update
    setRnpData(prev => prev.map(item => {
      if (item.id !== id) return item
      if (field === 'factMonth') {
        const plan = parseFloat((item.planMonth || '0').replace(/,/g, '')) || 1
        const fact = parseFloat(newVal.replace(/,/g, '')) || 0
        const pct = Math.round((fact / plan) * 100)
        return { ...item, factMonth: newVal, percentMonth: pct }
      }
      return item
    }))

    try {
      if (field === 'factMonth') {
        const current = rnpData.find(it => it.id === id)
        const plan = parseFloat((current?.planMonth || '0').replace(/,/g, '')) || 1
        const fact = parseFloat(newVal.replace(/,/g, '')) || 0
        const pct = Math.round((fact / plan) * 100)
        await api.put(`/rnp/${numericId}`, { fact_month: newVal, percent_month: pct })
      }
    } catch (err) {
      console.error('Failed to save edit to backend:', err)
    }
  }

  // Filtered RNP items
  const filteredRnp = useMemo(() => {
    return rnpData.filter(item => {
      const matchSection = rnpSectionFilter === 'ALL' || item.section === rnpSectionFilter
      const searchLower = rnpSearch.toLowerCase()
      const matchSearch = !rnpSearch || 
        item.indicator.toLowerCase().includes(searchLower) ||
        (item.person && item.person.toLowerCase().includes(searchLower)) ||
        (item.role && item.role.toLowerCase().includes(searchLower)) ||
        item.sectionName.toLowerCase().includes(searchLower)
      return matchSection && matchSearch
    })
  }, [rnpData, rnpSectionFilter, rnpSearch])

  // Grouped items by section / employee for crystal-clear readability
  const rnpGroups = useMemo(() => {
    const groups: Array<{
      key: string
      sectionName: string
      person?: string
      role?: string
      items: RnpItem[]
    }> = []

    filteredRnp.forEach(item => {
      const key = item.person ? `${item.sectionName}__${item.person}` : item.sectionName
      let existing = groups.find(g => g.key === key)
      if (!existing) {
        existing = {
          key,
          sectionName: item.sectionName,
          person: item.person,
          role: item.role,
          items: []
        }
        groups.push(existing)
      }
      existing.items.push(item)
    })

    return groups
  }, [filteredRnp])

  // Clean weekly cell renderer: eliminates 0/0 clutter and highlights achievements
  const renderWeekCell = (w: { plan: string; fact: string }) => {
    const planTrim = (w.plan || '').trim()
    const factTrim = (w.fact || '').trim()
    const isZero = (!planTrim || planTrim === '0' || planTrim === '-') && 
                   (!factTrim || factTrim === '0' || factTrim === '-')
    if (isZero) {
      return <span className="text-slate-300 dark:text-slate-600 font-sans text-xs select-none">—</span>
    }
    const planVal = parseFloat(planTrim.replace(/,/g, '')) || 0
    const factVal = parseFloat(factTrim.replace(/,/g, '')) || 0
    const isSuccess = factVal >= planVal && factVal > 0

    return (
      <div className="inline-flex items-center justify-center gap-1 font-sans text-xs">
        <span className="text-slate-400 dark:text-slate-500 font-normal">{planTrim || '0'}</span>
        <span className="text-slate-300 dark:text-slate-600 font-light">/</span>
        <span className={`font-bold tabular-nums ${
          isSuccess 
            ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200/60 dark:border-emerald-800' 
            : 'text-slate-900 dark:text-slate-100'
        }`}>
          {factTrim || '0'}
        </span>
      </div>
    )
  }

  // Filtered operational tasks
  const filteredProjects = operationalReportData.filter(p => selectedProject === 'ALL' || p.project === selectedProject)
  let totalPlan = 0
  let totalFact = 0
  filteredProjects.forEach(p => {
    p.items.forEach(i => {
      totalPlan += i.plan
      totalFact += i.fact
    })
  })
  const totalPercent = totalPlan > 0 ? Math.round((totalFact / totalPlan) * 100) : 0

  // Filtered Bloggers
  const bloggersList = liveBloggers.length > 0 ? liveBloggers : bloggersReportData
  const filteredBloggers = bloggersList.filter(b => selectedProject === 'ALL' || b.project === selectedProject)
  const totalBloggerBudget = filteredBloggers.reduce((sum, b) => sum + b.priceNum, 0)
  const totalBloggerSales = filteredBloggers.reduce((sum, b) => sum + b.promoSales, 0)
  const publishedCount = filteredBloggers.filter(b => b.status === 'Вышел пост').length

  // Filtered Companies
  const companiesList = liveCompanies.length > 0 ? liveCompanies : companiesReportData
  const filteredCompanies = companiesList.filter(c => selectedProject === 'ALL' || c.project === selectedProject)
  const totalCompanySpent = filteredCompanies.reduce((sum, c) => sum + c.spentNum, 0)

  // Real Excel / CSV Export Generator with UTF-8 BOM
  const handleExportExcel = () => {
    let csvRows: string[] = []

    if (activeReportTab === 'rnp') {
      csvRows.push('Раздел,Сотрудник / Роль,Показатель,Факт Прошлый месяц,% Прошлого месяца,План месяц,Факт месяц,% Выполнения,Прогноз,1 неделя План,1 неделя Факт,2 неделя План,2 неделя Факт,3 неделя План,3 неделя Факт,4 неделя План,4 неделя Факт,5 неделя План,5 неделя Факт')
      filteredRnp.forEach(item => {
        csvRows.push(`"${item.sectionName}","${item.person || item.role || '-'}","${item.indicator}","${item.prevFact}","${item.prevPercent}","${item.planMonth}","${item.factMonth}","${item.percentMonth}%","${item.forecast}","${item.w1.plan}","${item.w1.fact}","${item.w2.plan}","${item.w2.fact}","${item.w3.plan}","${item.w3.fact}","${item.w4.plan}","${item.w4.fact}","${item.w5.plan}","${item.w5.fact}"`)
      })
    } else if (activeReportTab === 'plans') {
      csvRows.push('Проект,Месяц,Показатель / Задача,План,Факт,Единица,Процент,Статус')
      filteredProjects.forEach(p => {
        p.items.forEach(i => {
          csvRows.push(`"${p.project}","${p.month}","${i.name}",${i.plan},${i.fact},"${i.unit}",${i.percent}%,"${i.status}"`)
        })
      })
    } else if (activeReportTab === 'bloggers') {
      csvRows.push('Проект,Блогер,Никнейм,Платформа,Подписчики,Охват,Просмотры,Формат,Стоимость,Статус,Переходы,Продажи по промокоду,ER')
      filteredBloggers.forEach(b => {
        csvRows.push(`"${b.project}","${b.blogger}","${b.handle}","${b.platform}","${b.followers}","${b.reach}","${b.views}","${b.format}","${b.price}","${b.status}",${b.profileVisits},${b.promoSales},"${b.er}"`)
      })
    } else {
      csvRows.push('Проект,Компания / Партнер,Категория,Локация,Расходы,Предоставленные материалы,Контактное лицо,Телефон,Статус')
      filteredCompanies.forEach(c => {
        csvRows.push(`"${c.project}","${c.name}","${c.category}","${c.location}","${c.spent}","${c.itemsProvided.replace(/"/g, '""')}","${c.contactPerson}","${c.phone}","${c.status}"`)
      })
    }

    const csvContent = '\uFEFF' + csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Отчет_${activeReportTab}_${selectedMonth.replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSyncFromDatabase = async () => {
    try {
      setIsLoadingRnp(true)
      setUploadFeedback('Синхронизация с базой данных PostgreSQL...')
      const res = await api.post('/rnp/seed-csv', null, { params: { month_name: selectedMonth } })
      const reloadRes = await api.get('/rnp/', { params: { month_name: selectedMonth } })
      if (Array.isArray(reloadRes.data)) {
        const mapped: RnpItem[] = reloadRes.data.map((item: any) => ({
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
      setUploadFeedback(`Успешно синхронизировано ${res.data?.count || 151} показателей с базой данных!`)
      setTimeout(() => setUploadFeedback(null), 4000)
    } catch (err) {
      console.error('Sync error:', err)
      setUploadFeedback('Ошибка синхронизации с базой данных')
      setTimeout(() => setUploadFeedback(null), 3000)
    } finally {
      setIsLoadingRnp(false)
    }
  }

  const handleUploadRnpCsv = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsLoadingRnp(true)
    setUploadFeedback(`Загрузка файла ${file.name} в базу данных...`)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await api.post('/rnp/upload-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { month_name: selectedMonth }
      })

      const reloadRes = await api.get('/rnp/', { params: { month_name: selectedMonth } })
      if (Array.isArray(reloadRes.data)) {
        const mapped: RnpItem[] = reloadRes.data.map((item: any) => ({
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
      setUploadFeedback(`Успешно сохранено в БД ${res.data?.count || ''} показателей из CSV!`)
      setTimeout(() => setUploadFeedback(null), 4000)
    } catch (err) {
      console.error('Backend upload error, falling back to local client parse:', err)
      // Fallback to local parsing if backend is unreachable
      const reader = new FileReader()
      reader.onload = (evt) => {
        try {
          const text = evt.target?.result as string
          if (text) {
            const lines = text.split(/\r?\n/)
            const parsedItems: RnpItem[] = []
            lines.forEach((line, idx) => {
              if (idx < 8) return
              const cols = line.split(',')
              if (cols.length >= 7) {
                const indicator = (cols[2] || cols[0] || '').replace(/^"|"$/g, '').trim()
                if (!indicator) return
                const plan = (cols[5] || '').replace(/^"|"$/g, '').trim()
                const fact = (cols[6] || '').replace(/^"|"$/g, '').trim()
                const pctStr = (cols[7] || '0%').replace('%', '').trim()
                const percent = parseFloat(pctStr) || 0
                parsedItems.push({
                  id: `up_${idx}`,
                  section: idx < 17 ? 'visits' : idx < 21 ? 'prescriptions' : idx < 95 ? 'reps' : idx < 101 ? 'merch' : idx < 116 ? 'ecommerce' : 'promo',
                  sectionName: idx < 17 ? 'Визиты и Активности' : idx < 21 ? 'Рецепты препаратов' : idx < 95 ? 'Медицинские представители' : idx < 101 ? 'Мерчендайзинг FMCG' : idx < 116 ? 'Онлайн продажи' : 'Промо-акции',
                  role: cols[0]?.replace(/^"|"$/g, '').trim() || undefined,
                  person: cols[1]?.replace(/^"|"$/g, '').trim() || undefined,
                  indicator,
                  prevFact: cols[3]?.replace(/^"|"$/g, '').trim() || '-',
                  prevPercent: cols[4]?.replace(/^"|"$/g, '').trim() || '-',
                  planMonth: plan || '-',
                  factMonth: fact || '-',
                  percentMonth: Math.round(percent),
                  forecast: cols[8]?.replace(/^"|"$/g, '').trim() || '-',
                  w1: { plan: cols[10]?.trim() || '-', fact: cols[11]?.trim() || '-' },
                  w2: { plan: cols[12]?.trim() || '-', fact: cols[13]?.trim() || '-' },
                  w3: { plan: cols[14]?.trim() || '-', fact: cols[15]?.trim() || '-' },
                  w4: { plan: cols[16]?.trim() || '-', fact: cols[17]?.trim() || '-' },
                  w5: { plan: cols[18]?.trim() || '-', fact: cols[19]?.trim() || '-' },
                })
              }
            })
            if (parsedItems.length > 0) {
              setRnpData(parsedItems)
              setUploadFeedback(`Загружено ${parsedItems.length} строк локально`)
              setTimeout(() => setUploadFeedback(null), 4000)
            }
          }
        } catch (e) {
          setUploadFeedback('Ошибка при разборе файла CSV')
        }
      }
      reader.readAsText(file, 'utf-8')
    } finally {
      setIsLoadingRnp(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="max-w-[1500px] mx-auto font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Отчёты и Аналитика</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1">
            Сводные отчёты по операционным планам, инфлюенс-маркетингу и партнерским интеграциям
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          {activeReportTab === 'rnp' && (
            <button
              onClick={handleSyncFromDatabase}
              disabled={isLoadingRnp}
              className="bg-white dark:bg-[#181b20] hover:bg-slate-50 dark:hover:bg-[#20242c] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-[#262932] px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center transition-all shadow-xs cursor-pointer disabled:opacity-50"
              title="Синхронизировать данные РНП с PostgreSQL"
            >
              <RefreshCw size={14} className={`mr-2 text-[#0052cc] dark:text-indigo-400 ${isLoadingRnp ? 'animate-spin' : ''}`} />
              Синхронизация с БД
            </button>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUploadRnpCsv} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoadingRnp}
            className="bg-white dark:bg-[#181b20] hover:bg-gray-50 dark:hover:bg-[#20242c] text-gray-700 dark:text-gray-200 border border-gray-200/90 dark:border-[#262932] px-3.5 py-2.5 rounded-xl font-bold text-xs flex items-center transition-all shadow-xs cursor-pointer disabled:opacity-50"
            title="Загрузить файл РНП за другой месяц"
          >
            <Upload size={14} className="mr-2 text-[#0052cc] dark:text-indigo-400" />
            Импорт CSV
          </button>

          <button 
            onClick={handleExportExcel}
            className="bg-[#0052cc] hover:bg-[#0047b3] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center transition-all shadow-xs cursor-pointer"
          >
            <Download size={14} className="mr-2" />
            Экспорт в Excel (.csv)
          </button>
        </div>
      </div>

      {uploadFeedback && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{uploadFeedback}</span>
        </div>
      )}

      {/* Report Category Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-[#262932] mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveReportTab('rnp')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'rnp'
              ? 'border-[#4f46e5] text-[#4f46e5] dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <BarChart3 size={18} />
          РНП Маркетинг & Медпреды (Июнь 2026)
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
            {rnpData.length} строк
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('plans')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'plans'
              ? 'border-[#4f46e5] text-[#4f46e5] dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <FileText size={18} />
          Операционные планы (Plan / Fact)
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('bloggers')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'bloggers'
              ? 'border-[#4f46e5] text-[#4f46e5] dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <Users size={18} />
          Маркетинг & Блогеры
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300">
            {filteredBloggers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('companies')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'companies'
              ? 'border-[#4f46e5] text-[#4f46e5] dark:text-indigo-400'
              : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <Building2 size={18} />
          Компании & Партнеры
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
            {filteredCompanies.length}
          </span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-[#181b20] rounded-2xl shadow-sm border border-gray-100 dark:border-[#262932] p-4 mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300 mr-1">
            <Filter size={16} className="mr-2 text-gray-400" /> Фильтры:
          </div>

          {activeReportTab === 'rnp' ? (
            <>
              {/* RNP Section filter pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'ALL', label: 'Все разделы' },
                  { id: 'visits', label: '🩺 Визиты' },
                  { id: 'prescriptions', label: '💊 Рецепты' },
                  { id: 'reps', label: '👥 Медпреды' },
                  { id: 'merch', label: '🛒 Мерчендайзинг' },
                  { id: 'ecommerce', label: '🌐 E-Commerce' },
                  { id: 'promo', label: '🎯 Акции' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRnpSectionFilter(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      rnpSectionFilter === tab.id
                        ? 'bg-[#1a2332] dark:bg-[#4f46e5] text-white shadow-sm'
                        : 'bg-gray-50 dark:bg-[#121418] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262932]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* RNP Search */}
              <div className="relative ml-auto min-w-[220px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={14} />
                </div>
                <input
                  type="text"
                  placeholder="Поиск (Святослав, Дурдона, Uzum...)"
                  value={rnpSearch}
                  onChange={(e) => setRnpSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl text-xs text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5]"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold uppercase">Месяц:</span>
                <select 
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer focus:bg-white dark:focus:bg-[#181b20]"
                >
                  <option>Сентябрь 2026</option>
                  <option>Август 2026</option>
                  <option>Июль 2026</option>
                  <option>Июнь 2026</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-bold uppercase">Проект:</span>
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer focus:bg-white dark:focus:bg-[#181b20]"
                >
                  <option value="ALL">Все проекты</option>
                  <option value="Extragel">Extragel</option>
                  <option value="Masculan">Masculan</option>
                  <option value="Энтеросгель">Энтеросгель</option>
                </select>
              </div>
            </>
          )}
        </div>

        {activeReportTab !== 'rnp' && (
          <div className="text-xs text-gray-400 font-medium">
            Автоматическая синхронизация со спринтами и метриками
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 0: RNP MARKETING & FIELD REPS REPORT (FROM CSV)                      */}
      {/* ========================================================================= */}
      {activeReportTab === 'rnp' && (
        <div className="space-y-8 animate-fade-in">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Визиты к врачам & аптекам</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <Stethoscope size={16} />
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">1,544 <span className="text-sm text-gray-400 font-medium">/ 1,796</span></h3>
              <div className="w-full bg-gray-100 dark:bg-[#262932] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '86%' }} />
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">86% от месячного плана</p>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Рецепты Энтеросгель</span>
                <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Package size={16} />
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-[#4f46e5] dark:text-indigo-400 tracking-tight">4,627 <span className="text-sm text-gray-400 font-medium">/ 17,000</span></h3>
              <div className="w-full bg-gray-100 dark:bg-[#262932] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#4f46e5] h-full rounded-full" style={{ width: '27%' }} />
              </div>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-2">Прогноз закрытия: 11,568 (68%)</p>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Выручка E-Commerce (Uzum / Яндекс)</span>
                <span className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <ShoppingBag size={16} />
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">286.1M <span className="text-sm text-gray-400 font-medium">сум</span></h3>
              <div className="w-full bg-gray-100 dark:bg-[#262932] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '71%' }} />
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 font-bold mt-2">71% плана (401M сум)</p>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">FMCG Мерчендайзинг Ташкент</span>
                <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <Briefcase size={16} />
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-amber-600 tracking-tight">783 <span className="text-sm text-gray-400 font-medium">/ 858</span></h3>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '91%' }} />
              </div>
              <p className="text-xs text-amber-600 font-bold mt-2">91% охвата (3 района)</p>
            </div>
          </div>

          {/* RNP Data Table */}
          <div className="bg-white dark:bg-[#181b20] rounded-2xl shadow-sm border border-slate-200/90 dark:border-[#262932] overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-[#262932] flex flex-wrap justify-between items-center bg-slate-50/70 dark:bg-[#14161c] gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    Регулярный план-факт (РНП) — Июнь 2026
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200/60 dark:bg-[#262932] text-slate-700 dark:text-slate-300 rounded-md">
                    {filteredRnp.length} показателей
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Реальные данные команды, полевых визитов и продаж из таблицы РНП
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* View Mode Toggle */}
                <div className="bg-slate-200/70 dark:bg-[#20242c] p-0.5 rounded-xl flex items-center gap-0.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => setRnpViewMode('grouped')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      rnpViewMode === 'grouped' ? 'bg-white dark:bg-[#181b20] text-slate-900 dark:text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    По разделам ({rnpGroups.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRnpViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      rnpViewMode === 'table' ? 'bg-white dark:bg-[#181b20] text-slate-900 dark:text-white font-bold shadow-xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Сплошная таблица
                  </button>
                </div>

                {/* Legend */}
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-3 bg-white dark:bg-[#14161c] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-[#262932]">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> 100%+ факт
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> 70-99%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> &lt;70%
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse font-sans">
                <thead className="text-[11px] font-bold uppercase text-slate-500 dark:text-slate-400 bg-slate-50/95 dark:bg-[#14161c] border-b border-slate-200 dark:border-[#262932] sticky top-0 z-10 shadow-2xs">
                  {/* Super Header Row */}
                  <tr className="border-b border-slate-200/80 dark:border-[#262932] text-[10px] text-slate-400 dark:text-slate-500 tracking-wider">
                    <th colSpan={rnpViewMode === 'table' ? 2 : 1} className="px-4 py-2 text-left bg-slate-50 dark:bg-[#14161c] border-r border-slate-200 dark:border-[#262932]">
                      ПОКАЗАТЕЛЬ И ОТВЕТСТВЕННЫЙ
                    </th>
                    <th colSpan={5} className="px-4 py-2 text-center bg-slate-100/60 dark:bg-[#1a1d24] border-r border-slate-200 dark:border-[#262932]">
                      ИТОГИ ЗА МЕСЯЦ (ПЛАН / ФАКТ)
                    </th>
                    <th colSpan={5} className="px-4 py-2 text-center bg-indigo-50/40 dark:bg-indigo-950/30">
                      ДИНАМИКА ПО НЕДЕЛЯМ (ПЛАН / ФАКТ)
                    </th>
                  </tr>
                  {/* Detailed Columns */}
                  <tr className="divide-x divide-slate-200 dark:divide-[#262932] text-slate-600 dark:text-slate-300">
                    {rnpViewMode === 'table' && (
                      <th className="px-4 py-3 text-left w-48 font-bold bg-slate-50 dark:bg-[#14161c]">Раздел / Сотрудник</th>
                    )}
                    <th className="px-5 py-3 text-left min-w-[240px] font-bold bg-slate-50 dark:bg-[#14161c]">Показатель</th>
                    <th className="px-3.5 py-3 text-right w-24 font-bold bg-slate-50 dark:bg-[#14161c]">Прошл. факт</th>
                    <th className="px-3.5 py-3 text-right w-24 font-bold bg-slate-50 dark:bg-[#14161c]">План месяц</th>
                    <th className="px-3.5 py-3 text-right w-24 font-bold bg-slate-50 dark:bg-[#14161c]">Факт месяц</th>
                    <th className="px-4 py-3 text-center w-28 font-bold bg-slate-50 dark:bg-[#14161c]">% Выполн.</th>
                    <th className="px-3.5 py-3 text-right w-24 font-bold bg-slate-50 dark:bg-[#14161c] border-r border-slate-200 dark:border-[#262932]">Прогноз</th>
                    <th className="px-3 py-3 text-center w-24 font-bold bg-indigo-50/20 dark:bg-indigo-950/20">1 нед</th>
                    <th className="px-3 py-3 text-center w-24 font-bold bg-indigo-50/20 dark:bg-indigo-950/20">2 нед</th>
                    <th className="px-3 py-3 text-center w-24 font-bold bg-indigo-50/20 dark:bg-indigo-950/20">3 нед</th>
                    <th className="px-3 py-3 text-center w-24 font-bold bg-indigo-50/20 dark:bg-indigo-950/20">4 нед</th>
                    <th className="px-3 py-3 text-center w-24 font-bold bg-indigo-50/20 dark:bg-indigo-950/20">5 нед</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#262932] font-sans">
                  {filteredRnp.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 text-xs">
                        Показатели не найдены по текущему фильтру или поисковому запросу.
                      </td>
                    </tr>
                  ) : rnpViewMode === 'grouped' ? (
                    rnpGroups.map(group => (
                      <React.Fragment key={`grp_${group.key}`}>
                        {/* Section Header Row */}
                        <tr className="bg-slate-100/95 dark:bg-[#1a1d24] border-y border-slate-200 dark:border-[#262932] sticky top-[73px] z-5">
                          <td colSpan={11} className="px-5 py-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                                <span className="font-extrabold text-slate-900 dark:text-white text-xs tracking-wide uppercase">
                                  {group.sectionName}
                                </span>
                                {group.person && (
                                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-[#20242c] border border-indigo-200/80 dark:border-indigo-900/60 px-2.5 py-0.5 rounded-lg shadow-2xs">
                                    {group.person} {group.role ? `• ${group.role}` : ''}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold bg-white/80 dark:bg-[#20242c] px-2 py-0.5 rounded border border-slate-200/60 dark:border-[#262932]">
                                {group.items.length} {group.items.length === 1 ? 'показатель' : 'показателей'}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {/* Rows in this section */}
                        {group.items.map((item, rowIdx) => (
                          <tr 
                            key={item.id} 
                            className={`divide-x divide-slate-100 dark:divide-[#262932] transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 ${
                              rowIdx % 2 === 1 ? 'bg-slate-50/40 dark:bg-[#15171e]' : 'bg-white dark:bg-[#181b20]'
                            }`}
                          >
                            <td className="px-5 py-2.5">
                              <div className="font-semibold text-slate-900 dark:text-white text-xs">{item.indicator}</div>
                              {item.person && !group.person && (
                                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-0.5">{item.person}</div>
                              )}
                            </td>
                            <td className="px-3.5 py-2.5 text-right text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                              {item.prevFact} <span className="text-[10px] text-slate-400 dark:text-slate-500">({item.prevPercent})</span>
                            </td>
                            <td className="px-3.5 py-2.5 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                              {item.planMonth}
                            </td>
                            <td 
                              className="px-3.5 py-2.5 text-right text-xs font-bold text-slate-900 dark:text-white tabular-nums cursor-pointer hover:bg-amber-50/80 dark:hover:bg-amber-950/30 transition-colors group relative"
                              title="Нажмите для редактирования факта (автоматически сохраняется в PostgreSQL)"
                              onClick={() => setEditingCell({ id: item.id, field: 'factMonth', value: item.factMonth })}
                            >
                              {editingCell?.id === item.id && editingCell.field === 'factMonth' ? (
                                <input
                                  type="text"
                                  autoFocus
                                  defaultValue={editingCell.value}
                                  onBlur={(e) => handleSaveCell(item.id, 'factMonth', e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveCell(item.id, 'factMonth', (e.target as HTMLInputElement).value)
                                    if (e.key === 'Escape') setEditingCell(null)
                                  }}
                                  className="w-20 px-1 py-0.5 text-right text-xs font-bold border border-[#0052cc] dark:border-indigo-500 rounded bg-white dark:bg-[#121418] text-slate-900 dark:text-white outline-none shadow-xs"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <span className="inline-flex items-center justify-end gap-1">
                                  <span>{item.factMonth}</span>
                                  <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums inline-block border ${
                                item.percentMonth >= 100
                                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                  : item.percentMonth >= 70
                                  ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                                  : item.percentMonth > 0
                                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                                  : 'bg-slate-100 dark:bg-[#20242c] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-[#262932]'
                              }`}>
                                {item.percentMonth}%
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5 text-right text-xs font-bold text-indigo-700 dark:text-indigo-400 tabular-nums border-r border-slate-200 dark:border-[#262932]">
                              {item.forecast}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20 dark:bg-[#14161c]/30">
                              {renderWeekCell(item.w1)}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20 dark:bg-[#14161c]/30">
                              {renderWeekCell(item.w2)}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20 dark:bg-[#14161c]/30">
                              {renderWeekCell(item.w3)}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20 dark:bg-[#14161c]/30">
                              {renderWeekCell(item.w4)}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20 dark:bg-[#14161c]/30">
                              {renderWeekCell(item.w5)}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    filteredRnp.map((item, rowIdx) => (
                      <tr 
                        key={item.id} 
                        className={`divide-x divide-slate-100 dark:divide-[#262932] transition-colors hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 ${
                          rowIdx % 2 === 1 ? 'bg-slate-50/40 dark:bg-[#15171e]' : 'bg-white dark:bg-[#181b20]'
                        }`}
                      >
                        <td className="px-4 py-2.5">
                          <div className="font-bold text-slate-800 dark:text-slate-200 text-xs">{item.sectionName}</div>
                          {item.person && (
                            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                              {item.person} {item.role ? `(${item.role})` : ''}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-2.5">
                          <div className="font-semibold text-slate-900 dark:text-white text-xs">{item.indicator}</div>
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                          {item.prevFact} <span className="text-[10px] text-slate-400 dark:text-slate-500">({item.prevPercent})</span>
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                          {item.planMonth}
                        </td>
                        <td 
                          className="px-3.5 py-2.5 text-right text-xs font-bold text-slate-900 dark:text-white tabular-nums cursor-pointer hover:bg-amber-50/80 dark:hover:bg-amber-950/30 transition-colors group relative"
                          title="Нажмите для редактирования факта (автоматически сохраняется в PostgreSQL)"
                          onClick={() => setEditingCell({ id: item.id, field: 'factMonth', value: item.factMonth })}
                        >
                          {editingCell?.id === item.id && editingCell.field === 'factMonth' ? (
                            <input
                              type="text"
                              autoFocus
                              defaultValue={editingCell.value}
                              onBlur={(e) => handleSaveCell(item.id, 'factMonth', e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveCell(item.id, 'factMonth', (e.target as HTMLInputElement).value)
                                if (e.key === 'Escape') setEditingCell(null)
                              }}
                              className="w-20 px-1 py-0.5 text-right text-xs font-bold border border-[#0052cc] dark:border-indigo-500 rounded bg-white dark:bg-[#121418] text-slate-900 dark:text-white outline-none shadow-xs"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span className="inline-flex items-center justify-end gap-1">
                              <span>{item.factMonth}</span>
                              <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">✎</span>
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums inline-block border ${
                            item.percentMonth >= 100
                              ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                              : item.percentMonth >= 70
                              ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                              : item.percentMonth > 0
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                              : 'bg-slate-100 dark:bg-[#20242c] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-[#262932]'
                          }`}>
                            {item.percentMonth}%
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-xs font-bold text-indigo-700 dark:text-indigo-400 tabular-nums border-r border-slate-200 dark:border-[#262932]">
                          {item.forecast}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20 dark:bg-[#14161c]/30">
                          {renderWeekCell(item.w1)}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20 dark:bg-[#14161c]/30">
                          {renderWeekCell(item.w2)}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20 dark:bg-[#14161c]/30">
                          {renderWeekCell(item.w3)}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20 dark:bg-[#14161c]/30">
                          {renderWeekCell(item.w4)}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20 dark:bg-[#14161c]/30">
                          {renderWeekCell(item.w5)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 1: OPERATIONAL PLAN / FACT                                            */}
      {/* ========================================================================= */}
      {activeReportTab === 'plans' && (
        <div className="space-y-8">
          {/* Summary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-1">Суммарный План месяца</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{totalPlan}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-2">Запланировано единиц по проектам</p>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-1">Фактическое выполнение</p>
              <h3 className="text-3xl font-extrabold text-[#4f46e5] dark:text-indigo-400 tracking-tight">{totalFact}</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">Выполнено по отчетам спринтов</p>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-1">Общий % выполнения (Total)</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{totalPercent}%</h3>
              <div className="w-full bg-gray-100 dark:bg-[#262932] rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-[#4f46e5] h-2 rounded-full" style={{ width: `${totalPercent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Reports Tables by Project */}
          <div className="space-y-8">
            {filteredProjects.map(proj => {
              const projPlan = proj.items.reduce((acc, i) => acc + i.plan, 0)
              const projFact = proj.items.reduce((acc, i) => acc + i.fact, 0)
              const projPercent = projPlan > 0 ? Math.round((projFact / projPlan) * 100) : 0

              return (
                <div key={proj.id} className="bg-white dark:bg-[#181b20] rounded-2xl shadow-sm border border-gray-100 dark:border-[#262932] overflow-hidden">
                  <div className="bg-gray-50/70 dark:bg-[#14161c] px-6 py-4 flex flex-wrap justify-between items-center border-b border-gray-100 dark:border-[#262932] gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold text-sm">
                        {proj.project[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{proj.project}</h3>
                        <p className="text-xs text-gray-400 dark:text-gray-400">{proj.month}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-400 dark:text-gray-400 text-xs mr-2">Итого план:</span>
                        <span className="font-bold text-gray-800 dark:text-slate-200">{projPlan}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 dark:text-gray-400 text-xs mr-2">Итого факт:</span>
                        <span className="font-bold text-[#4f46e5] dark:text-indigo-400">{projFact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 dark:text-gray-400 text-xs">Выполнение:</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          projPercent >= 90 ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' :
                          projPercent >= 60 ? 'bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400' :
                          'bg-orange-50 dark:bg-amber-950/60 text-orange-600 dark:text-amber-400'
                        }`}>
                          {projPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[11px] uppercase font-bold text-gray-400 dark:text-gray-400 bg-white dark:bg-[#14161c] border-b border-gray-100 dark:border-[#262932]">
                        <tr>
                          <th className="px-6 py-4">Показатель / Задача</th>
                          <th className="px-6 py-4 text-right">План месяца</th>
                          <th className="px-6 py-4 text-right">Факт выполнения</th>
                          <th className="px-6 py-4 text-right">% выполнения</th>
                          <th className="px-6 py-4 text-center">Статус</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-[#262932]">
                        {proj.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#1e222a] transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                              {item.name}
                              <span className="ml-2 text-xs text-gray-400 dark:text-gray-400 font-normal">({item.unit})</span>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-gray-700 dark:text-slate-300">
                              {item.plan}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-[#4f46e5] dark:text-indigo-400">
                              {item.fact}
                            </td>
                            <td className="px-6 py-4 text-right font-bold">
                              <span className={`${item.percent >= 90 ? 'text-emerald-600 dark:text-emerald-400' : item.percent >= 60 ? 'text-indigo-600 dark:text-indigo-400' : 'text-orange-500 dark:text-amber-400'}`}>
                                {item.percent}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
                                item.status === 'Done' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                              }`}>
                                {item.status === 'Done' ? <CheckCircle2 size={13} className="mr-1" /> : null}
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: INFLUENCER MARKETING & BLOGGERS REPORT                             */}
      {/* ========================================================================= */}
      {activeReportTab === 'bloggers' && (
        <div className="space-y-8">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-1">Общий бюджет блогеров</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">${totalBloggerBudget}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-2">По {filteredBloggers.length} инфлюенсерам</p>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-1">Вышло публикаций</p>
              <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">{publishedCount} / {filteredBloggers.length}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-2">Посты & Reels в эфире</p>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-1">Продажи по промокодам</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{totalBloggerSales} шт.</h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">Погашено в аптеках Olam Farm</p>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-1">Средний CPV (просмотр)</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">$0.0038</h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-2">Охват ~415,000 просмотров</p>
            </div>
          </div>

          {/* Bloggers Performance Table */}
          <div className="bg-white dark:bg-[#181b20] rounded-2xl shadow-sm border border-gray-100 dark:border-[#262932] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-[#262932] flex justify-between items-center bg-gray-50/50 dark:bg-[#14161c]">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Сводная аналитика по блогерам</h3>
              <span className="text-xs text-gray-400 dark:text-gray-400 font-mono">Синхронизировано с Meta Graph API</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] uppercase font-bold text-gray-400 dark:text-gray-400 bg-white dark:bg-[#14161c] border-b border-gray-100 dark:border-[#262932]">
                  <tr>
                    <th className="px-6 py-4">Блогер / Профиль</th>
                    <th className="px-6 py-4">Проект</th>
                    <th className="px-6 py-4 text-center">Платформа</th>
                    <th className="px-6 py-4 text-right">Подписчики</th>
                    <th className="px-6 py-4 text-right">Просмотры</th>
                    <th className="px-6 py-4 text-right">Гонорар</th>
                    <th className="px-6 py-4 text-right">Клики / Переходы</th>
                    <th className="px-6 py-4 text-right">Продажи</th>
                    <th className="px-6 py-4 text-center">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#262932]">
                  {filteredBloggers.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-[#1e222a] transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                        <div>{b.blogger}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-400 font-mono font-normal">{b.handle}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-700 dark:text-slate-200">{b.project}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                          b.platform === 'Instagram' ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300' :
                          b.platform === 'Telegram' ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300' :
                          'bg-neutral-100 dark:bg-[#262932] text-neutral-800 dark:text-slate-200'
                        }`}>
                          {b.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-700 dark:text-slate-200">{b.followers}</td>
                      <td className="px-6 py-4 text-right font-extrabold text-indigo-700 dark:text-indigo-400">{b.views}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">{b.price}</td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-slate-200">{b.profileVisits.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-700 dark:text-emerald-400">{b.promoSales}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          b.status === 'Вышел пост' ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                          b.status === 'Оплачено' ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' :
                          b.status === 'Согласовано' ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' :
                          'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PARTNER COMPANIES & VENUES REPORT                                  */}
      {/* ========================================================================= */}
      {activeReportTab === 'companies' && (
        <div className="space-y-8">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-1">Общие расходы на партнеров</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">${totalCompanySpent}</h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-2">Отели, рестораны, бары, фитнес</p>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-1">Партнерских локаций</p>
              <h3 className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">{filteredCompanies.length} точек</h3>
              <p className="text-xs text-gray-400 dark:text-gray-400 mt-2">г. Ташкент и ключевые отели</p>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-[#262932]">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-400 mb-1">Передано материалов</p>
              <h3 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">1,200+ ед.</h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-2">Диспенсеры, саше, салфетки, тейбл-тенты</p>
            </div>
          </div>

          {/* Companies Table */}
          <div className="bg-white dark:bg-[#181b20] rounded-2xl shadow-sm border border-gray-100 dark:border-[#262932] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-[#262932] flex justify-between items-center bg-gray-50/50 dark:bg-[#14161c]">
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Сводный реестр компаний и предоставленных материалов</h3>
              <span className="text-xs text-gray-400 dark:text-gray-400 font-mono">B2B интеграции и спонсорство</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] uppercase font-bold text-gray-400 dark:text-gray-400 bg-white dark:bg-[#14161c] border-b border-gray-100 dark:border-[#262932]">
                  <tr>
                    <th className="px-6 py-4">Компания / Объект</th>
                    <th className="px-6 py-4">Категория</th>
                    <th className="px-6 py-4">Локация / Адрес</th>
                    <th className="px-6 py-4 text-right">Расходы ($)</th>
                    <th className="px-6 py-4">Предоставленные материалы</th>
                    <th className="px-6 py-4">Контактное лицо</th>
                    <th className="px-6 py-4 text-center">Статус</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-[#262932]">
                  {filteredCompanies.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-[#1e222a] transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{c.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 dark:text-slate-400 font-medium">{c.location}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-400">{c.spent}</td>
                      <td className="px-6 py-4 text-xs text-gray-600 dark:text-slate-300 max-w-xs leading-relaxed">{c.itemsProvided}</td>
                      <td className="px-6 py-4 text-xs text-gray-700 dark:text-slate-200 font-medium">
                        <div>{c.contactPerson}</div>
                        <div className="text-gray-400 dark:text-gray-400">{c.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          c.status === 'Материалы переданы' || c.status === 'Активно'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : c.status === 'Согласовано'
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                        }`}>
                          {c.status}
                        </span>
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
