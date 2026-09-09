import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ChevronRight, ChevronDown, Plus, Search, ArrowLeft, ChevronLeft,
  Calendar, CheckCircle2, Circle, MoreVertical, LayoutList, Grip, X, Trash2, 
  Layers, Check, Sparkles, SlidersHorizontal, ArrowDownCircle, Clock, CalendarDays,
  ExternalLink, Edit3, User, AlignLeft, Tag, ArrowUpRight, Users, Link2, Eye, DollarSign, Send, Share2
} from 'lucide-react'

// Hierarchical Plans Data: Month -> Plan Item -> Sprints
const initialPlansTree = [
  {
    id: 'm1',
    type: 'MONTH',
    name: 'Сентябрь 2026',
    period: '01.09.2026 — 30.09.2026',
    totalPlan: 210,
    allocated: 210,
    isOpen: true,
    items: [
      {
        id: 'pi1',
        type: 'PLAN_ITEM',
        name: 'Визиты аптечные Ташкент',
        unit: 'визитов',
        monthPlan: 120,
        allocated: 120,
        isOpen: true,
        sprints: [
          { id: 'sp1_1', name: 'Спринт 1 (01.09 - 07.09)', plan: 30, fact: 30, status: 'Done' },
          { id: 'sp1_2', name: 'Спринт 2 (08.09 - 14.09)', plan: 30, fact: 15, status: 'In Progress' },
          { id: 'sp1_3', name: 'Спринт 3 (15.09 - 21.09)', plan: 30, fact: 0, status: 'Not Done' },
          { id: 'sp1_4', name: 'Спринт 4 (22.09 - 30.09)', plan: 30, fact: 0, status: 'Not Done' },
        ]
      },
      {
        id: 'pi2',
        type: 'PLAN_ITEM',
        name: 'Визиты к врачам (Кардиологи, Терапевты)',
        unit: 'визитов',
        monthPlan: 80,
        allocated: 80,
        isOpen: true,
        sprints: [
          { id: 'sp2_1', name: 'Спринт 1 (01.09 - 07.09)', plan: 20, fact: 20, status: 'Done' },
          { id: 'sp2_2', name: 'Спринт 2 (08.09 - 14.09)', plan: 20, fact: 18, status: 'In Progress' },
          { id: 'sp2_3', name: 'Спринт 3 (15.09 - 21.09)', plan: 20, fact: 0, status: 'Not Done' },
          { id: 'sp2_4', name: 'Спринт 4 (22.09 - 30.09)', plan: 20, fact: 0, status: 'Not Done' },
        ]
      },
      {
        id: 'pi3',
        type: 'PLAN_ITEM',
        name: 'Установка промостоек',
        unit: 'штук',
        monthPlan: 10,
        allocated: 10,
        isOpen: false,
        sprints: [
          { id: 'sp3_1', name: 'Спринт 1 (01.09 - 07.09)', plan: 5, fact: 5, status: 'Done' },
          { id: 'sp3_2', name: 'Спринт 2 (08.09 - 14.09)', plan: 5, fact: 3, status: 'In Progress' },
        ]
      }
    ]
  },
  {
    id: 'm2',
    type: 'MONTH',
    name: 'Октябрь 2026',
    period: '01.10.2026 — 31.10.2026',
    totalPlan: 250,
    allocated: 200,
    isOpen: false,
    items: [
      {
        id: 'pi4',
        type: 'PLAN_ITEM',
        name: 'Визиты аптечные Ташкент + Регионы',
        unit: 'визитов',
        monthPlan: 150,
        allocated: 150,
        isOpen: false,
        sprints: [
          { id: 'sp4_1', name: 'Спринт 1 (01.10 - 07.10)', plan: 40, fact: 0, status: 'Not Done' },
          { id: 'sp4_2', name: 'Спринт 2 (08.10 - 14.10)', plan: 40, fact: 0, status: 'Not Done' },
          { id: 'sp4_3', name: 'Спринт 3 (15.10 - 21.10)', plan: 35, fact: 0, status: 'Not Done' },
          { id: 'sp4_4', name: 'Спринт 4 (22.10 - 31.10)', plan: 35, fact: 0, status: 'Not Done' },
        ]
      }
    ]
  }
]

