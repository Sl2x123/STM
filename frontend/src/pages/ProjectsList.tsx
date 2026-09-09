import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FolderKanban, MoreVertical, Users, Plus, Calendar, X, ArrowUpRight } from 'lucide-react'

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
          className="bg-[#5b52f6] hover:bg-[#4f46e5] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center transition-all shadow-sm"
        >
          <Plus size={18} className="mr-2" />
          Создать проект
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <Link 
            key={project.id} 
            to={`/project/${project.id}`} 
            className="block group"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-indigo-100 transition-all flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-xl ${project.color} flex items-center justify-center font-bold text-xl transition-transform group-hover:scale-105`}>
                    {project.avatarChar}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400 group-hover:text-[#4f46e5] transition-colors p-1.5 rounded-lg hover:bg-gray-50">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#4f46e5] transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed font-medium">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex items-center text-xs text-gray-400 font-medium mb-4">
                  <Calendar size={14} className="mr-1.5" />
                  <span>{project.period}</span>
                </div>

                {/* Progress Bar */}
                <div className="mb-5">
                  <div className="flex justify-between items-center text-xs font-semibold text-gray-700 mb-1.5">
                    <span>Прогресс</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-[#4f46e5] h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-50 pt-4 font-medium">
                  <div className="flex items-center">
                    <Users size={15} className="mr-1.5 text-gray-400" />
                    <span>{project.members} участников</span>
                  </div>
                  <span className="bg-gray-50 px-2.5 py-1 rounded-md text-gray-600 font-semibold">
                    {project.tasksCount} задач
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Modal: Create Project */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Новый проект</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Название проекта *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Например: Фитосепт или Нурофен" 
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Описание / Цель проекта
                </label>
                <textarea 
                  rows={3}
                  placeholder="Краткое описание направления, фокуса и ответственных..." 
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-sm transition-all"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
