import { useState } from 'react'
import { FileText, Download, Calendar, Filter, CheckCircle2, AlertCircle } from 'lucide-react'

const reportData = [
  {
    id: 1,
    project: 'Extragel',
    month: 'Сентябрь 2026',
    items: [
      { name: 'Аптечные визиты Ташкент', plan: 120, fact: 95, unit: 'визитов', percent: 79, status: 'In Progress' },
      { name: 'Визиты к врачам', plan: 80, fact: 80, unit: 'визитов', percent: 100, status: 'Done' },
      { name: 'Фармаконадзор (ФК)', plan: 20, fact: 14, unit: 'отчетов', percent: 70, status: 'In Progress' },
    ]
  },
  {
    id: 2,
    project: 'Masculan',
    month: 'Сентябрь 2026',
    items: [
      { name: 'Аптечные визиты Самарканд', plan: 90, fact: 90, unit: 'визитов', percent: 100, status: 'Done' },
      { name: 'Установка промостоек', plan: 15, fact: 6, unit: 'штук', percent: 40, status: 'Not Done' },
    ]
  },
  {
    id: 3,
    project: 'Энтеросгель',
    month: 'Сентябрь 2026',
    items: [
      { name: 'Фармкружки по сетям 36.6', plan: 30, fact: 28, unit: 'кружков', percent: 93, status: 'Done' },
      { name: 'Мерчендайзинг витрин', plan: 50, fact: 45, unit: 'точек', percent: 90, status: 'Done' },
    ]
  }
]

export default function Reports() {
  const [selectedMonth, setSelectedMonth] = useState('Сентябрь 2026')
  const [selectedProject, setSelectedProject] = useState('ALL')

  const filteredProjects = reportData.filter(p => selectedProject === 'ALL' || p.project === selectedProject)

  // Totals calculation
  let totalPlan = 0
  let totalFact = 0
  filteredProjects.forEach(p => {
    p.items.forEach(i => {
      totalPlan += i.plan
      totalFact += i.fact
    })
  })
  const totalPercent = totalPlan > 0 ? Math.round((totalFact / totalPlan) * 100) : 0

  return (
    <div className="max-w-[1400px] mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Отчёты Plan / Fact</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Сводный отчёт выполнения месячных планов по всем проектам и показателям
          </p>
        </div>
        <button 
          onClick={() => alert('Экспорт отчёта в Excel сформирован!')}
          className="bg-[#5b52f6] hover:bg-[#4f46e5] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center transition-all shadow-sm"
        >
          <Download size={18} className="mr-2" />
          Экспорт в Excel
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Суммарный План месяца</p>
          <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{totalPlan}</h3>
          <p className="text-xs text-gray-400 mt-2">Запланировано по всем проектам</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Фактическое выполнение</p>
          <h3 className="text-3xl font-extrabold text-[#4f46e5] tracking-tight">{totalFact}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2">Сумма всех выполненных единиц</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Общий % выполнения (Total)</p>
          <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{totalPercent}%</h3>
          <div className="w-full bg-gray-100 rounded-full h-2 mt-3 overflow-hidden">
            <div className="bg-[#4f46e5] h-2 rounded-full" style={{ width: `${totalPercent}%` }}></div>
          </div>
        </div>
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
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 outline-none cursor-pointer"
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
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 outline-none cursor-pointer"
            >
              <option value="ALL">Все проекты</option>
              <option value="Extragel">Extragel</option>
              <option value="Masculan">Masculan</option>
              <option value="Энтеросгель">Энтеросгель</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-gray-400 font-medium">
          Формируется автоматически на основе спринтов
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
              {/* Project Header */}
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

              {/* Items Table */}
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
  )
}