// Initial Execution Tasks Tree: EPIC -> SPRINT -> DAILY -> TASK
const initialTreeData = [
  {
    id: 'e1',
    type: 'EPIC',
    name: 'Запуск рекламной кампании',
    description: 'Масштабная кампания на ТВ, в интернете и по сетям аптек. Основная цель — повысить знание бренда Extragel до 65%.',
    status: 'In Progress',
    creatorInitial: 'A',
    creator: 'Азамат',
    creatorColor: 'bg-[#818cf8]',
    date: '01.09.2026',
    isOpen: true,
    children: [
      {
        id: 's1',
        type: 'SPRINT',
        name: 'Спринт 1: Подготовка креативов',
        description: 'Съемка промо-роликов, дизайн баннеров для таргета и согласование скриптов визитов для медпредов.',
        status: 'Done',
        creatorInitial: 'A',
        creator: 'Азамат',
        creatorColor: 'bg-[#818cf8]',
        date: '02.09.2026',
        isOpen: true,
        children: [
          {
            id: 'd1_1',
            type: 'DAILY',
            name: 'Делик 02.09: Сценарий и кастинг',
            description: 'Подготовка первичного сценария для ролика 30 секунд и отбор актерского состава.',
            status: 'Done',
            creatorInitial: 'Д',
            creator: 'Дилрабо',
            creatorColor: 'bg-[#9ca3af]',
            date: '02.09.2026',
            isOpen: true,
            children: [
              { id: 't1_1_1', type: 'TASK', name: 'Написать сценарий 30 сек', description: 'Сценарий с акцентом на быстрое снятие боли и безопасность.', status: 'Done', creatorInitial: 'Д', creator: 'Дилрабо', creatorColor: 'bg-[#9ca3af]', date: '03.09.2026' },
              { id: 't1_1_2', type: 'TASK', name: 'Найти актеров на главные роли', description: 'Кастинг 3 кандидатов для утверждения с бренд-менеджером.', status: 'Done', creatorInitial: 'Д', creator: 'Дилрабо', creatorColor: 'bg-[#9ca3af]', date: '04.09.2026' },
            ]
          },
          {
            id: 'd1_2',
            type: 'DAILY',
            name: 'Делик 05.09: Монтаж и озвучка',
            description: 'Постпродакшн, цветокоррекция и запись дикторской озвучки на узбекском и русском языках.',
            status: 'Done',
            creatorInitial: 'A',
            creator: 'Азамат',
            creatorColor: 'bg-[#818cf8]',
            date: '05.09.2026',
            isOpen: false,
            children: [
              { id: 't1_2_1', type: 'TASK', name: 'Запись диктора в студии', description: 'Студия звукозаписи "MuzLab", 2 версии хронометража.', status: 'Done', creatorInitial: 'A', creator: 'Азамат', creatorColor: 'bg-[#818cf8]', date: '06.09.2026' }
            ]
          }
        ]
      },
      {
        id: 's2',
        type: 'SPRINT',
        name: 'Спринт 2: Запуск в таргет',
        description: 'Настройка кабинетов FB, Instagram, Google Ads. Старт рекламной выдачи и сбор лидов.',
        status: 'In Progress',
        creatorInitial: 'A',
        creator: 'Азамат',
        creatorColor: 'bg-[#818cf8]',
        date: '10.09.2026',
        isOpen: true,
        children: [
          {
            id: 'd2_1',
            type: 'DAILY',
            name: 'Делик 10.09: Аудитории и пиксели',
            description: 'Установка Meta Pixel, создание кастомных аудиторий Lookalike по покупателям аптек.',
            status: 'In Progress',
            creatorInitial: 'A',
            creator: 'Азамат',
            creatorColor: 'bg-[#818cf8]',
            date: '10.09.2026',
            isOpen: true,
            children: [
              { id: 't2_1_1', type: 'TASK', name: 'Собрать базы аптек и ЦА', description: 'Сегментация ключевых сетей по районам Ташкента.', status: 'In Progress', creatorInitial: 'A', creator: 'Азамат', creatorColor: 'bg-[#818cf8]', date: '11.09.2026' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'e2',
    type: 'EPIC',
    name: 'Работа с аптеками Q3',
    description: 'Повышение представленности Extragel в аптечных сетях Olam Farm, 36.6, Grand Pharm.',
    status: 'Not Done',
    creatorInitial: 'Д',
    creator: 'Джамшид',
    creatorColor: 'bg-[#818cf8]',
    date: '15.09.2026',
    isOpen: false,
    children: [
      {
        id: 's3',
        type: 'SPRINT',
        name: 'Спринт 1: Аудит выкладки',
        description: 'Проверка наличия во всех точках и обучение первостольников.',
        status: 'Not Done',
        creatorInitial: 'Д',
        creator: 'Джамшид',
        creatorColor: 'bg-[#818cf8]',
        date: '16.09.2026',
        isOpen: false,
        children: [
          {
            id: 'd3_1',
            type: 'DAILY',
            name: 'Делик 16.09: Мониторинг сетей',
            description: 'Проверка выкладки на первой линии витрин.',
            status: 'Not Done',
            creatorInitial: 'Д',
            creator: 'Джамшид',
            creatorColor: 'bg-[#818cf8]',
            date: '16.09.2026',
            isOpen: false,
            children: [
              { id: 't3_1_1', type: 'TASK', name: 'Мерчендайзинг в 30 аптеках', description: 'Выкладка на уровне глаз покупателя, установка воблеров.', status: 'Not Done', creatorInitial: 'Д', creator: 'Джамшид', creatorColor: 'bg-[#818cf8]', date: '17.09.2026' }
            ]
          }
        ]
      }
    ]
  }
]

// Initial Influencers & Bloggers Dataset
const initialBloggers = [
  {
    id: 'b1',
    name: 'Шахзода Мухаммедова',
    handle: '@shakhzoda__mukhammedova',
    platform: 'Instagram',
    avatarChar: 'Ш',
    avatarColor: 'bg-pink-500',
    followers: '4.2M',
    reach: '180K',
    format: 'Reels + 2 Stories',
    price: '$650',
    status: 'Вышел пост',
    publishDate: '05.09.2026',
    sprint: 'Спринт 1',
    profileUrl: 'https://instagram.com',
    postUrl: 'https://instagram.com/p/example1',
    managerContact: '+998 90 123 45 67 (Лола)',
    notes: 'Акцент на форму геля Extragel и быстрое охлаждающее действие при травмах. Охват превысил плановый на 15%.'
  },
  {
    id: 'b2',
    name: 'Доктор Алимов (Health & Life)',
    handle: '@dr_alimov_health',
    platform: 'Telegram',
    avatarChar: 'Д',
    avatarColor: 'bg-sky-500',
    followers: '120K',
    reach: '45K',
    format: 'Экспертный пост с опросом',
    price: '$200',
    status: 'Оплачено',
    publishDate: '12.09.2026',
    sprint: 'Спринт 2',
    profileUrl: 'https://t.me',
    postUrl: '',
    managerContact: '@alimov_assistant',
    notes: 'Медицинский разбор состава и преимуществ. Готовый текст согласован с фармнаправлением.'
  },
  {
    id: 'b3',
    name: 'Мадина Мамасидикова',
    handle: '@madina_lifestyle',
    platform: 'Instagram',
    avatarChar: 'М',
    avatarColor: 'bg-purple-500',
    followers: '850K',
    reach: '95K',
    format: 'Stories распаковка аптечки',
    price: '$300',
    status: 'Согласовано',
    publishDate: '18.09.2026',
    sprint: 'Спринт 3',
    profileUrl: 'https://instagram.com',
    postUrl: '',
    managerContact: '+998 97 765 43 21 (Сардор)',
    notes: 'Интеграция в рубрику "Что всегда беру в поездку с детьми". Образцы продукта доставлены курьером.'
  },
  {
    id: 'b4',
    name: 'Фитнес Ташкент (Артём)',
    handle: '@tashkent_fit_artem',
    platform: 'TikTok',
    avatarChar: 'Ф',
    avatarColor: 'bg-neutral-800',
    followers: '320K',
    reach: '60K',
    format: 'Динамичный ролик с тренировки',
    price: '$180',
    status: 'Переговоры',
    publishDate: '24.09.2026',
    sprint: 'Спринт 4',
    profileUrl: 'https://tiktok.com',
    postUrl: '',
    managerContact: '@artem_coach',
    notes: 'Ждем ответа по датам съемки в зале.'
  }
]

export default function ProjectView() {
  const { id } = useParams()
  const projectId = Number(id) || 1

  const projectName = projectId === 1 ? 'Extragel' : projectId === 2 ? 'Masculan' : 'Энтеросгель'
  const projectInitial = projectName[0]

  // Active Tab: 'tasks' | 'plans' | 'bloggers' | 'members' | 'settings'
  const [activeTab, setActiveTab] = useState<'tasks' | 'plans' | 'bloggers' | 'members' | 'settings'>('tasks')

  // Bloggers Tracking State
  const [bloggersData, setBloggersData] = useState<any[]>(initialBloggers)
  const [bloggerSearch, setBloggerSearch] = useState('')
  const [bloggerPlatformFilter, setBloggerPlatformFilter] = useState('ALL')
  const [bloggerStatusFilter, setBloggerStatusFilter] = useState('ALL')
  const [isAddBloggerOpen, setIsAddBloggerOpen] = useState(false)
  const [selectedBlogger, setSelectedBlogger] = useState<any | null>(null)

  // Add Blogger Form Fields
  const [bName, setBName] = useState('')
  const [bHandle, setBHandle] = useState('')
  const [bPlatform, setBPlatform] = useState('Instagram')
  const [bFollowers, setBFollowers] = useState('')
  const [bReach, setBReach] = useState('')
  const [bFormat, setBFormat] = useState('Reels + 2 Stories')
  const [bPrice, setBPrice] = useState('$250')
  const [bDate, setBDate] = useState('15.09.2026')
  const [bSprint, setBSprint] = useState('Спринт 2')
  const [bContact, setBContact] = useState('')
  const [bNotes, setBNotes] = useState('')

  const handleAddBlogger = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bName.trim()) return

    const newB = {
      id: `b_${Date.now()}`,
      name: bName.trim(),
      handle: bHandle.trim().startsWith('@') ? bHandle.trim() : `@${bHandle.trim()}`,
      platform: bPlatform,
      avatarChar: bName.trim()[0].toUpperCase(),
      avatarColor: bPlatform === 'Instagram' ? 'bg-pink-500' : bPlatform === 'Telegram' ? 'bg-sky-500' : bPlatform === 'TikTok' ? 'bg-neutral-800' : 'bg-red-500',
      followers: bFollowers.trim() || '100K',
      reach: bReach.trim() || '25K',
      format: bFormat.trim() || 'Stories',
      price: bPrice.trim() || '$150',
      status: 'Переговоры',
      publishDate: bDate.trim() || '20.09.2026',
      sprint: bSprint,
      profileUrl: bPlatform === 'Instagram' ? 'https://instagram.com' : 'https://t.me',
      postUrl: '',
      managerContact: bContact.trim() || '—',
      notes: bNotes.trim() || 'Тезисы согласуются'
    }

    setBloggersData([newB, ...bloggersData])
    setBName('')
    setBHandle('')
    setBContact('')
    setBNotes('')
    setIsAddBloggerOpen(false)
  }

  const cycleBloggerStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const statuses = ['Переговоры', 'Согласовано', 'Оплачено', 'Вышел пост']
    setBloggersData(data => data.map(b => {
      if (b.id === id) {
        const nextIdx = (statuses.indexOf(b.status) + 1) % statuses.length
        return { ...b, status: statuses[nextIdx] }
      }
      return b
    }))
  }

  const deleteBlogger = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setBloggersData(data => data.filter(b => b.id !== id))
  }

  const handleSaveBlogger = (updated: any) => {
    setBloggersData(data => data.map(b => b.id === updated.id ? updated : b))
    setSelectedBlogger(null)
  }

  const filteredBloggers = useMemo(() => {
    return bloggersData.filter(b => {
      const q = bloggerSearch.toLowerCase().trim()
      const matchesSearch = !q || 
        b.name.toLowerCase().includes(q) || 
        b.handle.toLowerCase().includes(q) ||
        (b.notes && b.notes.toLowerCase().includes(q))
      const matchesPlatform = bloggerPlatformFilter === 'ALL' || b.platform === bloggerPlatformFilter
      const matchesStatus = bloggerStatusFilter === 'ALL' || b.status === bloggerStatusFilter
      return matchesSearch && matchesPlatform && matchesStatus
    })
  }, [bloggersData, bloggerSearch, bloggerPlatformFilter, bloggerStatusFilter])

  // Blogger metrics
  const totalBloggerBudget = useMemo(() => {
    return bloggersData.reduce((sum, b) => {
      const num = parseInt(b.price.replace(/[^0-9]/g, '')) || 0
      return sum + num
    }, 0)
  }, [bloggersData])

  const publishedBloggersCount = useMemo(() => {
    return bloggersData.filter(b => b.status === 'Вышел пост').length
  }, [bloggersData])

  // Plans Hierarchy State
  const [plansData, setPlansData] = useState<any[]>(initialPlansTree)

  // Modals for Plans
  const [isAddMonthOpen, setIsAddMonthOpen] = useState(false)
  const [newMonthName, setNewMonthName] = useState('')
  const [newMonthPeriod, setNewMonthPeriod] = useState('')

  const [isAddPlanItemOpen, setIsAddPlanItemOpen] = useState(false)
  const [targetMonthId, setTargetMonthId] = useState('')
  const [newPlanItemName, setNewPlanItemName] = useState('')
  const [newPlanItemUnit, setNewPlanItemUnit] = useState('визитов')
  const [newPlanItemTarget, setNewPlanItemTarget] = useState(100)

  const [isAddSprintOpen, setIsAddSprintOpen] = useState(false)
  const [targetPlanItemId, setTargetPlanItemId] = useState('')
  const [newSprintName, setNewSprintName] = useState('')
  const [newSprintPlan, setNewSprintPlan] = useState(25)

  // Execution Tasks Tree State (EPIC -> SPRINT -> DAILY -> TASK)
  const [tasksData, setTasksData] = useState<any[]>(initialTreeData)
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Detail Modal State (Clicking any item opens detailed view/edit)
  const [selectedDetailItem, setSelectedDetailItem] = useState<any | null>(null)

  // Task Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'EPIC' | 'SPRINT' | 'DAILY' | 'TASK'>('TASK')
  const [modalName, setModalName] = useState('')
  const [modalDesc, setModalDesc] = useState('')
  const [modalStatus, setModalStatus] = useState('Not Done')
  const [modalParentId, setModalParentId] = useState('')

  // ==========================================
  // PLANS TREE LOGIC (Month -> Plan -> Sprint)
  // ==========================================
  const togglePlanOpen = (id: string) => {
    setPlansData(data => data.map(month => {
      if (month.id === id) return { ...month, isOpen: !month.isOpen }
      return {
        ...month,
        items: month.items.map((item: any) => {
          if (item.id === id) return { ...item, isOpen: !item.isOpen }
          return item
        })
      }
    }))
  }

  const handleAddMonth = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMonthName.trim()) return

    const newMonth = {
      id: `m_${Date.now()}`,
      type: 'MONTH',
      name: newMonthName.trim(),
      period: newMonthPeriod.trim() || '01.11.2026 — 30.11.2026',
      totalPlan: 0,
      allocated: 0,
      isOpen: true,
      items: []
    }

    setPlansData([...plansData, newMonth])
    setNewMonthName('')
    setNewMonthPeriod('')
    setIsAddMonthOpen(false)
  }

  const handleAddPlanItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlanItemName.trim()) return

    const newItem = {
      id: `pi_${Date.now()}`,
      type: 'PLAN_ITEM',
      name: newPlanItemName.trim(),
      unit: newPlanItemUnit.trim() || 'шт',
      monthPlan: Number(newPlanItemTarget),
      allocated: 0,
      isOpen: true,
      sprints: []
    }

    setPlansData(data => data.map(m => {
      if (m.id === targetMonthId) {
        return {
          ...m,
          totalPlan: m.totalPlan + Number(newPlanItemTarget),
          items: [...m.items, newItem]
        }
      }
      return m
    }))

    setNewPlanItemName('')
    setIsAddPlanItemOpen(false)
  }

  const handleAddSprint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSprintName.trim()) return

    const newSp = {
      id: `sp_${Date.now()}`,
      name: newSprintName.trim(),
      plan: Number(newSprintPlan),
      fact: 0,
      status: 'Not Done'
    }

    setPlansData(data => data.map(m => ({
      ...m,
      items: m.items.map((item: any) => {
        if (item.id === targetPlanItemId) {
          const newAlloc = item.allocated + Number(newSprintPlan)
          return {
            ...item,
            allocated: newAlloc,
            sprints: [...item.sprints, newSp]
          }
        }
        return item
      })
    })))

    setNewSprintName('')
    setIsAddSprintOpen(false)
  }

  const updateSprintPlanValue = (monthId: string, itemId: string, sprintId: string, val: number) => {
    setPlansData(data => data.map(m => {
      if (m.id === monthId) {
        return {
          ...m,
          items: m.items.map((item: any) => {
            if (item.id === itemId) {
              const updatedSprints = item.sprints.map((s: any) => s.id === sprintId ? { ...s, plan: val } : s)
              const newAllocated = updatedSprints.reduce((acc: number, s: any) => acc + Number(s.plan || 0), 0)
              return { ...item, sprints: updatedSprints, allocated: newAllocated }
            }
            return item
          })
        }
      }
      return m
    }))
  }

  // ==========================================
  // TASKS TREE LOGIC (Epic -> Sprint -> Daily -> Task)
  // ==========================================
  const toggleTaskOpen = (nodeId: string) => {
    const toggleNode = (nodes: any[]): any[] => {
      return nodes.map(node => {
        if (node.id === nodeId) return { ...node, isOpen: !node.isOpen }
        if (node.children) return { ...node, children: toggleNode(node.children) }
        return node
      })
    }
    setTasksData(toggleNode(tasksData))
  }

  const cycleTaskStatus = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updateNodeStatus = (nodes: any[]): any[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          const nextStatus = 
            node.status === 'Not Done' ? 'In Progress' :
            node.status === 'In Progress' ? 'Done' : 'Not Done'
          return { ...node, status: nextStatus }
        }
        if (node.children) return { ...node, children: updateNodeStatus(node.children) }
        return node
      })
    }
    setTasksData(updateNodeStatus(tasksData))
  }

  const deleteTaskNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const removeNode = (nodes: any[]): any[] => {
      return nodes
        .filter(n => n.id !== nodeId)
        .map(n => n.children ? { ...n, children: removeNode(n.children) } : n)
    }
    setTasksData(removeNode(tasksData))
  }

  // Quick inline rename helpers for Plans
  const renamePlanMonth = (monthId: string, newName: string) => {
    setPlansData(data => data.map(m => m.id === monthId ? { ...m, name: newName } : m))
  }

  const renamePlanItem = (monthId: string, itemId: string, newName: string) => {
    setPlansData(data => data.map(m => m.id === monthId ? {
      ...m,
      items: m.items.map((it: any) => it.id === itemId ? { ...it, name: newName } : it)
    } : m))
  }

  const renamePlanSprint = (monthId: string, itemId: string, sprintId: string, newName: string) => {
    setPlansData(data => data.map(m => m.id === monthId ? {
      ...m,
      items: m.items.map((it: any) => it.id === itemId ? {
        ...it,
        sprints: it.sprints.map((sp: any) => sp.id === sprintId ? { ...sp, name: newName } : sp)
      } : it)
    } : m))
  }

  // Update Detail Item for both Tasks and Plans
  const handleSaveDetail = (updatedItem: any) => {
    // 1. Update in tasksData (Epic -> Sprint -> Daily -> Task)
    const updateTreeItem = (nodes: any[]): any[] => {
      return nodes.map(n => {
        if (n.id === updatedItem.id) {
          return { ...n, ...updatedItem }
        }
        if (n.children) {
          return { ...n, children: updateTreeItem(n.children) }
        }
        return n
      })
    }
    setTasksData(updateTreeItem(tasksData))

    // 2. Update in plansData (Month -> Plan Item -> Sprint)
    setPlansData(data => data.map(m => {
      if (m.id === updatedItem.id) {
        return { 
          ...m, 
          name: updatedItem.name, 
          period: updatedItem.period || m.period, 
          description: updatedItem.description || m.description 
        }
      }
      return {
        ...m,
        items: m.items.map((it: any) => {
          if (it.id === updatedItem.id) {
            const newMonthPlan = updatedItem.monthPlan !== undefined ? Number(updatedItem.monthPlan) : it.monthPlan
            return { 
              ...it, 
              name: updatedItem.name, 
              monthPlan: newMonthPlan, 
              description: updatedItem.description || it.description 
            }
          }
          return {
            ...it,
            sprints: it.sprints.map((sp: any) => {
              if (sp.id === updatedItem.id) {
                const newPlan = updatedItem.plan !== undefined ? Number(updatedItem.plan) : sp.plan
                return { 
                  ...sp, 
                  name: updatedItem.name, 
                  plan: newPlan, 
                  status: updatedItem.status || sp.status, 
                  description: updatedItem.description || sp.description 
                }
              }
              return sp
            })
          }
        })
      }
    }))

    setSelectedDetailItem(null)
  }

  // Flatten all items for metrics
  const allTasks = useMemo(() => {
    const items: any[] = []
    const traverse = (nodes: any[]) => {
      nodes.forEach(n => {
        items.push(n)
        if (n.children) traverse(n.children)
      })
    }
    traverse(tasksData)
    return items
  }, [tasksData])

  const totalTasksCount = allTasks.filter(i => i.type === 'TASK').length
  const completedTasksCount = allTasks.filter(i => i.type === 'TASK' && i.status === 'Done').length
  const progressPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0

  // Filter Tasks
  const filterTaskNode = (node: any): any | null => {
    const matchesSearch = 
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = typeFilter === 'ALL' || node.type === typeFilter
    const matchesStatus = statusFilter === 'ALL' || node.status === statusFilter

    let filteredChildren: any[] = []
    if (node.children) {
      filteredChildren = node.children.map(filterTaskNode).filter(Boolean)
    }

    if ((matchesSearch && matchesType && matchesStatus) || filteredChildren.length > 0) {
      return {
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : node.children,
        isOpen: searchQuery ? true : node.isOpen
      }
    }
    return null
  }

  const filteredTasksTree = useMemo(() => {
    if (!searchQuery && typeFilter === 'ALL' && statusFilter === 'ALL') {
      return tasksData
    }
    return tasksData.map(filterTaskNode).filter(Boolean)
  }, [tasksData, searchQuery, typeFilter, statusFilter])

  // Handle Create Item (Epic, Sprint, Daily, Task)
  const handleCreateTaskItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalName.trim()) return

    const newItem = {
      id: `custom_${Date.now()}`,
      type: modalType,
      name: modalName.trim(),
      description: modalDesc.trim() || 'Без описания',
      status: modalStatus,
      creatorInitial: 'A',
      creator: 'Азамат',
      creatorColor: 'bg-[#818cf8]',
      date: new Date().toLocaleDateString('ru-RU'),
      isOpen: true,
      children: modalType !== 'TASK' ? [] : undefined
    }

    if (modalType === 'EPIC') {
      setTasksData([...tasksData, newItem])
    } else {
      // Find parent recursively and add
      const addToParent = (nodes: any[]): any[] => {
        return nodes.map(n => {
          if (n.id === modalParentId) {
            return { ...n, children: [...(n.children || []), newItem] }
          }
          if (n.children) {
            return { ...n, children: addToParent(n.children) }
          }
          return n
        })
      }
      setTasksData(addToParent(tasksData))
    }

    setModalName('')
    setModalDesc('')
    setIsModalOpen(false)
  }

  const renderStatus = (status: string, nodeId: string) => {
    if (status === 'Done') {
      return (
        <div 
          onClick={(e) => cycleTaskStatus(nodeId, e)}
          title="Нажмите, чтобы сменить статус"
          className="flex items-center text-emerald-600 bg-emerald-50 hover:bg-emerald-100 px-3 py-1 rounded-full text-xs font-semibold w-max transition-colors cursor-pointer"
        >
          <CheckCircle2 size={14} className="mr-1.5" /> Done
        </div>
      )
    }
    if (status === 'In Progress') {
      return (
        <div 
          onClick={(e) => cycleTaskStatus(nodeId, e)}
          title="Нажмите, чтобы сменить статус"
          className="flex items-center text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full text-xs font-semibold w-max transition-colors cursor-pointer"
        >
          <Circle size={14} className="mr-1.5" /> In Progress
        </div>
      )
    }
    return (
      <div 
        onClick={(e) => cycleTaskStatus(nodeId, e)}
        title="Нажмите, чтобы сменить статус"
        className="flex items-center text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-xs font-semibold w-max transition-colors cursor-pointer"
      >
        <Circle size={14} className="mr-1.5" /> Not Done
      </div>
    )
  }

  const renderBadge = (type: string) => {
    if (type === 'EPIC') {
      return <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded ml-2 mr-3 tracking-wide shrink-0">EPIC</span>
    }
    if (type === 'SPRINT') {
      return <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded ml-2 mr-3 tracking-wide shrink-0">SPRINT</span>
    }
    if (type === 'DAILY') {
      return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded ml-2 mr-3 tracking-wide shrink-0">DAILY</span>
    }
    return (
      <span className="flex items-center text-gray-500 text-[10px] font-bold px-2 py-0.5 ml-2 mr-3 tracking-wide bg-gray-100 rounded border border-gray-200 shrink-0">
        <CheckCircle2 size={10} className="mr-1" /> TASK
      </span>
    )
  }

  // Render Row for Task Tree
  const renderTaskRow = (node: any, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0
    const paddingLeft = level * 32 + 20 

    return (
      <div key={node.id}>
        <div 
          className="flex items-center border-b border-gray-100 hover:bg-slate-50 transition-colors bg-white group select-none"
        >
          {/* Name column */}
          <div className="flex-1 py-3.5 flex items-center min-w-[300px]" style={{ paddingLeft: `${paddingLeft}px` }}>
            <div className="w-5 flex items-center justify-center shrink-0 cursor-pointer" onClick={() => hasChildren && toggleTaskOpen(node.id)}>
              {hasChildren ? (
                <button className="text-gray-400 hover:text-gray-700">
                  {node.isOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
                </button>
              ) : (
                <div className="w-5"></div>
              )}
            </div>
            
            {renderBadge(node.type)}
            
            {/* Clickable name opens detailed view modal */}
            <span 
              onClick={() => setSelectedDetailItem(node)}
              className="font-semibold text-gray-900 text-[14px] hover:text-[#4f46e5] cursor-pointer transition-colors truncate"
              title="Нажмите, чтобы открыть подробное описание"
            >
              {node.name}
            </span>

            {/* + Button next to EPIC to add SPRINT */}
            {node.type === 'EPIC' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setModalType('SPRINT')
                  setModalParentId(node.id)
                  setIsModalOpen(true)
                }}
                className="ml-2.5 w-5 h-5 rounded-md bg-purple-50 hover:bg-[#4f46e5] text-purple-600 hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
                title="Добавить Спринт в этот Epic"
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            )}

            {/* + Button next to SPRINT to add DAILY */}
            {node.type === 'SPRINT' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setModalType('DAILY')
                  setModalParentId(node.id)
                  setIsModalOpen(true)
                }}
                className="ml-2.5 w-5 h-5 rounded-md bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
                title="Добавить Делик в этот Спринт"
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            )}

            {/* + Button next to DAILY to add TASK */}
            {node.type === 'DAILY' && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setModalType('TASK')
                  setModalParentId(node.id)
                  setIsModalOpen(true)
                }}
                className="ml-2.5 w-5 h-5 rounded-md bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
                title="Добавить Задачу в этот Делик"
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Description */}
          <div 
            onClick={() => setSelectedDetailItem(node)}
            className="w-[300px] py-3.5 pr-6 text-[13px] text-gray-500 truncate shrink-0 cursor-pointer hover:text-gray-800" 
            title={node.description}
          >
            {node.description}
          </div>

          {/* Status */}
          <div className="w-[140px] py-3.5 pr-6 shrink-0">
            {renderStatus(node.status, node.id)}
          </div>

          {/* Creator */}
          <div className="w-[160px] py-3.5 pr-6 flex items-center shrink-0">
            <div className={`w-6 h-6 rounded-full ${node.creatorColor} text-white flex items-center justify-center text-[10px] font-bold mr-2 shrink-0`}>
              {node.creatorInitial}
            </div>
            <span className="text-[13px] text-gray-700 font-medium truncate">{node.creator}</span>
          </div>

          {/* Date */}
          <div className="w-[140px] py-3.5 pr-2 text-[13px] text-gray-500 font-medium shrink-0">
            {node.date}
          </div>
          
          {/* Actions */}
          <div className="w-[120px] py-3.5 pr-4 flex items-center justify-end gap-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {node.type === 'EPIC' && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setModalType('SPRINT')
                  setModalParentId(node.id)
                  setIsModalOpen(true)
                }}
                className="w-6 h-6 rounded-lg bg-indigo-50 hover:bg-[#4f46e5] text-[#4f46e5] hover:text-white flex items-center justify-center transition-all"
                title="Добавить Спринт в этот Epic"
              >
                <Plus size={14} />
              </button>
            )}
            {node.type === 'SPRINT' && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setModalType('DAILY')
                  setModalParentId(node.id)
                  setIsModalOpen(true)
                }}
                className="w-6 h-6 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white flex items-center justify-center transition-all"
                title="Добавить Делик в этот Спринт"
              >
                <Plus size={14} />
              </button>
            )}
            {node.type === 'DAILY' && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setModalType('TASK')
                  setModalParentId(node.id)
                  setIsModalOpen(true)
                }}
                className="w-6 h-6 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-700 hover:text-white flex items-center justify-center transition-all"
                title="Добавить Задачу в этот Делик"
              >
                <Plus size={14} />
              </button>
            )}
            <button 
              onClick={() => setSelectedDetailItem(node)}
              className="p-1 hover:text-[#4f46e5] hover:bg-indigo-50 rounded" 
              title="Подробнее"
            >
              <ExternalLink size={14} />
            </button>
            <button 
              onClick={(e) => deleteTaskNode(node.id, e)}
              className="p-1 hover:text-red-500 hover:bg-red-50 rounded" 
              title="Удалить"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Children */}
        {node.isOpen && hasChildren && (
          <div>
            {node.children.map((child: any) => renderTaskRow(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  // Available containers for parent dropdown in modal
  const availableEpics = tasksData.filter(n => n.type === 'EPIC')
  
  const availableSprints: any[] = []
  tasksData.forEach(e => {
    (e.children || []).forEach((s: any) => {
      if (s.type === 'SPRINT') availableSprints.push({ ...s, epicName: e.name })
    })
  })

  const availableDailies: any[] = []
  tasksData.forEach(e => {
    (e.children || []).forEach((s: any) => {
      (s.children || []).forEach((d: any) => {
        if (d.type === 'DAILY') availableDailies.push({ ...d, sprintName: s.name, epicName: e.name })
      })
    })
  })

  return (
    <div className="max-w-[1400px] mx-auto font-sans pb-12">
      
      {/* Breadcrumb / Back */}
      <Link to="/projects" className="inline-flex items-center text-gray-500 hover:text-gray-800 text-sm font-medium mb-6 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Назад к проектам
      </Link>

      {/* Header Area */}
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-start mb-8 gap-6">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mr-5 shrink-0">
            <span className="text-4xl font-bold text-[#4f46e5]">{projectInitial}</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1 tracking-tight">{projectName}</h1>
            <p className="text-gray-500 text-sm font-medium">Все задачи, декомпозиция и прогресс проекта</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 min-w-[280px]">
            <div className="text-gray-400">
              <Calendar size={24} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-[15px]">1 сент. 2026 — 30 сент. 2026</div>
              <div className="text-xs text-gray-500 font-medium">Период проекта</div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-w-[320px]">
            <div className="flex justify-between items-center mb-3">
              <div className="font-bold text-gray-900 text-[15px]">Прогресс проекта</div>
              <div className="font-bold text-gray-900 text-sm">{progressPercent}%</div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3 overflow-hidden">
              <div 
                className="bg-[#4f46e5] h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 font-medium">{completedTasksCount} из {totalTasksCount} задач завершено</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABS NAVIGATION                                                           */}
      {/* ========================================================================= */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center font-bold pb-4 border-b-2 px-2 mr-8 transition-colors ${
            activeTab === 'tasks' ? 'text-[#4f46e5] border-[#4f46e5]' : 'text-gray-500 border-transparent hover:text-gray-800'
          }`}
        >
          <LayoutList size={18} className="mr-2" /> Задачи (Декомпозиция)
        </button>

        <button 
          onClick={() => setActiveTab('plans')}
          className={`flex items-center font-bold pb-4 border-b-2 px-2 mr-8 transition-colors ${
            activeTab === 'plans' ? 'text-[#4f46e5] border-[#4f46e5]' : 'text-gray-500 border-transparent hover:text-gray-800'
          }`}
        >
          <CalendarDays size={18} className="mr-2" /> Расписание и Планы
        </button>

        <button 
          onClick={() => setActiveTab('bloggers')}
          className={`flex items-center font-bold pb-4 border-b-2 px-2 mr-8 transition-colors ${
            activeTab === 'bloggers' ? 'text-[#4f46e5] border-[#4f46e5]' : 'text-gray-500 border-transparent hover:text-gray-800'
          }`}
        >
          <Users size={18} className="mr-2" /> Блогеры
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold ${
            activeTab === 'bloggers' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'
          }`}>
            {bloggersData.length}
          </span>
        </button>

        <button 
          onClick={() => setActiveTab('members')}
          className={`flex items-center font-medium pb-4 border-b-2 px-2 mr-8 transition-colors ${
            activeTab === 'members' ? 'text-[#4f46e5] border-[#4f46e5]' : 'text-gray-500 border-transparent hover:text-gray-800'
          }`}
        >
           Участники
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center font-medium pb-4 border-b-2 px-2 transition-colors ${
            activeTab === 'settings' ? 'text-[#4f46e5] border-[#4f46e5]' : 'text-gray-500 border-transparent hover:text-gray-800'
          }`}
        >
           Настройки
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PLANS & SCHEDULE (Month -> Plan -> Sprint)                         */}
      {/* ========================================================================= */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Месячные планы и Спринты</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Иерархическая структура: Месяц → Показатели плана → Распределение по спринтам
              </p>
            </div>

            <button 
              onClick={() => setIsAddMonthOpen(true)}
              className="bg-[#5b52f6] hover:bg-[#4f46e5] text-white px-5 py-2.5 text-sm font-bold flex items-center rounded-xl transition-all shadow-sm"
            >
              <Plus size={18} className="mr-2" /> Добавить месяц
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
            <div className="flex bg-white border-b border-gray-100 text-[11px] uppercase font-bold text-gray-400 tracking-wider min-w-[1000px]">
              <div className="flex-1 py-4 px-6 min-w-[320px]">Иерархия (Месяц / Показатель плана / Спринт)</div>
              <div className="w-[180px] py-4 pr-6 text-right">План</div>
              <div className="w-[160px] py-4 pr-6 text-right">Распределено / Факт</div>
              <div className="w-[180px] py-4 pr-6 text-center">Статус распределения</div>
              <div className="w-[120px] py-4 pr-6 text-right">Действия</div>
            </div>

            <div className="min-w-[1000px] divide-y divide-gray-100">
              {plansData.map(month => {
                const monthExact = month.allocated === month.totalPlan
                const monthDiff = month.totalPlan - month.allocated

                return (
                  <div key={month.id} className="bg-white">
                    {/* LEVEL 1: MONTH ROW */}
                    <div 
                      className="flex items-center hover:bg-slate-50 transition-colors py-4 px-6 cursor-pointer bg-slate-50/50 font-sans"
                      onClick={() => togglePlanOpen(month.id)}
                    >
                      <div className="flex-1 flex items-center">
                        <button className="text-gray-400 hover:text-gray-700 mr-2">
                          {month.isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded mr-3 tracking-wide">
                          MONTH
                        </span>
                        <div className="flex items-center">
                          <span 
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedDetailItem({ ...month, type: 'MONTH', description: month.description || '' })
                            }}
                            className="font-bold text-gray-900 text-[15px] mr-1.5 hover:text-[#4f46e5] cursor-pointer transition-colors"
                            title="Нажмите, чтобы переименовать месяц"
                          >
                            {month.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedDetailItem({ ...month, type: 'MONTH', description: month.description || '' })
                            }}
                            className="mr-2 text-gray-300 hover:text-[#4f46e5] p-0.5 rounded"
                            title="Переименовать месяц"
                          >
                            <Edit3 size={13} />
                          </button>
                          <span className="text-xs text-gray-400 font-medium mr-2">
                            ({month.period})
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setTargetMonthId(month.id)
                              setIsAddPlanItemOpen(true)
                            }}
                            className="w-5 h-5 rounded-md bg-purple-50 hover:bg-[#4f46e5] text-purple-600 hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
                            title="Добавить показатель в этот месяц"
                          >
                            <Plus size={13} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>

                      <div className="w-[180px] pr-6 text-right font-bold text-gray-900 text-sm">
                        {month.totalPlan} единиц
                      </div>

                      <div className="w-[160px] pr-6 text-right font-bold text-[#4f46e5] text-sm">
                        {month.allocated} / {month.totalPlan}
                      </div>

                      <div className="w-[180px] pr-6 text-center">
                        {monthExact ? (
                          <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                            <Check size={12} className="mr-1" /> 100% сошлось
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full">
                            Осталось {monthDiff}
                          </span>
                        )}
                      </div>

                      <div className="w-[120px] pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => {
                            setTargetMonthId(month.id)
                            setIsAddPlanItemOpen(true)
                          }}
                          className="w-7 h-7 ml-auto rounded-lg bg-indigo-50 hover:bg-[#4f46e5] text-[#4f46e5] hover:text-white flex items-center justify-center transition-all"
                          title="Добавить план"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* LEVEL 2: PLAN ITEMS */}
                    {month.isOpen && (
                      <div className="divide-y divide-gray-50">
                        {month.items.length === 0 ? (
                          <div className="py-4 pl-16 text-xs text-gray-400 italic">
                            В этом месяце пока нет показателей плана. Нажмите «+» чтобы добавить.
                          </div>
                        ) : (
                          month.items.map((item: any) => {
                            const itemExact = item.allocated === item.monthPlan
                            const itemDiff = item.monthPlan - item.allocated

                            return (
                              <div key={item.id} className="bg-white">
                                <div 
                                  className="flex items-center hover:bg-indigo-50/10 transition-colors py-3.5 px-6 pl-14 cursor-pointer"
                                  onClick={() => togglePlanOpen(item.id)}
                                >
                                  <div className="flex-1 flex items-center">
                                    <button className="text-gray-400 hover:text-gray-700 mr-2">
                                      {item.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                    </button>
                                    <span className="bg-indigo-100 text-[#4f46e5] text-[10px] font-bold px-2 py-0.5 rounded mr-3 tracking-wide">
                                      PLAN
                                    </span>
                                    <span 
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedDetailItem({ ...item, type: 'PLAN_ITEM', description: item.description || '' })
                                      }}
                                      className="font-semibold text-gray-800 text-sm hover:text-[#4f46e5] cursor-pointer transition-colors"
                                      title="Нажмите, чтобы переименовать показатель"
                                    >
                                      {item.name}
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedDetailItem({ ...item, type: 'PLAN_ITEM', description: item.description || '' })
                                      }}
                                      className="ml-1 mr-1.5 text-gray-300 hover:text-[#4f46e5] p-0.5 rounded"
                                      title="Переименовать показатель"
                                    >
                                      <Edit3 size={12} />
                                    </button>
                                    <span className="text-xs text-gray-400 mr-2 font-normal">
                                      ({item.unit})
                                    </span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        setTargetPlanItemId(item.id)
                                        setIsAddSprintOpen(true)
                                      }}
                                      className="w-5 h-5 rounded-md bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
                                      title="Добавить спринт к этому показателю"
                                    >
                                      <Plus size={13} strokeWidth={2.5} />
                                    </button>
                                  </div>

                                  <div className="w-[180px] pr-6 text-right font-bold text-gray-700 text-sm">
                                    {item.monthPlan} {item.unit}
                                  </div>

                                  <div className="w-[160px] pr-6 text-right font-bold text-indigo-600 text-sm">
                                    {item.allocated} / {item.monthPlan}
                                  </div>

                                  <div className="w-[180px] pr-6 text-center">
                                    {itemExact ? (
                                      <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                        <Check size={10} className="mr-1" /> Распределено
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                        Осталось {itemDiff}
                                      </span>
                                    )}
                                  </div>

                                  <div className="w-[120px] pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                                    <button 
                                      onClick={() => {
                                        setTargetPlanItemId(item.id)
                                        setIsAddSprintOpen(true)
                                      }}
                                      className="w-7 h-7 ml-auto rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white flex items-center justify-center transition-all"
                                      title="Добавить спринт"
                                    >
                                      <Plus size={16} />
                                    </button>
                                  </div>
                                </div>

                                {/* LEVEL 3: SPRINTS */}
                                {item.isOpen && (
                                  <div className="bg-slate-50/40 divide-y divide-gray-100/60 pl-24 pr-6 py-1">
                                    {item.sprints.length === 0 ? (
                                      <div className="py-3 text-xs text-gray-400 italic">
                                        Спринты еще не созданы. Нажмите «+» чтобы добавить.
                                      </div>
                                    ) : (
                                      item.sprints.map((sp: any) => (
                                        <div key={sp.id} className="flex items-center py-2.5 hover:bg-white transition-colors rounded-lg px-3 my-0.5">
                                          <div className="flex-1 flex items-center gap-1.5">
                                            <span className="bg-blue-100 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded mr-2 tracking-wide">
                                              SPRINT
                                            </span>
                                            <input 
                                              type="text"
                                              value={sp.name}
                                              onChange={(e) => renamePlanSprint(month.id, item.id, sp.id, e.target.value)}
                                              className="text-sm font-semibold text-gray-700 bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-gray-200 focus:border-[#4f46e5] rounded px-1.5 py-0.5 outline-none transition-colors max-w-xs"
                                              title="Кликните, чтобы сразу переименовать спринт"
                                            />
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedDetailItem({ ...sp, type: 'SPRINT', description: sp.description || '' })
                                              }}
                                              className="text-gray-300 hover:text-[#4f46e5] p-1 rounded"
                                              title="Подробнее и описание"
                                            >
                                              <Edit3 size={12} />
                                            </button>
                                          </div>

                                          <div className="w-[180px] pr-6 text-right">
                                            <div className="inline-flex items-center gap-1.5">
                                              <span className="text-xs text-gray-400 font-medium">План:</span>
                                              <input 
                                                type="number"
                                                value={sp.plan}
                                                onChange={(e) => updateSprintPlanValue(month.id, item.id, sp.id, Number(e.target.value))}
                                                className="w-16 text-right font-bold text-gray-800 bg-white border border-gray-200 rounded px-2 py-0.5 text-xs focus:ring-1 focus:ring-[#4f46e5] outline-none"
                                              />
                                              <span className="text-[11px] text-gray-400">{item.unit}</span>
                                            </div>
                                          </div>

                                          <div className="w-[160px] pr-6 text-right text-xs font-semibold text-gray-600">
                                            Факт: <span className="text-[#4f46e5] font-bold">{sp.fact}</span>
                                          </div>

                                          <div className="w-[180px] pr-6 text-center">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                              sp.status === 'Done' ? 'bg-emerald-50 text-emerald-600' :
                                              sp.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                              'bg-gray-100 text-gray-500'
                                            }`}>
                                              {sp.status}
                                            </span>
                                          </div>

                                          <div className="w-[120px] pr-6 text-right text-xs text-gray-400">
                                            Синхронизировано
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            )
                          })
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TASKS EXECUTION TREE (Epic -> Sprint -> Daily -> Task)             */}
      {/* ========================================================================= */}
      {activeTab === 'tasks' && (
        <div>
          {/* Toolbar */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-4 flex-1">
              <div className="relative w-64">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Поиск задач..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 outline-none w-40 cursor-pointer focus:ring-2 focus:ring-[#4f46e5]/20"
              >
                <option value="ALL">Все типы</option>
                <option value="EPIC">Только Epics</option>
                <option value="SPRINT">Только Спринты</option>
                <option value="DAILY">Только Делики</option>
                <option value="TASK">Только Задачи</option>
              </select>

              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 outline-none w-40 cursor-pointer focus:ring-2 focus:ring-[#4f46e5]/20"
              >
                <option value="ALL">Все статусы</option>
                <option value="Done">Done (Готово)</option>
                <option value="In Progress">In Progress (В работе)</option>
                <option value="Not Done">Not Done (Не начато)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button 
                  onClick={() => setViewMode('list')}
                  title="Табличный вид"
                  className={`p-2.5 transition-colors ${viewMode === 'list' ? 'text-[#4f46e5] bg-indigo-50' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <LayoutList size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('board')}
                  title="Канбан доска"
                  className={`p-2.5 transition-colors ${viewMode === 'board' ? 'text-[#4f46e5] bg-indigo-50' : 'text-gray-400 hover:text-gray-700'}`}
                >
                  <Grip size={18} />
                </button>
              </div>
              
              <button 
                onClick={() => {
                  setModalType('EPIC')
                  setIsModalOpen(true)
                }}
                className="bg-[#5b52f6] hover:bg-[#4f46e5] text-white px-4 py-2.5 text-sm font-bold flex items-center rounded-xl transition-all shadow-sm"
              >
                <Plus size={18} className="mr-1.5" /> Добавить Epic
              </button>

              <button 
                onClick={() => {
                  setModalType('TASK')
                  setIsModalOpen(true)
                }}
                className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2.5 text-sm font-bold flex items-center rounded-xl transition-all shadow-xs"
              >
                <Plus size={18} className="mr-1.5" /> Добавить задачу
              </button>
            </div>
          </div>

          {/* Main View: Tree Table */}
          {viewMode === 'list' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
              <div className="flex bg-white border-b border-gray-100 text-[11px] uppercase font-bold text-gray-400 tracking-wider min-w-[1050px]">
                <div className="flex-1 py-4 px-6 min-w-[300px]">Название (Epic / Sprint / Daily / Task)</div>
                <div className="w-[300px] py-4 pr-6 shrink-0">Описание</div>
                <div className="w-[140px] py-4 pr-6 shrink-0">Статус</div>
                <div className="w-[160px] py-4 pr-6 shrink-0">Кто создал</div>
                <div className="w-[140px] py-4 pr-2 shrink-0">Дата создания</div>
                <div className="w-[120px] py-4 pr-6 text-right shrink-0">Действия</div>
              </div>

              <div className="min-w-[1050px]">
                {filteredTasksTree.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    Ничего не найдено по заданным фильтрам
                  </div>
                ) : (
                  filteredTasksTree.map(node => renderTaskRow(node))
                )}
              </div>
            </div>
          )}

          {/* Alternative View: Kanban Board */}
          {viewMode === 'board' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Not Done', 'In Progress', 'Done'].map(status => {
                const columnTasks = allTasks.filter(i => i.status === status && (typeFilter === 'ALL' || i.type === typeFilter))
                return (
                  <div key={status} className="bg-gray-100/70 rounded-2xl p-4 flex flex-col min-h-[400px]">
                    <div className="flex justify-between items-center mb-4 px-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-800">{status}</span>
                        <span className="text-xs bg-white text-gray-500 font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {columnTasks.length}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {columnTasks.map(task => (
                        <div 
                          key={task.id} 
                          onClick={() => setSelectedDetailItem(task)}
                          className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            {renderBadge(task.type)}
                            <span className="text-xs text-gray-400">{task.date}</span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-900 mb-1 hover:text-[#4f46e5]">{task.name}</h4>
                          <p className="text-xs text-gray-500 mb-4 line-clamp-2">{task.description}</p>
                          
                          <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full ${task.creatorColor} text-white flex items-center justify-center text-[10px] font-bold mr-1.5`}>
                                {task.creatorInitial}
                              </div>
                              <span className="text-xs text-gray-600">{task.creator}</span>
                            </div>
                            {renderStatus(task.status, task.id)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 px-2">
            <span className="text-sm text-gray-500 font-medium">
              Показано {allTasks.length} элементов
            </span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-100 text-[#4f46e5] font-bold text-sm">
                1
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: BLOGGERS & INFLUENCERS LIST                                          */}
      {/* ========================================================================= */}
      {activeTab === 'bloggers' && (
        <div className="space-y-5">
          {/* Top Bar: Title & Primary Action */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Список блогеров ({projectName})</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Нажмите на блогера в списке, чтобы открыть подробную информацию, бриф и ссылку на публикацию
              </p>
            </div>
            
            <button 
              onClick={() => setIsAddBloggerOpen(true)}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl font-medium px-4 py-2.5 text-sm shadow-sm shadow-indigo-100 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus size={16} /> Добавить блогера
            </button>
          </div>

          {/* Search & Platform Filter Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Поиск по имени, нику или заметкам..."
                  value={bloggerSearch}
                  onChange={(e) => setBloggerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#4f46e5] outline-none transition-colors"
                />
              </div>

              {/* Platform Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['ALL', 'Instagram', 'Telegram', 'TikTok', 'YouTube'].map(platform => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setBloggerPlatformFilter(platform)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      bloggerPlatformFilter === platform
                        ? 'bg-[#1a2332] text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {platform === 'ALL' ? 'Все' : platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">Статус:</span>
              <select
                value={bloggerStatusFilter}
                onChange={(e) => setBloggerStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none cursor-pointer focus:bg-white focus:border-[#4f46e5]"
              >
                <option value="ALL">Все статусы</option>
                <option value="Переговоры">Переговоры</option>
                <option value="Согласовано">Согласовано</option>
                <option value="Оплачено">Оплачено</option>
                <option value="Вышел пост">Вышел пост</option>
              </select>
            </div>
          </div>

          {/* Clean Bloggers List */}
          <div className="space-y-3">
            {filteredBloggers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400">
                <Users size={36} className="mx-auto mb-2 text-gray-300 stroke-[1.5]" />
                <p className="font-semibold text-gray-600">Блогеры не найдены</p>
                <p className="text-xs text-gray-400 mt-1">Попробуйте изменить поисковый запрос или фильтр</p>
              </div>
            ) : (
              filteredBloggers.map((blogger) => {
                const isPublished = blogger.status === 'Вышел пост'
                const isPaid = blogger.status === 'Оплачено'
                const isApproved = blogger.status === 'Согласовано'

                return (
                  <div 
                    key={blogger.id}
                    onClick={() => setSelectedBlogger(blogger)}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4 group"
                  >
                    {/* Left: Identity & Platform */}
                    <div className="flex items-center gap-4 min-w-[280px]">
                      <div className={`w-12 h-12 rounded-2xl ${blogger.avatarColor} text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0`}>
                        {blogger.avatarChar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 text-base group-hover:text-[#4f46e5] transition-colors">
                            {blogger.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            blogger.platform === 'Instagram'
                              ? 'bg-pink-50 text-pink-700'
                              : blogger.platform === 'Telegram'
                              ? 'bg-sky-50 text-sky-700'
                              : blogger.platform === 'TikTok'
                              ? 'bg-neutral-100 text-neutral-800'
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {blogger.platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 font-mono mt-0.5">
                          <span>{blogger.handle}</span>
                          <span>•</span>
                          <span className="text-gray-500 font-sans">{blogger.format}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Sprint & Date */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-lg">
                        {blogger.sprint}
                      </div>
                      <span className="text-gray-400 font-medium">{blogger.publishDate}</span>
                    </div>

                    {/* Right: Price, Status & Detailed View CTA */}
                    <div className="flex items-center gap-3 ml-auto">
                      <div className="text-right">
                        <span className="font-bold text-gray-900 font-mono text-sm">{blogger.price}</span>
                        <p className="text-[10px] text-gray-400 font-medium">охват ~{blogger.reach}</p>
                      </div>

                      {/* Status Button */}
                      <button 
                        type="button"
                        onClick={(e) => cycleBloggerStatus(blogger.id, e)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all transform active:scale-95 shadow-sm border ${
                          isPublished
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : isPaid
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            : isApproved
                            ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                            : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Нажмите для быстрой смены статуса"
                      >
                        {isPublished && <CheckCircle2 size={13} className="text-emerald-600" />}
                        {blogger.status}
                      </button>

                      {/* Direct Post Link Icon if published */}
                      {blogger.postUrl && (
                        <a
                          href={blogger.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                          title="Открыть опубликованный пост"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}

                      {/* More Details Action Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedBlogger(blogger)}
                        className="px-3 py-1.5 bg-gray-50 hover:bg-indigo-50 hover:text-[#4f46e5] text-gray-600 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        Подробнее <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Simple Footer Counter */}
          <div className="flex justify-between items-center text-xs text-gray-400 px-2 pt-2">
            <span>Всего в списке: <strong className="text-gray-700">{filteredBloggers.length}</strong> блогеров</span>
            <span>Кликните на строку для открытия брифа, тезисов и контактов</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3 & 4 PLACEHOLDERS                                                    */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          Участники проекта: Азамат (Lead), Дилрабо (Marketing), Джамшид (Medical Rep)
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
          Настройки проекта и интеграции
        </div>
      )}

      {/* ========================================================================= */}
      {/* DETAIL MODAL (Opens for EPIC, SPRINT, DAILY, TASK to write details)       */}
      {/* ========================================================================= */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-7 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {renderBadge(selectedDetailItem.type)}
                <span className="text-xs text-gray-400 font-mono">ID: {selectedDetailItem.id}</span>
              </div>
              <button 
                onClick={() => setSelectedDetailItem(null)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <div className="space-y-6">
              {/* Title & Rename Field */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider flex items-center justify-between">
                  <span>Название ({selectedDetailItem.type})</span>
                  <span className="text-[11px] text-[#4f46e5] font-semibold flex items-center">
                    <Edit3 size={11} className="mr-1" /> Редактируемое поле
                  </span>
                </label>
                <input 
                  type="text" 
                  value={selectedDetailItem.name}
                  onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, name: e.target.value })}
                  placeholder="Введите новое название..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-base font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                />
              </div>

              {/* MONTH specific fields */}
              {selectedDetailItem.type === 'MONTH' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                    Период дат
                  </label>
                  <input 
                    type="text" 
                    value={selectedDetailItem.period || ''}
                    onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, period: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:bg-white outline-none"
                  />
                </div>
              )}

              {/* PLAN_ITEM specific fields */}
              {selectedDetailItem.type === 'PLAN_ITEM' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                      План на месяц
                    </label>
                    <input 
                      type="number" 
                      value={selectedDetailItem.monthPlan || 0}
                      onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, monthPlan: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#4f46e5] focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                      Единица измерения
                    </label>
                    <input 
                      type="text" 
                      value={selectedDetailItem.unit || 'шт'}
                      onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, unit: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:bg-white outline-none"
                    />
                  </div>
                </div>
              )}

              {/* SPRINT (Plans) with target plan */}
              {selectedDetailItem.type === 'SPRINT' && selectedDetailItem.plan !== undefined && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                      План на спринт
                    </label>
                    <input 
                      type="number" 
                      value={selectedDetailItem.plan || 0}
                      onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, plan: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#4f46e5] focus:bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                      Статус
                    </label>
                    <select 
                      value={selectedDetailItem.status || 'Not Done'}
                      onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, status: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-800 focus:bg-white outline-none cursor-pointer"
                    >
                      <option value="Not Done">Not Done</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Tasks Tab items (EPIC, SPRINT, DAILY, TASK) status & assignee */}
              {(selectedDetailItem.type === 'EPIC' || selectedDetailItem.type === 'DAILY' || selectedDetailItem.type === 'TASK' || (selectedDetailItem.type === 'SPRINT' && selectedDetailItem.plan === undefined)) && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                      Статус
                    </label>
                    <select 
                      value={selectedDetailItem.status || 'Not Done'}
                      onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, status: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-gray-800 focus:bg-white outline-none cursor-pointer"
                    >
                      <option value="Not Done">Not Done</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                      Создатель / Ответственный
                    </label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-sm font-medium text-gray-800">
                      <div className={`w-6 h-6 rounded-full ${selectedDetailItem.creatorColor || 'bg-indigo-400'} text-white flex items-center justify-center text-xs font-bold mr-2`}>
                        {selectedDetailItem.creatorInitial || 'A'}
                      </div>
                      <span>{selectedDetailItem.creator || 'Азамат'}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider">
                      Дата создания
                    </label>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-gray-600">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      <span>{selectedDetailItem.date || '01.09.2026'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1.5 tracking-wider flex items-center gap-1.5">
                  <AlignLeft size={14} /> Подробное описание, требования и заметки
                </label>
                <textarea 
                  rows={5}
                  placeholder="Опишите подробно задачи, цели, требования, чек-лист или ссылки..." 
                  value={selectedDetailItem.description || ''}
                  onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium text-gray-800 leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                />
              </div>

              {/* Sub-items summary if has children */}
              {selectedDetailItem.children && (
                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <h4 className="text-xs font-bold uppercase text-gray-500 mb-2">
                    Вложенных элементов: {selectedDetailItem.children.length}
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {selectedDetailItem.children.map((child: any) => (
                      <div key={child.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-gray-100">
                        <div className="flex items-center">
                          {renderBadge(child.type)}
                          <span className="font-semibold text-gray-800">{child.name}</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          child.status === 'Done' ? 'bg-emerald-50 text-emerald-600' :
                          child.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {child.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setSelectedDetailItem(null)}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Закрыть
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveDetail(selectedDetailItem)}
                  className="px-6 py-2.5 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-sm transition-all flex items-center"
                >
                  <Check size={16} className="mr-1.5" /> Сохранить изменения
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Create Task / Daily / Sprint / Epic                                */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Создать элемент проекта</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTaskItem} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Тип элемента
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['EPIC', 'SPRINT', 'DAILY', 'TASK'] as const).map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setModalType(type)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        modalType === type 
                          ? 'bg-[#4f46e5] text-white border-[#4f46e5] shadow-sm' 
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* SPRINT parent selector: choose EPIC */}
              {modalType === 'SPRINT' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    В какой Epic добавить?
                  </label>
                  <select 
                    value={modalParentId}
                    onChange={(e) => setModalParentId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="">-- Выберите Epic --</option>
                    {availableEpics.map(e => (
                      <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* DAILY parent selector: choose SPRINT */}
              {modalType === 'DAILY' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    В какой Спринт добавить?
                  </label>
                  <select 
                    value={modalParentId}
                    onChange={(e) => setModalParentId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="">-- Выберите Спринт --</option>
                    {availableSprints.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.epicName})</option>
                    ))}
                  </select>
                </div>
              )}

              {/* TASK parent selector: choose DAILY */}
              {modalType === 'TASK' && (
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    В какой Делик добавить?
                  </label>
                  <select 
                    value={modalParentId}
                    onChange={(e) => setModalParentId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none cursor-pointer"
                  >
                    <option value="">-- Выберите Делик --</option>
                    {availableDailies.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.sprintName})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Название *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={
                    modalType === 'EPIC' ? 'Например: Продвижение в Q4' : 
                    modalType === 'SPRINT' ? 'Спринт 3: Запуск' : 
                    modalType === 'DAILY' ? 'Делик 12.09: Подготовка баннеров' :
                    'Написать текст для промо-поста'
                  } 
                  value={modalName}
                  onChange={(e) => setModalName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Подробное описание
                </label>
                <textarea 
                  rows={3}
                  placeholder="Детали, критерии завершения, инструкции..." 
                  value={modalDesc}
                  onChange={(e) => setModalDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Статус
                </label>
                <select 
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none cursor-pointer"
                >
                  <option value="Not Done">Not Done</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl"
                >
                  Создать
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS FOR PLANS TAB (Month, Plan Item, Sprint)                           */}
      {/* ========================================================================= */}
      {isAddMonthOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Добавить месяц планирования</h3>
              <button onClick={() => setIsAddMonthOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddMonth} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Название месяца *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Например: Ноябрь 2026" 
                  value={newMonthName}
                  onChange={(e) => setNewMonthName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Период дат
                </label>
                <input 
                  type="text" 
                  placeholder="01.11.2026 — 30.11.2026" 
                  value={newMonthPeriod}
                  onChange={(e) => setNewMonthPeriod(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddMonthOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl"
                >
                  Создать месяц
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddPlanItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Добавить показатель в план месяца</h3>
              <button onClick={() => setIsAddPlanItemOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddPlanItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Показатель / Задача *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Например: Фармкружки Ташкент" 
                  value={newPlanItemName}
                  onChange={(e) => setNewPlanItemName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Единица измерения
                  </label>
                  <input 
                    type="text" 
                    placeholder="визитов, шт, точек" 
                    value={newPlanItemUnit}
                    onChange={(e) => setNewPlanItemUnit(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    План на месяц *
                  </label>
                  <input 
                    type="number" 
                    required
                    value={newPlanItemTarget}
                    onChange={(e) => setNewPlanItemTarget(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#4f46e5] focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddPlanItemOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl"
                >
                  Добавить показатель
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAddSprintOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Добавить спринт к показателю</h3>
              <button onClick={() => setIsAddSprintOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSprint} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Название спринта *
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="Например: Спринт 5 (Финальный рывок)" 
                  value={newSprintName}
                  onChange={(e) => setNewSprintName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  План на этот спринт *
                </label>
                <input 
                  type="number" 
                  required
                  value={newSprintPlan}
                  onChange={(e) => setNewSprintPlan(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-[#4f46e5] focus:bg-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddSprintOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl"
                >
                  Создать спринт
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD BLOGGER                                                        */}
      {/* ========================================================================= */}
      {isAddBloggerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4f46e5] flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Добавить блогера / инфлюенсера</h3>
                  <p className="text-xs text-gray-400">Проект: {projectName}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddBloggerOpen(false)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddBlogger} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Имя блогера *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="Например: Дилноза Кубаева" 
                    value={bName}
                    onChange={(e) => setBName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Никнейм / Handle *
                  </label>
                  <input 
                    type="text" 
                    required
                    placeholder="@username" 
                    value={bHandle}
                    onChange={(e) => setBHandle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Платформа
                  </label>
                  <select
                    value={bPlatform}
                    onChange={(e) => setBPlatform(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="Telegram">Telegram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="YouTube">YouTube</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Подписчики
                  </label>
                  <input 
                    type="text" 
                    placeholder="500K" 
                    value={bFollowers}
                    onChange={(e) => setBFollowers(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Прогноз охвата
                  </label>
                  <input 
                    type="text" 
                    placeholder="60K" 
                    value={bReach}
                    onChange={(e) => setBReach(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Формат интеграции
                  </label>
                  <input 
                    type="text" 
                    placeholder="Reels + Stories" 
                    value={bFormat}
                    onChange={(e) => setBFormat(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Стоимость / Бюджет
                  </label>
                  <input 
                    type="text" 
                    placeholder="$300" 
                    value={bPrice}
                    onChange={(e) => setBPrice(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-600 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Спринт
                  </label>
                  <select
                    value={bSprint}
                    onChange={(e) => setBSprint(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  >
                    <option value="Спринт 1">Спринт 1</option>
                    <option value="Спринт 2">Спринт 2</option>
                    <option value="Спринт 3">Спринт 3</option>
                    <option value="Спринт 4">Спринт 4</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Планируемая дата выхода
                  </label>
                  <input 
                    type="text" 
                    placeholder="15.09.2026" 
                    value={bDate}
                    onChange={(e) => setBDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Контакт менеджера
                  </label>
                  <input 
                    type="text" 
                    placeholder="+998 90 000 00 00 или @manager" 
                    value={bContact}
                    onChange={(e) => setBContact(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Тезисы ТЗ / Заметки
                </label>
                <textarea 
                  rows={3}
                  placeholder="Основные требования, продукт для интеграции, акценты в сценарии..."
                  value={bNotes}
                  onChange={(e) => setBNotes(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:bg-white outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddBloggerOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-sm"
                >
                  Добавить в базу
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: VIEW / EDIT BLOGGER DETAILS & LINK                                 */}
      {/* ========================================================================= */}
      {selectedBlogger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${selectedBlogger.avatarColor} text-white flex items-center justify-center font-bold text-lg shadow-sm`}>
                  {selectedBlogger.avatarChar}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-xl">{selectedBlogger.name}</h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-md font-semibold bg-gray-100 text-gray-700">
                      {selectedBlogger.platform}
                    </span>
                  </div>
                  <p className="text-xs text-indigo-600 font-mono mt-0.5">{selectedBlogger.handle}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedBlogger(null)} 
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-[11px] font-bold text-gray-400 uppercase">Подписчики</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">{selectedBlogger.followers}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-[11px] font-bold text-gray-400 uppercase">Охват публикации</p>
                <p className="text-base font-bold text-emerald-600 mt-0.5">{selectedBlogger.reach}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-[11px] font-bold text-gray-400 uppercase">Бюджет</p>
                <p className="text-base font-bold text-gray-900 mt-0.5">{selectedBlogger.price}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl">
                <p className="text-[11px] font-bold text-gray-400 uppercase">Спринт</p>
                <p className="text-base font-bold text-indigo-600 mt-0.5">{selectedBlogger.sprint}</p>
              </div>
            </div>

            {/* Editable Details Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Статус размещения
                  </label>
                  <select
                    value={selectedBlogger.status}
                    onChange={(e) => setSelectedBlogger({ ...selectedBlogger, status: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-800 outline-none focus:bg-white cursor-pointer"
                  >
                    <option value="Переговоры">⏳ Переговоры</option>
                    <option value="Согласовано">🤝 Согласовано</option>
                    <option value="Оплачено">💳 Оплачено</option>
                    <option value="Вышел пост">✅ Вышел пост</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                    Дата выхода
                  </label>
                  <input
                    type="text"
                    value={selectedBlogger.publishDate}
                    onChange={(e) => setSelectedBlogger({ ...selectedBlogger, publishDate: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                  />
                </div>
              </div>

              {/* Live Post Link Tracking */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Link2 size={14} className="text-[#4f46e5]" /> Ссылка на вышедший пост / Stories
                  </span>
                  {selectedBlogger.postUrl && (
                    <a 
                      href={selectedBlogger.postUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#4f46e5] hover:underline flex items-center gap-1 text-[11px] lowercase"
                    >
                      перейти по ссылке <ExternalLink size={12} />
                    </a>
                  )}
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="https://instagram.com/p/... или https://t.me/..." 
                    value={selectedBlogger.postUrl || ''}
                    onChange={(e) => setSelectedBlogger({ ...selectedBlogger, postUrl: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-800 focus:bg-white focus:border-[#4f46e5] outline-none"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Контакт менеджера / телефон / Telegram
                </label>
                <input 
                  type="text" 
                  value={selectedBlogger.managerContact || ''}
                  onChange={(e) => setSelectedBlogger({ ...selectedBlogger, managerContact: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white outline-none"
                />
              </div>

              {/* Notes & Brief */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1.5">
                  Тезисы интеграции, сценарий и комментарии
                </label>
                <textarea 
                  rows={4}
                  value={selectedBlogger.notes || ''}
                  onChange={(e) => setSelectedBlogger({ ...selectedBlogger, notes: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-medium focus:bg-white outline-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={(e) => {
                    deleteBlogger(selectedBlogger.id, e)
                    setSelectedBlogger(null)
                  }}
                  className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <Trash2 size={14} /> Удалить блогера
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBlogger(null)}
                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                  >
                    Закрыть
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSaveBlogger(selectedBlogger)}
                    className="px-5 py-2 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-sm cursor-pointer"
                  >
                    Сохранить изменения
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
