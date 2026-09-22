import { useState, useRef, useEffect } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { 
  Menu, Search, Bell, LayoutDashboard, FolderKanban, FileText, ChevronDown, LogOut, User as UserIcon, Moon, Sun,
  Building2, CheckCircle2, X, Sparkles, Shield
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

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        setSearchOpen(true)
      } else if (e.key === 'Escape') {
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Debounced live search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    const timeout = setTimeout(() => {
      api.get('/search', { params: { q: searchQuery.trim() } })
        .then(res => {
          if (Array.isArray(res.data)) {
            setSearchResults(res.data)
          }
        })
        .catch(() => {})
        .finally(() => setIsSearching(false))
    }, 200)

    return () => clearTimeout(timeout)
  }, [searchQuery])

  // Click outside search container
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


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
            <div className="relative w-full max-w-xl" ref={searchContainerRef}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input 
                ref={searchInputRef}
                type="text" 
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setSearchOpen(true)
                }}
                placeholder="Поиск проектов, задач, блогеров, компаний..." 
                className="block w-full pl-11 pr-12 py-2.5 border-none rounded-xl bg-[#F3F4F6] dark:bg-[#1c1f26] text-sm text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0052cc]/30 transition-colors"
              />
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                {searchQuery ? (
                  <button 
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <kbd className="text-[10px] font-sans font-semibold text-gray-400 dark:text-gray-500 bg-white dark:bg-[#282d37] px-2 py-0.5 rounded shadow-xs pointer-events-none">⌘ K</kbd>
                )}
              </div>

              {/* Floating Live Search Dropdown */}
              {searchOpen && searchQuery.trim() && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#181b20] rounded-2xl shadow-2xl border border-gray-100 dark:border-[#262932] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100 max-h-[420px] overflow-y-auto">
                  <div className="p-3 border-b border-gray-100 dark:border-[#222630] flex items-center justify-between text-xs text-gray-400">
                    <span>Результаты поиска для: <strong className="text-gray-800 dark:text-gray-200">"{searchQuery}"</strong></span>
                    {isSearching && <span className="animate-pulse text-[#0052cc]">Поиск...</span>}
                  </div>

                  {searchResults.length === 0 && !isSearching ? (
                    <div className="p-8 text-center text-xs text-gray-400">
                      Ничего не найдено по вашему запросу
                    </div>
                  ) : (
                    <div className="py-2 divide-y divide-gray-50 dark:divide-[#20242c]">
                      {searchResults.map((item, idx) => {
                        const typeLabels: Record<string, { label: string; badge: string; icon: any }> = {
                          project: { label: 'Проект', badge: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400', icon: FolderKanban },
                          blogger: { label: 'Блогер', badge: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400', icon: Sparkles },
                          company: { label: 'Партнер B2B', badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400', icon: Building2 },
                          task: { label: 'Задача', badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', icon: CheckCircle2 },
                          user: { label: 'Команда', badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400', icon: UserIcon },
                        }
                        const info = typeLabels[item.type] || { label: item.type, badge: 'bg-gray-100 text-gray-700', icon: FolderKanban }
                        const IconComponent = info.icon

                        return (
                          <Link
                            key={`${item.type}_${item.id}_${idx}`}
                            to={item.url}
                            onClick={() => {
                              setSearchOpen(false)
                              setSearchQuery('')
                            }}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-[#20242c] transition-colors group cursor-pointer text-left"
                          >
                            <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-[#262a34] flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0 group-hover:bg-[#0052cc] group-hover:text-white transition-colors">
                              <IconComponent size={16} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                                  {item.title}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${info.badge}`}>
                                  {info.label}
                                </span>
                              </div>
                              {item.subtitle && (
                                <p className="text-xs text-gray-400 truncate mt-0.5 font-sans">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
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
                  <div className="text-[10px] text-gray-400 font-medium">
                    {userData.role === 'admin' ? 'Администратор' : userData.role === 'manager' ? 'Менеджер проектов' : 'Сотрудник'}
                  </div>
                </div>
                <ChevronDown size={15} className={`ml-2 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#181b20] rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-black/50 border border-gray-100 dark:border-[#262932] py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-gray-100 dark:border-[#262932]">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{userData.full_name}</p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">{userData.email}</p>
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-[#0052cc]/20 text-[#0052cc] dark:text-[#93c5fd]">
                      <Shield size={10} />
                      {userData.role === 'admin' ? 'Роль: Администратор' : userData.role === 'manager' ? 'Роль: Менеджер' : 'Роль: Сотрудник'}
                    </span>
                  </div>

                  {/* Instant Role Switcher for Testing */}
                  <div className="px-4 py-2 bg-gray-50/70 dark:bg-[#14161c] border-b border-gray-100 dark:border-[#262932]">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Тестовая роль:
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('user_data', JSON.stringify({ full_name: 'Азамат (Администратор)', email: 'admin@extragel.uz', role: 'admin' }))
                          window.location.reload()
                        }}
                        className={`px-1.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors text-center ${
                          userData.role === 'admin' ? 'bg-[#0052cc] text-white' : 'bg-gray-200/70 dark:bg-[#202530] text-gray-600 dark:text-gray-300 hover:bg-gray-300'
                        }`}
                      >
                        Admin
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('user_data', JSON.stringify({ full_name: 'Фаррух (Менеджер проектов)', email: 'manager@extragel.uz', role: 'manager' }))
                          window.location.reload()
                        }}
                        className={`px-1.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors text-center ${
                          userData.role === 'manager' ? 'bg-emerald-600 text-white' : 'bg-gray-200/70 dark:bg-[#202530] text-gray-600 dark:text-gray-300 hover:bg-gray-300'
                        }`}
                      >
                        Manager
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.setItem('user_data', JSON.stringify({ full_name: 'Дильноза (Сотрудник)', email: 'employee@extragel.uz', role: 'employee' }))
                          window.location.reload()
                        }}
                        className={`px-1.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors text-center ${
                          userData.role === 'employee' ? 'bg-amber-600 text-white' : 'bg-gray-200/70 dark:bg-[#202530] text-gray-600 dark:text-gray-300 hover:bg-gray-300'
                        }`}
                      >
                        Employee
                      </button>
                    </div>
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
