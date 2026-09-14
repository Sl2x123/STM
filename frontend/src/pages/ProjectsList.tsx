import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, MoreVertical, Users, Plus, Calendar, ArrowUpRight, ArrowLeft } from 'lucide-react'
import { api } from '../lib/api'

const initialProjects = [
  {
    id: 1,
    name: 'Extragel (Охлаждающий гель)',
    description: 'Комплексное продвижение фармацевтического бренда: полевые визиты медицинских представителей в аптечные сети и ЛПУ, работа с врачами-специалистами и инфлюенс-маркетинг.',
    period: '01.06.2026 — 31.12.2026',
    members: 4,
    tasksCount: 5,
    progress: 86,
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300',
    avatarChar: 'E'
  },
  {
    id: 2,
    name: 'Masculan (Премиум-дистрибуция)',
    description: 'Масштабная дистрибуция немецкого качества: представленность в аптечных сетях и FMCG-ритейле, промостойки, мерчендайзинг и омниканальные рекламные кампании.',
    period: '01.06.2026 — 31.12.2026',
    members: 6,
    tasksCount: 8,
    progress: 75,
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300',
    avatarChar: 'M'
  },
  {
    id: 3,
    name: 'Энтеросгель (Энтеросорбент №1)',
    description: 'Взаимодействие с ключевыми сетями аптек (36.6, Oxymed), проведение регулярных фармкружков для провизоров, выкладка первой линии и работа с педиатрами.',
    period: '01.06.2026 — 31.12.2026',
    members: 3,
    tasksCount: 6,
    progress: 80,
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
    avatarChar: 'Э'
  },
  {
    id: 4,
    name: 'Фитосепт (Антисептическая линейка)',
    description: 'Сезонная маркетинговая кампания спреев и пастилок: стимулирование первичных продаж, оформление витрин, работа с терапевтами и проведение промо-акций.',
    period: '01.06.2026 — 31.12.2026',
    members: 2,
    tasksCount: 4,
    progress: 65,
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300',
    avatarChar: 'Ф'
  }
]

