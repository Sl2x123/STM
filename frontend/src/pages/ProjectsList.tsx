import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, MoreVertical, Users, Plus, Calendar, X, ArrowUpRight, ArrowLeft } from 'lucide-react'

const initialProjects = [
  { 
    id: 1, 
    name: 'Extragel', 
    description: 'Продвижение и продажи Extragel, работа с аптеками и врачами', 
    period: '01.09.2026 — 30.09.2026',
    members: 4, 
    tasksCount: 5, 
    progress: 66,
    color: 'bg-indigo-50 text-[#4f46e5]',
    avatarChar: 'E'
  },
  { 
    id: 2, 
    name: 'Masculan', 
    description: 'Задачи по направлению Masculan, рекламные кампании и дистрибуция', 
    period: '01.09.2026 — 30.09.2026',
    members: 6, 
    tasksCount: 8, 
    progress: 40,
    color: 'bg-blue-50 text-blue-600',
    avatarChar: 'M'
  },
  { 
    id: 3, 
    name: 'Энтеросгель', 
    description: 'Работа с ключевыми сетями аптек, фармкружки и мерчендайзинг', 
    period: '01.09.2026 — 30.09.2026',
    members: 3, 
    tasksCount: 6, 
    progress: 80,
    color: 'bg-emerald-50 text-emerald-600',
    avatarChar: 'Э'
  },
]

export default function ProjectsList() {
  const [projects, setProjects] = useState(initialProjects)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newProjectName, setNewProjectName] = useState('')
  const [newProjectDesc, setNewProjectDesc] = useState('')

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    const newProj = {
      id: Date.now(),
      name: newProjectName.trim(),
      description: newProjectDesc.trim() || 'Описание проекта',
      period: '01.09.2026 — 30.09.2026',
      members: 1,
      tasksCount: 0,
      progress: 0,
      color: 'bg-purple-50 text-purple-600',
      avatarChar: newProjectName.trim()[0].toUpperCase()
    }

    setProjects([newProj, ...projects])
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
          className="inline-flex items-center text-gray-500 hover:text-gray-900 text-sm font-semibold mb-6 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Назад к проектам
        </button>

        <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm">
          {/* Header */}
          <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
            <div className="w-16 h-16 bg-indigo-50 text-[#4f46e5] rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0">
              <FolderKanban size={32} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900">Создание нового проекта</h1>
              <p className="text-sm text-gray-500 mt-1">Задайте название, фокус, цели и параметры для вашей маркетинговой или бизнес-кампании</p>
            </div>
          </div>

          <form onSubmit={handleCreateProject} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                  Название проекта *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Например: Фитосепт, Extragel, Нурофен" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                  Период кампании
                </label>
                <input 
                  type="text" 
                  placeholder="01.10.2026 — 31.10.2026" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-base font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                Описание / Стратегическая цель проекта
              </label>
              <textarea 
                rows={5}
                placeholder="Подробно опишите цели проекта, целевую аудиторию, ключевые каналы продвижения, задачи для команды..." 
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] leading-relaxed transition-all"
              />
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Мои Проекты</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Выберите проект для планирования задач, спринтов и фиксации факта
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#5b52f6] hover:bg-[#4f46e5] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center transition-all shadow-sm cursor-pointer"
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
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 flex flex-col justify-between group"
          >
            <div>
              {/* Project Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${project.color} flex items-center justify-center font-bold text-lg group-hover:scale-105 transition-transform`}>
                  {project.avatarChar}
                </div>
                <button 
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Title & Desc */}
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#4f46e5] transition-colors mb-1.5 flex items-center">
                {project.name}
                <ArrowUpRight size={16} className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-[#4f46e5] ml-1" />
              </h3>
              <p className="text-gray-500 text-xs line-clamp-2 mb-4 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div>
              {/* Timeline */}
              <div className="flex items-center text-xs text-gray-400 mb-4 bg-gray-50/70 p-2 rounded-xl">
                <Calendar size={14} className="mr-2 text-gray-400" />
                <span>{project.period}</span>
              </div>

              {/* Progress & Meta */}
              <div className="space-y-3 pt-3 border-t border-gray-50">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400 font-medium">Прогресс выполнения</span>
                  <span className="font-bold text-gray-800">{project.progress}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#4f46e5] rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                {/* Footer info: Members & Tasks */}
                <div className="flex justify-between items-center pt-2 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1.5 text-gray-400" />
                    <span className="font-semibold text-gray-700">{project.members}</span>
                    <span className="text-gray-400 ml-1">участников</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">{project.tasksCount}</span>
                    <span className="text-gray-400 ml-1">направлений</span>
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
