import { useState, useRef, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { 
  Menu, Search, Bell, LayoutDashboard, FolderKanban, FileText, Zap, ChevronDown, LogOut, User as UserIcon, Shield, Moon, Sun
} from 'lucide-react'

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  })
  const userMenuRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const userData = (() => {
    try {
      const stored = localStorage.getItem('user_data')
      if (stored) return JSON.parse(stored)
    } catch {}
    return { full_name: 'Азамат (Администратор)', email: 'admin@extragel.uz', role: 'admin' }
  })()

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    setUserMenuOpen(false)
    navigate('/login')
  }


  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1115] flex font-sans text-gray-800 dark:text-gray-100 transition-colors duration-150">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-[260px] shrink-0 bg-[#1a2332] dark:bg-[#13161b] dark:border-r dark:border-[#222630] text-[#8b9bb4] flex flex-col transition-transform duration-200 ease-in-out md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-16 px-6 mt-2">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-emerald-400 rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 bg-white rounded-md transform rotate-45"></div>
            </div>
            <span className="text-xl font-bold text-white tracking-wide">PMS Admin</span>
          </div>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* MENU Category */}
            <div className="px-6 mb-3 mt-4 text-[10px] font-bold text-[#566a87] uppercase tracking-wider">
              Menu
            </div>
            <div className="space-y-1 px-4">
              <Link
                to="/"
                className={`flex items-center px-4 py-2.5 rounded-xl transition-colors ${location.pathname === '/' ? 'text-white bg-[#4f46e5]' : 'hover:bg-[#233044] hover:text-white'}`}
              >
                <LayoutDashboard size={20} className="mr-4 opacity-80" />
                <span className="font-medium text-[15px]">Dashboard</span>
              </Link>
              
              <Link
                to="/projects"
                className={`flex items-center px-4 py-2.5 rounded-xl transition-colors ${location.pathname.startsWith('/projects') || location.pathname.startsWith('/project/') ? 'text-white bg-[#4f46e5]' : 'hover:bg-[#233044] hover:text-white'}`}
              >
                <FolderKanban size={20} className="mr-4 opacity-80" />
                <span className="font-medium text-[15px]">My Projects</span>
              </Link>

              <Link
                to="/reports"
                className={`flex items-center px-4 py-2.5 rounded-xl transition-colors ${location.pathname === '/reports' ? 'text-white bg-[#4f46e5]' : 'hover:bg-[#233044] hover:text-white'}`}
              >
                <FileText size={20} className="mr-4 opacity-80" />
                <span className="font-medium text-[15px]">Reports</span>
              </Link>
            </div>
          </div>
          
          {/* Bottom Banner */}
          <div className="px-4 mb-6">
            <div className="bg-[#233044] rounded-2xl p-5 relative overflow-hidden">
              <div className="bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
                <Zap size={16} className="text-white" />
              </div>
              <h4 className="text-white font-bold text-sm mb-1">Больше<br/>возможностей</h4>
              <p className="text-[11px] text-[#8b9bb4] mb-4 leading-relaxed">
                Создавайте, управляйте<br/>и достигайте целей<br/>быстрее.
              </p>
              <button className="w-full py-2 bg-[#818cf8] hover:bg-[#6366f1] text-white text-sm font-medium rounded-lg transition-colors">
                Узнать больше
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white dark:bg-[#13161b] border-b border-gray-100 dark:border-[#222630] h-[72px] flex items-center justify-between px-8 shrink-0 z-10 transition-colors">
          <div className="flex items-center flex-1">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white mr-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Переключить меню"
            >
              <Menu size={20} />
            </button>
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Поиск проектов, задач, пользователей..." 
                className="block w-full pl-11 pr-12 py-2.5 border-none rounded-xl bg-[#F3F4F6] dark:bg-[#1c1f26] text-sm text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 transition-colors"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <kbd className="text-[10px] font-sans font-semibold text-gray-400 dark:text-gray-500 bg-white dark:bg-[#282d37] px-2 py-0.5 rounded shadow-xs">⌘ K</kbd>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-5 ml-4">
            {/* Theme toggle switch matching reference */}
            <button 
              onClick={() => setIsDark(!isDark)}
              className="text-gray-400 hover:text-gray-700 dark:text-gray-400 dark:hover:text-amber-300 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1c1f26] transition-colors cursor-pointer"
              title={isDark ? "Включить светлую тему" : "Включить темную тему"}
            >
              {isDark ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} />}
            </button>

            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 relative p-1">
              <Bell size={21} />
              <span className="absolute top-0.5 right-0.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#13161b]"></span>
            </button>
            
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1c1f26] py-1.5 px-2.5 rounded-xl transition-colors border border-transparent hover:border-gray-200/80 dark:hover:border-gray-700"
              >
                <div className="h-9 w-9 rounded-xl bg-[#e0e7ff] dark:bg-[#0052cc]/30 text-[#0052cc] dark:text-[#60a5fa] flex items-center justify-center font-bold text-sm shadow-xs">
                  {userData.full_name?.charAt(0) || 'A'}
                </div>
                <div className="ml-2.5 text-left hidden sm:block">
                  <div className="font-bold text-gray-800 dark:text-gray-200 text-xs leading-tight">{userData.full_name || 'Азамат'}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{userData.role === 'admin' ? 'Администратор' : 'Менеджер'}</div>
                </div>
                <ChevronDown size={15} className={`ml-2 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#181b20] rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-black/50 border border-gray-100 dark:border-[#262932] py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100 dark:border-[#262932]">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{userData.full_name}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">{userData.email}</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-[#0052cc]/20 text-[#0052cc] dark:text-[#93c5fd]">
                      <Shield size={10} />
                      {userData.role === 'admin' ? 'Роль: Администратор' : 'Роль: Менеджер'}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false)
                        navigate('/reports')
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#222630] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <UserIcon size={14} className="text-gray-400" />
                      Мои отчеты и активность
                    </button>
                  </div>

                  <div className="border-t border-gray-100 dark:border-[#262932] pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-[#222630] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut size={14} className="text-rose-500" />
                      Выйти из аккаунта
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#F8F9FB] dark:bg-[#0f1115] p-6 lg:p-8 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