export default function ProjectsList() {
  const [projects, setProjects] = useState(initialProjects)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')

  // Load projects from backend API
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await api.get('/projects/')
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const colors = [
            'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300',
            'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300',
            'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300',
            'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300'
          ]
          const mapped = res.data.map((p: any, idx: number) => {
            const fallback = initialProjects.find(ip => ip.id === p.id) || initialProjects[idx % initialProjects.length]
            return {
              id: p.id,
              name: fallback ? fallback.name : p.name,
              description: fallback ? fallback.description : p.description,
              period: '01.06.2026 — 31.12.2026',
              members: fallback ? fallback.members : 4,
              tasksCount: fallback ? fallback.tasksCount : 5,
              progress: fallback ? fallback.progress : 75,
              color: colors[idx % colors.length],
              avatarChar: p.name.charAt(0).toUpperCase()
            }
          })
          setProjects(mapped)
        }
      } catch (err) {
        console.warn('API error loading projects:', err)
      }
    }
    fetchProjects()
  }, [])

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    try {
      const res = await api.post('/projects/', {
        name: newProjectName.trim(),
        description: newProjectDesc.trim() || 'Комплексная маркетинговая кампания',
        start_date: '2026-06-01',
        end_date: '2026-12-31'
      })
      const p = res.data
      const newProj = {
        id: p.id,
        name: p.name,
        description: p.description,
        period: '01.06.2026 — 31.12.2026',
        members: 1,
        tasksCount: 0,
        progress: 0,
        color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300',
        avatarChar: p.name[0].toUpperCase()
      }
      setProjects(prev => [newProj, ...prev])
    } catch (err) {
      console.error('Failed to create project in backend:', err)
      const newProj = {
        id: Date.now(),
        name: newProjectName.trim(),
        description: newProjectDesc.trim() || 'Описание проекта',
        period: '01.06.2026 — 31.12.2026',
        members: 1,
        tasksCount: 0,
        progress: 0,
        color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300',
        avatarChar: newProjectName.trim()[0].toUpperCase()
      }
      setProjects(prev => [newProj, ...prev])
    }

    setNewProjectName('')
    setNewProjectDesc('')
    setIsModalOpen(false)
  }

  // Full-Page View for Creating a Project
  if (isModalOpen) {
    return (
      <div className="max-w-4xl mx-auto font-sans pb-16 animate-in fade-in duration-150">
        {/* Breadcrumb / Back */}
        <button 
          onClick={() => setIsModalOpen(false)} 
          className="inline-flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm font-semibold mb-6 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Назад к проектам
        </button>

        <div className="bg-white dark:bg-[#181b20] rounded-3xl p-8 lg:p-10 border border-slate-200/80 dark:border-[#262932] shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-5 mb-8 pb-6 border-b border-slate-100 dark:border-[#262932]">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0">
              <FolderKanban size={32} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">Создание нового проекта</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Задайте название бренда, цели продвижения, параметры спринтов и ответственных</p>
            </div>
          </div>

          <form onSubmit={handleCreateProject} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-2">
                  Название проекта *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Например: Фитосепт, Extragel, Нурофен" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#121418] border border-slate-200 dark:border-[#2b303c] text-slate-900 dark:text-white rounded-xl px-4 py-3 text-base font-semibold focus:bg-white dark:focus:bg-[#181b20] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-2">
                  Период кампании
                </label>
                <input 
                  type="text" 
                  placeholder="01.10.2026 — 31.10.2026" 
                  className="w-full bg-slate-50 dark:bg-[#121418] border border-slate-200 dark:border-[#2b303c] text-slate-900 dark:text-white rounded-xl px-4 py-3 text-base font-medium focus:bg-white dark:focus:bg-[#181b20] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 dark:text-slate-400 mb-2">
                Описание / Стратегическая цель проекта
              </label>
              <textarea 
                rows={5}
                placeholder="Подробно опишите цели проекта, целевую аудиторию, ключевые каналы продвижения, задачи для команды..." 
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#121418] border border-slate-200 dark:border-[#2b303c] text-slate-900 dark:text-white rounded-xl p-4 text-sm font-medium focus:bg-white dark:focus:bg-[#181b20] focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] leading-relaxed transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
              />
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-[#262932]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#262932] rounded-xl transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-8 py-3 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Создать проект
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto font-sans pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Проекты и Бренды
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base font-medium mt-1.5">
            Управление фармацевтическими кампаниями, спринтами, полевой командой и партнерскими интеграциями
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#5b52f6] hover:bg-[#4f46e5] text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
        >
          <Plus size={18} className="mr-2" />
          Создать проект
        </button>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Link 
            to={`/project/${project.id}`} 
            key={project.id}
            className="bg-white dark:bg-[#181b20] rounded-2xl p-6 lg:p-7 border border-slate-200/80 dark:border-[#262932] shadow-sm hover:shadow-lg dark:hover:border-indigo-500/50 transition-all hover:border-indigo-300 flex flex-col justify-between group"
          >
            <div>
              {/* Project Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl ${project.color} flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform shadow-xs`}>
                  {project.avatarChar}
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#262932] transition-colors cursor-pointer"
                >
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Title & Desc */}
              <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-[#4f46e5] dark:group-hover:text-indigo-400 transition-colors mb-2.5 flex items-center tracking-tight">
                {project.name}
                <ArrowUpRight size={18} className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[#4f46e5] ml-1.5 shrink-0" />
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-5 leading-relaxed min-h-[60px]">
                {project.description}
              </p>
            </div>

            <div>
              {/* Timeline */}
              <div className="flex items-center text-sm font-semibold text-slate-700 dark:text-slate-200 mb-5 bg-slate-100/90 dark:bg-[#20242c] px-3.5 py-2.5 rounded-xl border border-slate-200/60 dark:border-[#2b303c]">
                <Calendar size={16} className="mr-2 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <span>{project.period}</span>
              </div>

              {/* Progress & Meta */}
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-[#262932]">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 dark:text-slate-400 font-semibold">Прогресс выполнения</span>
                  <span className="font-extrabold text-base text-[#4f46e5] dark:text-indigo-400">{project.progress}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 dark:bg-[#262932] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-[#4f46e5] rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                {/* Footer info: Members & Tasks */}
                <div className="flex justify-between items-center pt-3 text-sm">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-indigo-500 dark:text-indigo-400" />
                    <span className="font-bold text-slate-800 dark:text-slate-200">{project.members}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1.5 font-medium">участника</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{project.tasksCount}</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-1.5 font-medium">направлений</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
