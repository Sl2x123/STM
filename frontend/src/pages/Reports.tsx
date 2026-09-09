import { useState } from 'react'
import { 
  FileText, Download, Calendar, Filter, CheckCircle2, AlertCircle, 
  Users, Building2, TrendingUp, DollarSign, Eye, MapPin, Package, ExternalLink, Sparkles 
} from 'lucide-react'

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
  const [activeReportTab, setActiveReportTab] = useState<'plans' | 'bloggers' | 'companies'>('plans')
  const [selectedMonth, setSelectedMonth] = useState('Сентябрь 2026')
  const [selectedProject, setSelectedProject] = useState('ALL')

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

    if (activeReportTab === 'plans') {
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
        <button 
          onClick={handleExportExcel}
          className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center transition-all shadow-sm cursor-pointer"
        >
          <Download size={18} className="mr-2" />
          Экспорт в Excel (.csv)
        </button>
      </div>

      {/* Report Category Switcher */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-8 overflow-x-auto">
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
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center text-sm font-semibold text-gray-600 mr-2">
            <Filter size={16} className="mr-2 text-gray-400" /> Фильтры:
          </div>

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
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Автоматическая синхронизация со спринтами и метриками
        </div>
      </div>

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
