import React, { useState, useRef, useMemo } from 'react'
import { 
  FileText, Download, Filter, CheckCircle2, 
  Users, Building2, Package,
  Upload, Search, ShoppingBag, Stethoscope, Briefcase, BarChart3
} from 'lucide-react'
import { initialRnpData, RnpItem } from '../data/rnpData'


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
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      return <span className="text-slate-300 font-sans text-xs select-none">—</span>
    }
    const planVal = parseFloat(planTrim.replace(/,/g, '')) || 0
    const factVal = parseFloat(factTrim.replace(/,/g, '')) || 0
    const isSuccess = factVal >= planVal && factVal > 0

    return (
      <div className="inline-flex items-center justify-center gap-1 font-sans text-xs">
        <span className="text-slate-400 font-normal">{planTrim || '0'}</span>
        <span className="text-slate-300 font-light">/</span>
        <span className={`font-bold tabular-nums ${
          isSuccess 
            ? 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60' 
            : 'text-slate-900'
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
  const filteredBloggers = bloggersReportData.filter(b => selectedProject === 'ALL' || b.project === selectedProject)
  const totalBloggerBudget = filteredBloggers.reduce((sum, b) => sum + b.priceNum, 0)
  const totalBloggerSales = filteredBloggers.reduce((sum, b) => sum + b.promoSales, 0)
  const publishedCount = filteredBloggers.filter(b => b.status === 'Вышел пост').length

  // Filtered Companies
  const filteredCompanies = companiesReportData.filter(c => selectedProject === 'ALL' || c.project === selectedProject)
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

  const handleUploadRnpCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
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
            setUploadFeedback(`Успешно загружено ${parsedItems.length} строк из файла ${file.name}`)
            setTimeout(() => setUploadFeedback(null), 4000)
          }
        }
      } catch (err) {
        console.error(err)
        setUploadFeedback('Ошибка при разборе файла CSV')
      }
    }
    reader.readAsText(file, 'utf-8')
  }

  return (
    <div className="max-w-[1500px] mx-auto font-sans pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Отчёты и Аналитика</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Сводные отчёты по операционным планам, инфлюенс-маркетингу и партнерским интеграциям
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUploadRnpCsv} 
            accept=".csv" 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/90 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center transition-all shadow-sm cursor-pointer"
            title="Загрузить файл РНП за другой месяц"
          >
            <Upload size={17} className="mr-2 text-[#4f46e5]" />
            Загрузить CSV (РНП)
          </button>

          <button 
            onClick={handleExportExcel}
            className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center transition-all shadow-sm cursor-pointer"
          >
            <Download size={18} className="mr-2" />
            Экспорт в Excel (.csv)
          </button>
        </div>
      </div>

      {uploadFeedback && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{uploadFeedback}</span>
        </div>
      )}

      {/* Report Category Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-8 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveReportTab('rnp')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'rnp'
              ? 'border-[#4f46e5] text-[#4f46e5]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <BarChart3 size={18} />
          РНП Маркетинг & Медпреды (Июнь 2026)
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
            {rnpData.length} строк
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('plans')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'plans'
              ? 'border-[#4f46e5] text-[#4f46e5]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
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
              ? 'border-[#4f46e5] text-[#4f46e5]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Users size={18} />
          Маркетинг & Блогеры
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-pink-700">
            {filteredBloggers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReportTab('companies')}
          className={`pb-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            activeReportTab === 'companies'
              ? 'border-[#4f46e5] text-[#4f46e5]'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Building2 size={18} />
          Компании & Партнеры
          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
            {filteredCompanies.length}
          </span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <div className="flex items-center text-sm font-semibold text-gray-600 mr-1">
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
                        ? 'bg-[#1a2332] text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
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
                  className="w-full pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:bg-white focus:border-[#4f46e5]"
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
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 outline-none cursor-pointer focus:bg-white"
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
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 outline-none cursor-pointer focus:bg-white"
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Визиты к врачам & аптекам</span>
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Stethoscope size={16} />
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">1,544 <span className="text-sm text-gray-400 font-medium">/ 1,796</span></h3>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '86%' }} />
              </div>
              <p className="text-xs text-emerald-600 font-bold mt-2">86% от месячного плана</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Рецепты Энтеросгель</span>
                <span className="w-8 h-8 rounded-xl bg-indigo-50 text-[#4f46e5] flex items-center justify-center font-bold">
                  <Package size={16} />
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-[#4f46e5] tracking-tight">4,627 <span className="text-sm text-gray-400 font-medium">/ 17,000</span></h3>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#4f46e5] h-full rounded-full" style={{ width: '27%' }} />
              </div>
              <p className="text-xs text-indigo-600 font-semibold mt-2">Прогноз закрытия: 11,568 (68%)</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Выручка E-Commerce (Uzum / Яндекс)</span>
                <span className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <ShoppingBag size={16} />
                </span>
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">286.1M <span className="text-sm text-gray-400 font-medium">сум</span></h3>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full" style={{ width: '71%' }} />
              </div>
              <p className="text-xs text-purple-600 font-bold mt-2">71% плана (401M сум)</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">FMCG Мерчендайзинг Ташкент</span>
                <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
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
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center bg-slate-50/70 gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-bold text-slate-900 text-base">
                    Регулярный план-факт (РНП) — Июнь 2026
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-200/60 text-slate-700 rounded-md">
                    {filteredRnp.length} показателей
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Реальные данные команды, полевых визитов и продаж из таблицы РНП
                </p>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* View Mode Toggle */}
                <div className="bg-slate-200/70 p-0.5 rounded-xl flex items-center gap-0.5 text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setRnpViewMode('grouped')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      rnpViewMode === 'grouped' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    По разделам ({rnpGroups.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setRnpViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      rnpViewMode === 'table' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Сплошная таблица
                  </button>
                </div>

                {/* Legend */}
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
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
                <thead className="text-[11px] font-bold uppercase text-slate-500 bg-slate-50/95 border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                  {/* Super Header Row */}
                  <tr className="border-b border-slate-200/80 text-[10px] text-slate-400 tracking-wider">
                    <th colSpan={rnpViewMode === 'table' ? 2 : 1} className="px-4 py-2 text-left bg-slate-50 border-r border-slate-200">
                      ПОКАЗАТЕЛЬ И ОТВЕТСТВЕННЫЙ
                    </th>
                    <th colSpan={5} className="px-4 py-2 text-center bg-slate-100/60 border-r border-slate-200">
                      ИТОГИ ЗА МЕСЯЦ (ПЛАН / ФАКТ)
                    </th>
                    <th colSpan={5} className="px-4 py-2 text-center bg-indigo-50/40">
                      ДИНАМИКА ПО НЕДЕЛЯМ (ПЛАН / ФАКТ)
                    </th>
                  </tr>
                  {/* Detailed Columns */}
                  <tr className="divide-x divide-slate-200 text-slate-600">
                    {rnpViewMode === 'table' && (
                      <th className="px-4 py-3 text-left w-48 font-bold bg-slate-50">Раздел / Сотрудник</th>
                    )}
                    <th className="px-5 py-3 text-left min-w-[240px] font-bold bg-slate-50">Показатель</th>
                    <th className="px-3.5 py-3 text-right w-24 font-bold bg-slate-50">Прошл. факт</th>
                    <th className="px-3.5 py-3 text-right w-24 font-bold bg-slate-50">План месяц</th>
                    <th className="px-3.5 py-3 text-right w-24 font-bold bg-slate-50">Факт месяц</th>
                    <th className="px-4 py-3 text-center w-28 font-bold bg-slate-50">% Выполн.</th>
                    <th className="px-3.5 py-3 text-right w-24 font-bold bg-slate-50 border-r border-slate-200">Прогноз</th>
                    <th className="px-3 py-3 text-center w-24 font-bold bg-indigo-50/20">1 нед</th>
                    <th className="px-3 py-3 text-center w-24 font-bold bg-indigo-50/20">2 нед</th>
                    <th className="px-3 py-3 text-center w-24 font-bold bg-indigo-50/20">3 нед</th>
                    <th className="px-3 py-3 text-center w-24 font-bold bg-indigo-50/20">4 нед</th>
                    <th className="px-3 py-3 text-center w-24 font-bold bg-indigo-50/20">5 нед</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredRnp.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="px-6 py-12 text-center text-slate-400 text-xs">
                        Показатели не найдены по текущему фильтру или поисковому запросу.
                      </td>
                    </tr>
                  ) : rnpViewMode === 'grouped' ? (
                    rnpGroups.map(group => (
                      <React.Fragment key={`grp_${group.key}`}>
                        {/* Section Header Row */}
                        <tr className="bg-slate-100/95 border-y border-slate-200 sticky top-[73px] z-5">
                          <td colSpan={11} className="px-5 py-2.5">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                                <span className="font-extrabold text-slate-900 text-xs tracking-wide uppercase">
                                  {group.sectionName}
                                </span>
                                {group.person && (
                                  <span className="text-xs font-bold text-indigo-700 bg-white border border-indigo-200/80 px-2.5 py-0.5 rounded-lg shadow-2xs">
                                    {group.person} {group.role ? `• ${group.role}` : ''}
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 font-semibold bg-white/80 px-2 py-0.5 rounded border border-slate-200/60">
                                {group.items.length} {group.items.length === 1 ? 'показатель' : 'показателей'}
                              </span>
                            </div>
                          </td>
                        </tr>
                        {/* Rows in this section */}
                        {group.items.map((item, rowIdx) => (
                          <tr 
                            key={item.id} 
                            className={`divide-x divide-slate-100 transition-colors hover:bg-indigo-50/30 ${
                              rowIdx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                            }`}
                          >
                            <td className="px-5 py-2.5">
                              <div className="font-semibold text-slate-900 text-xs">{item.indicator}</div>
                              {item.person && !group.person && (
                                <div className="text-[10px] text-indigo-600 font-medium mt-0.5">{item.person}</div>
                              )}
                            </td>
                            <td className="px-3.5 py-2.5 text-right text-xs text-slate-500 tabular-nums">
                              {item.prevFact} <span className="text-[10px] text-slate-400">({item.prevPercent})</span>
                            </td>
                            <td className="px-3.5 py-2.5 text-right text-xs font-semibold text-slate-700 tabular-nums">
                              {item.planMonth}
                            </td>
                            <td className="px-3.5 py-2.5 text-right text-xs font-bold text-slate-900 tabular-nums">
                              {item.factMonth}
                            </td>
                            <td className="px-4 py-2.5 text-center">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums inline-block border ${
                                item.percentMonth >= 100
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : item.percentMonth >= 70
                                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                                  : item.percentMonth > 0
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-200'
                              }`}>
                                {item.percentMonth}%
                              </span>
                            </td>
                            <td className="px-3.5 py-2.5 text-right text-xs font-bold text-indigo-700 tabular-nums border-r border-slate-200">
                              {item.forecast}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20">
                              {renderWeekCell(item.w1)}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20">
                              {renderWeekCell(item.w2)}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20">
                              {renderWeekCell(item.w3)}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20">
                              {renderWeekCell(item.w4)}
                            </td>
                            <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20">
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
                        className={`divide-x divide-slate-100 transition-colors hover:bg-indigo-50/30 ${
                          rowIdx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                        }`}
                      >
                        <td className="px-4 py-2.5">
                          <div className="font-bold text-slate-800 text-xs">{item.sectionName}</div>
                          {item.person && (
                            <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                              {item.person} {item.role ? `(${item.role})` : ''}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-2.5">
                          <div className="font-semibold text-slate-900 text-xs">{item.indicator}</div>
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-xs text-slate-500 tabular-nums">
                          {item.prevFact} <span className="text-[10px] text-slate-400">({item.prevPercent})</span>
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-xs font-semibold text-slate-700 tabular-nums">
                          {item.planMonth}
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-xs font-bold text-slate-900 tabular-nums">
                          {item.factMonth}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums inline-block border ${
                            item.percentMonth >= 100
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : item.percentMonth >= 70
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                              : item.percentMonth > 0
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}>
                            {item.percentMonth}%
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-right text-xs font-bold text-indigo-700 tabular-nums border-r border-slate-200">
                          {item.forecast}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20">
                          {renderWeekCell(item.w1)}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20">
                          {renderWeekCell(item.w2)}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20">
                          {renderWeekCell(item.w3)}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20">
                          {renderWeekCell(item.w4)}
                        </td>
                        <td className="px-3 py-2.5 text-center tabular-nums bg-slate-50/20">
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Суммарный План месяца</p>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{totalPlan}</h3>
              <p className="text-xs text-gray-400 mt-2">Запланировано единиц по проектам</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Фактическое выполнение</p>
              <h3 className="text-3xl font-extrabold text-[#4f46e5] tracking-tight">{totalFact}</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-2">Выполнено по отчетам спринтов</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Общий % выполнения (Total)</p>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{totalPercent}%</h3>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
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
                <div key={proj.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50/70 px-6 py-4 flex flex-wrap justify-between items-center border-b border-gray-100 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 text-[#4f46e5] rounded-xl flex items-center justify-center font-bold text-sm">
                        {proj.project[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{proj.project}</h3>
                        <p className="text-xs text-gray-400">{proj.month}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-400 text-xs mr-2">Итого план:</span>
                        <span className="font-bold text-gray-800">{projPlan}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs mr-2">Итого факт:</span>
                        <span className="font-bold text-[#4f46e5]">{projFact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Выполнение:</span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          projPercent >= 90 ? 'bg-emerald-50 text-emerald-600' :
                          projPercent >= 60 ? 'bg-indigo-50 text-[#4f46e5]' :
                          'bg-orange-50 text-orange-600'
                        }`}>
                          {projPercent}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-[11px] uppercase font-bold text-gray-400 bg-white border-b border-gray-100">
                        <tr>
                          <th className="px-6 py-4">Показатель / Задача</th>
                          <th className="px-6 py-4 text-right">План месяца</th>
                          <th className="px-6 py-4 text-right">Факт выполнения</th>
                          <th className="px-6 py-4 text-right">% выполнения</th>
                          <th className="px-6 py-4 text-center">Статус</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {proj.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-900">
                              {item.name}
                              <span className="ml-2 text-xs text-gray-400 font-normal">({item.unit})</span>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-gray-700">
                              {item.plan}
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-[#4f46e5]">
                              {item.fact}
                            </td>
                            <td className="px-6 py-4 text-right font-bold">
                              <span className={`${item.percent >= 90 ? 'text-emerald-600' : item.percent >= 60 ? 'text-indigo-600' : 'text-orange-500'}`}>
                                {item.percent}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full ${
                                item.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Общий бюджет блогеров</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 tracking-tight">${totalBloggerBudget}</h3>
              <p className="text-xs text-gray-400 mt-2">По {filteredBloggers.length} инфлюенсерам</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Вышло публикаций</p>
              <h3 className="text-3xl font-extrabold text-indigo-600 tracking-tight">{publishedCount} / {filteredBloggers.length}</h3>
              <p className="text-xs text-gray-400 mt-2">Посты & Reels в эфире</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Продажи по промокодам</p>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{totalBloggerSales} шт.</h3>
              <p className="text-xs text-emerald-600 font-semibold mt-2">Погашено в аптеках Olam Farm</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Средний CPV (просмотр)</p>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">$0.0038</h3>
              <p className="text-xs text-indigo-600 font-semibold mt-2">Охват ~415,000 просмотров</p>
            </div>
          </div>

          {/* Bloggers Performance Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-base">Сводная аналитика по блогерам</h3>
              <span className="text-xs text-gray-400 font-mono">Синхронизировано с Meta Graph API</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] uppercase font-bold text-gray-400 bg-white border-b border-gray-100">
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
                <tbody className="divide-y divide-gray-50">
                  {filteredBloggers.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        <div>{b.blogger}</div>
                        <div className="text-xs text-gray-400 font-mono font-normal">{b.handle}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-700">{b.project}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                          b.platform === 'Instagram' ? 'bg-pink-50 text-pink-700' :
                          b.platform === 'Telegram' ? 'bg-sky-50 text-sky-700' :
                          'bg-neutral-100 text-neutral-800'
                        }`}>
                          {b.platform}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-700">{b.followers}</td>
                      <td className="px-6 py-4 text-right font-extrabold text-indigo-700">{b.views}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">{b.price}</td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-800">{b.profileVisits.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-700">{b.promoSales}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          b.status === 'Вышел пост' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          b.status === 'Оплачено' ? 'bg-blue-50 text-blue-700' :
                          b.status === 'Согласовано' ? 'bg-purple-50 text-purple-700' :
                          'bg-amber-50 text-amber-700'
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
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Общие расходы на партнеров</p>
              <h3 className="text-3xl font-extrabold text-emerald-600 tracking-tight">${totalCompanySpent}</h3>
              <p className="text-xs text-gray-400 mt-2">Отели, рестораны, бары, фитнес</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Партнерских локаций</p>
              <h3 className="text-3xl font-extrabold text-indigo-600 tracking-tight">{filteredCompanies.length} точек</h3>
              <p className="text-xs text-gray-400 mt-2">г. Ташкент и ключевые отели</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Передано материалов</p>
              <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">1,200+ ед.</h3>
              <p className="text-xs text-indigo-600 font-semibold mt-2">Диспенсеры, саше, салфетки, тейбл-тенты</p>
            </div>
          </div>

          {/* Companies Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-base">Сводный реестр компаний и предоставленных материалов</h3>
              <span className="text-xs text-gray-400 font-mono">B2B интеграции и спонсорство</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[11px] uppercase font-bold text-gray-400 bg-white border-b border-gray-100">
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
                <tbody className="divide-y divide-gray-50">
                  {filteredCompanies.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-gray-900">{c.name}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
                          {c.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500 font-medium">{c.location}</td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600">{c.spent}</td>
                      <td className="px-6 py-4 text-xs text-gray-600 max-w-xs leading-relaxed">{c.itemsProvided}</td>
                      <td className="px-6 py-4 text-xs text-gray-700 font-medium">
                        <div>{c.contactPerson}</div>
                        <div className="text-gray-400">{c.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          c.status === 'Материалы переданы' || c.status === 'Активно'
                            ? 'bg-emerald-50 text-emerald-700'
                            : c.status === 'Согласовано'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
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
