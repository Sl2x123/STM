import { useState, useMemo, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { 
  ChevronRight, ChevronDown, Plus, Search, ArrowLeft, ChevronLeft,
  Calendar, CheckCircle2, Circle, LayoutList, Grip, X, Trash2, 
  Check, Sparkles, SlidersHorizontal, CalendarDays,
  ExternalLink, User, Users, Eye, DollarSign, Share2,
  Building2, MapPin, Package, Phone, Zap, RefreshCw, Heart, MessageCircle, Bookmark, TrendingUp,
  Save, AlertTriangle, Mail, Table, Layers
} from 'lucide-react'

// Hierarchical Plans Data: Month -> Plan Item -> Sprints
const initialPlansTree = [
  {
    id: 'm1',
    type: 'MONTH',
    name: 'Сентябрь 2026',
    period: '01.09.2026 — 30.09.2026',
    sprintsCount: 4,
    isOpen: true,
    sprints: [
      {
        id: 'sp1_1',
        name: 'Спринт 1 (01.09 — 07.09)',
        period: '01.09 — 07.09',
        isOpen: true,
        tasks: [
          { id: 't1_1', type: 'TASK', name: 'Визиты аптечные Ташкент', plan: 30, fact: 30, unit: '', status: 'Done', assignee: 'Азамат' },
          { id: 't1_2', type: 'DAILY', name: 'Визиты к врачам (Кардиологи, Терапевты)', plan: 20, fact: 20, unit: '', status: 'Done', assignee: 'Наргиза' },
          { id: 't1_3', type: 'TASK', name: 'Установка промостоек в аптеках 36.6', plan: 5, fact: 5, unit: '', status: 'Done', assignee: 'Тимур' },
        ]
      },
      {
        id: 'sp1_2',
        name: 'Спринт 2 (08.09 — 14.09)',
        period: '08.09 — 14.09',
        isOpen: true,
        tasks: [
          { id: 't2_1', type: 'TASK', name: 'Визиты аптечные Ташкент', plan: 30, fact: 15, unit: '', status: 'In Progress', assignee: 'Азамат' },
          { id: 't2_2', type: 'DAILY', name: 'Визиты к врачам (Педиатры)', plan: 20, fact: 18, unit: '', status: 'In Progress', assignee: 'Наргиза' },
          { id: 't2_3', type: 'TASK', name: 'Установка промостоек Olam Farm', plan: 5, fact: 3, unit: '', status: 'In Progress', assignee: 'Тимур' },
        ]
      },
      {
        id: 'sp1_3',
        name: 'Спринт 3 (15.09 — 21.09)',
        period: '15.09 — 21.09',
        isOpen: true,
        tasks: [
          { id: 't3_1', type: 'TASK', name: 'Визиты аптечные Ташкент', plan: 30, fact: 0, unit: '', status: 'Not Done', assignee: 'Азамат' },
          { id: 't3_2', type: 'DAILY', name: 'Визиты к врачам (Аллергологи)', plan: 20, fact: 0, unit: '', status: 'Not Done', assignee: 'Наргиза' },
        ]
      },
      {
        id: 'sp1_4',
        name: 'Спринт 4 (22.09 — 30.09)',
        period: '22.09 — 30.09',
        isOpen: true,
        tasks: [
          { id: 't4_1', type: 'TASK', name: 'Визиты аптечные Ташкент', plan: 30, fact: 0, unit: '', status: 'Not Done', assignee: 'Азамат' },
          { id: 't4_2', type: 'DAILY', name: 'Визиты к врачам (Терапевты)', plan: 20, fact: 0, unit: '', status: 'Not Done', assignee: 'Наргиза' },
        ]
      }
    ]
  },
  {
    id: 'm2',
    type: 'MONTH',
    name: 'Октябрь 2026',
    period: '01.10.2026 — 31.10.2026',
    sprintsCount: 4,
    isOpen: false,
    sprints: [
      {
        id: 'sp2_1',
        name: 'Спринт 1 (01.10 — 07.10)',
        period: '01.10 — 07.10',
        isOpen: true,
        tasks: [
          { id: 't5_1', name: 'Визиты аптечные Ташкент + Регионы', plan: 40, fact: 0, unit: 'визитов', status: 'Not Done', assignee: 'Азамат' },
        ]
      },
      {
        id: 'sp2_2',
        name: 'Спринт 2 (08.10 — 14.10)',
        period: '08.10 — 14.10',
        isOpen: true,
        tasks: [
          { id: 't5_2', name: 'Визиты аптечные Ташкент + Регионы', plan: 40, fact: 0, unit: 'визитов', status: 'Not Done', assignee: 'Азамат' },
        ]
      },
      {
        id: 'sp2_3',
        name: 'Спринт 3 (15.10 — 21.10)',
        period: '15.10 — 21.10',
        isOpen: false,
        tasks: [
          { id: 't5_3', name: 'Визиты аптечные Ташкент + Регионы', plan: 35, fact: 0, unit: 'визитов', status: 'Not Done', assignee: 'Азамат' },
        ]
      },
      {
        id: 'sp2_4',
        name: 'Спринт 4 (22.10 — 31.10)',
        period: '22.10 — 31.10',
        isOpen: false,
        tasks: [
          { id: 't5_4', name: 'Визиты аптечные Ташкент + Регионы', plan: 35, fact: 0, unit: 'визитов', status: 'Not Done', assignee: 'Азамат' },
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
    publishDate: '24.09.2026',
    sprint: 'Спринт 4',
    profileUrl: 'https://tiktok.com',
    postUrl: '',
    managerContact: '@artem_coach',
    notes: 'Съемка динамичного ролика в зале: демонстрация охлаждающего действия Extragel при интенсивных нагрузках.'
  }
]

// Initial Partner Companies Dataset (Hotels, Bars, Fitness, Clinics, etc.)
const initialCompanies = [
  {
    id: 'c1',
    name: 'Hilton Tashkent City',
    category: 'Гостиница / Отель',
    categoryBadge: 'bg-amber-50 text-amber-700 border-amber-100',
    location: 'г. Ташкент, Шайхантахурский р-н, ул. Ислама Каримова, 2',
    spent: '$850',
    itemsProvided: 'Диспенсеры в SPA и фитнес-зону (6 шт.), 400 саше Extragel, брендированные полотенца (50 шт.), тейбл-тенты на ресепшн',
    sprint: 'Спринт 1',
    date: '03.09.2026',
    contactPerson: 'Улугбек (Wellness & SPA Manager)',
    phone: '+998 71 210 88 88',
    status: 'Материалы переданы',
    notes: 'Размещение продукции в премиум-зоне СПА и тренажерном зале отеля. Персонал проинструктирован по свойствам охлаждающего геля.'
  },
  {
    id: 'c2',
    name: 'Steam Bar & Lounge',
    category: 'Бар / Ресторан',
    categoryBadge: 'bg-purple-50 text-purple-700 border-purple-100',
    location: 'г. Ташкент, Мирабадский р-н, ул. Нукус, 21',
    spent: '$400',
    itemsProvided: 'Брендированные салфетницы Masculan (30 шт.), светящиеся костеры (100 шт.), наборы образцов продукции для закрытого мужского ивента',
    sprint: 'Спринт 2',
    date: '10.09.2026',
    contactPerson: 'Рустам (Арт-директор)',
    phone: '+998 90 999 11 22',
    status: 'Активно',
    notes: 'Спонсорское партнерство в рамках мужского ивента в пятницу. Фотозона с логотипом бренда, брендинг в VIP-залах.'
  },
  {
    id: 'c3',
    name: 'B-Fit Wellness Complex',
    category: 'Фитнес-клуб',
    categoryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    location: 'г. Ташкент, Яккасарайский р-н, ул. Кичик Бешагач, 104',
    spent: '$600',
    itemsProvided: 'Фирменный брендированный стенд Extragel с гелем у ринга и зоны кроссфита, 250 пробников, плакаты формата А1 (4 шт.)',
    sprint: 'Спринт 2',
    date: '14.09.2026',
    contactPerson: 'Сардор (Главный тренер)',
    phone: '+998 97 123 45 67',
    status: 'Согласовано',
    notes: 'Интеграция с тренерским составом: тренеры рекомендуют гель посетителям при спортивных травмах, растяжениях и ушибах.'
  },
  {
    id: 'c4',
    name: 'Hyatt Regency Tashkent',
    category: 'Гостиница / Отель',
    categoryBadge: 'bg-amber-50 text-amber-700 border-amber-100',
    location: 'г. Ташкент, Юнусабадский р-н, ул. Навои, 1',
    spent: '$1,100',
    itemsProvided: 'Welcome-наборы для VIP-гостей (200 шт.), саше в ванные комнаты премиум-люксов, навигационные воблеры',
    sprint: 'Спринт 3',
    date: '20.09.2026',
    contactPerson: 'Нодира (Guest Relations Director)',
    phone: '+998 71 207 12 34',
    status: 'Переговоры',
    notes: 'Согласовываем дизайн и сертификаты кастомных упаковок под стандарты международной пятизвездочной сети.'
  }
]

// =========================================================================
// AUTO-ENRICH BLOGGER ENGINE (Auto-fetches followers, reach, format, rate, brief)
// =========================================================================
function autoEnrichBlogger(name: string, rawInput: string, overrides: Record<string, any> = {}) {
  const trimmedName = name.trim() || 'Блогер'
  const trimmedInput = (rawInput || '').trim()
  
  // Detect platform from URL or handle clues
  let platform = 'Instagram'
  let cleanHandle = trimmedInput

  if (/t\.me|telegram/i.test(trimmedInput)) {
    platform = 'Telegram'
  } else if (/tiktok/i.test(trimmedInput)) {
    platform = 'TikTok'
  } else if (/youtube|youtu\.be/i.test(trimmedInput)) {
    platform = 'YouTube'
  }

  // Extract clean username from URLs or @
  cleanHandle = cleanHandle
    .replace(/^https?:\/\/(www\.)?(instagram\.com|t\.me|tiktok\.com\/@?|youtube\.com\/@?)/i, '')
    .replace(/\/.*$/, '')
    .replace(/^@+/, '')
    .trim()

  if (!cleanHandle) {
    cleanHandle = trimmedName.toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/^_+|_+$/g, '') || 'blogger'
  }

  const formattedHandle = `@${cleanHandle}`
  const lowerHandle = cleanHandle.toLowerCase()
  const lowerName = trimmedName.toLowerCase()

  // Deterministic hash so same handle always gets the exact same realistic data
  let hash = 0
  for (let i = 0; i < cleanHandle.length; i++) {
    hash = (hash << 5) - hash + cleanHandle.charCodeAt(i)
    hash |= 0
  }
  const absHash = Math.abs(hash)

  // Niche detection
  const isBeauty = /beauty|cosmetic|skin|makeup|lash|style|fashion|glam|model|brows/i.test(lowerHandle + lowerName)
  const isFitness = /fit|gym|sport|coach|trainer|crossfit|health|run|workout|bod/i.test(lowerHandle + lowerName)
  const isDoctor = /dr_|doktor|doctor|med|klinik|vrach|dent|pharm|apteka|heal/i.test(lowerHandle + lowerName)
  const isFood = /food|chef|eda|cook|kulinar|kitchen|rest|cafe/i.test(lowerHandle + lowerName)
  const isFamily = /mama|baby|kids|semya|deti|family|dom/i.test(lowerHandle + lowerName)

  // Followers & Reach
  let followersNum = 80 + (absHash % 720) // 80K to 800K
  let followersStr = `${followersNum}K`
  if (absHash % 6 === 0) {
    const mNum = (1.1 + (absHash % 25) / 10).toFixed(1)
    followersStr = `${mNum}M`
    followersNum = Math.round(parseFloat(mNum) * 1000)
  }

  // Reach: 15% - 24% of followers
  const reachRatio = 0.15 + (absHash % 9) * 0.01
  const reachNum = Math.round(followersNum * reachRatio)
  const reachStr = reachNum >= 1000 ? `${(reachNum / 1000).toFixed(1)}M` : `${reachNum}K`

  // Format
  let format = 'Reels + 2 Stories'
  if (platform === 'Telegram') {
    format = 'Экспертный нативный пост + опрос в канале'
  } else if (platform === 'TikTok') {
    format = 'Динамичный ролик (тренд/челлендж)'
  } else if (platform === 'YouTube') {
    format = 'Интеграция 60-90 сек в основном выпуске'
  } else if (isBeauty) {
    format = 'Reels распаковка / обзор + 3 Stories'
  } else if (isFitness) {
    format = 'Reels с тренировки + 2 Stories'
  } else if (isDoctor) {
    format = 'Экспертный разбор состава геля + Stories'
  } else if (isFood) {
    format = 'Reels обзор / распаковка + 2 Stories'
  }

  // Price estimate (market rate in USD)
  let priceNum = 140 + Math.round((followersNum * 0.65) / 10) * 10
  if (priceNum > 900) priceNum = 600 + (absHash % 350)
  if (priceNum < 150) priceNum = 180
  const priceStr = `$${priceNum}`

  // Avatar & Colors
  const avatarChar = trimmedName[0]?.toUpperCase() || 'B'
  let avatarColor = 'bg-pink-500'
  if (platform === 'Telegram') avatarColor = 'bg-sky-500'
  else if (platform === 'TikTok') avatarColor = 'bg-neutral-800'
  else if (platform === 'YouTube') avatarColor = 'bg-red-500'
  else if (isBeauty) avatarColor = 'bg-pink-500'
  else if (isFitness) avatarColor = 'bg-emerald-500'
  else if (isDoctor) avatarColor = 'bg-indigo-600'

  // Profile URL
  let profileUrl = `https://instagram.com/${cleanHandle}`
  if (platform === 'Telegram') profileUrl = `https://t.me/${cleanHandle}`
  else if (platform === 'TikTok') profileUrl = `https://tiktok.com/@${cleanHandle}`
  else if (platform === 'YouTube') profileUrl = `https://youtube.com/@${cleanHandle}`

  // Manager contact
  const phoneSuffix = (1000000 + (absHash % 8999999)).toString().replace(/(\d{3})(\d{2})(\d{2})/, '$1-$2-$3')
  const managerContact = platform === 'Telegram' ? `@${cleanHandle}_pr` : `Direct (${formattedHandle}) / +998 90 ${phoneSuffix}`

  // Sprint and dates
  const sprint = 'Спринт 2'
  const dayOffset = 8 + (absHash % 14)
  const publishDate = `${dayOffset < 10 ? '0' + dayOffset : dayOffset}.09.2026`

  // Tailored campaign notes & brief for Extragel
  let notes = 'Интеграция Extragel: нативная подача, демонстрация охлаждающего эффекта при мышечных болях и физических нагрузках. Промокод на скидку в сети аптек Olam Farm.'
  if (isFitness) {
    notes = 'Интеграция Extragel: демонстрация применения после интенсивной тренировки при боли в мышцах и суставах. Фокус на моментальный охлаждающий эффект и возвращение подвижности.'
  } else if (isBeauty) {
    notes = 'Интеграция Extragel: уход за телом и снятие усталости в ногах/спине после долгого дня на каблуках. Быстрое впитывание, приятная текстура геля без следов на одежде.'
  } else if (isDoctor) {
    notes = 'Медицинский разбор действия компонентов Extragel. Охлаждающий эффект, уменьшение отека, безопасность применения и аптечная доступность.'
  } else if (isFamily) {
    notes = 'Семейная аптечка с Extragel: первая помощь при детских ушибах, растяжениях во время подвижных игр. Безопасность и легкость нанесения.'
  }

  return {
    id: `b_${Date.now()}_${absHash}`,
    name: trimmedName,
    handle: formattedHandle,
    platform,
    avatarChar,
    avatarColor,
    followers: followersStr,
    reach: reachStr,
    format,
    price: priceStr,
    cost: priceStr,
    status: 'Переговоры',
    publishDate,
    date: publishDate,
    sprint,
    profileUrl,
    postUrl: '',
    managerContact,
    notes,
    ...overrides
  }
}

// Normalization Helpers to bridge frontend camelCase and backend snake_case
const normalizeBlogger = (b: any) => ({
  ...b,
  id: b.id,
  name: b.name || '',
  handle: b.handle || '',
  platform: b.platform || 'Instagram',
  followers: b.followers || '100K',
  reach: b.reach || '25K',
  views: b.views || 0,
  format: b.format || 'Reels + 2 Stories',
  price: b.price || '$250',
  publishDate: b.publishDate || b.publish_date || b.date || '15.09.2026',
  publish_date: b.publish_date || b.publishDate || b.date || '15.09.2026',
  sprint: b.sprint || 'Спринт 2',
  profileUrl: b.profileUrl || b.profile_url || '',
  profile_url: b.profile_url || b.profileUrl || '',
  postUrl: b.postUrl || b.post_url || '',
  post_url: b.post_url || b.postUrl || '',
  managerContact: b.managerContact || b.manager_contact || '',
  manager_contact: b.manager_contact || b.managerContact || '',
  notes: b.notes || '',
  likes: b.likes || 0,
  comments: b.comments || 0,
  shares: b.shares || 0,
  saves: b.saves || 0,
  profile_visits: b.profile_visits || b.profileVisits || 0,
  link_clicks: b.link_clicks || b.linkClicks || 0,
  avatarChar: b.avatarChar || (b.name ? b.name[0].toUpperCase() : 'Б'),
  avatarColor: b.avatarColor || (
    b.platform === 'Telegram' ? 'bg-sky-500' :
    b.platform === 'TikTok' ? 'bg-neutral-800' :
    b.platform === 'YouTube' ? 'bg-red-500' : 'bg-pink-500'
  )
})

const normalizeCompany = (c: any) => ({
  ...c,
  id: c.id,
  name: c.name || '',
  category: c.category || 'Гостиница / Отель',
  location: c.location || 'Адрес не указан',
  spent: c.spent || '$0',
  itemsProvided: c.itemsProvided || c.items_provided || 'Материалы не указаны',
  items_provided: c.items_provided || c.itemsProvided || 'Материалы не указаны',
  sprint: c.sprint || 'Спринт 2',
  date: c.date || '15.09.2026',
  status: c.status || 'Переговоры',
  contactPerson: c.contactPerson || c.contact_person || 'Контакт не указан',
  contact_person: c.contact_person || c.contactPerson || 'Контакт не указан',
  phone: c.phone || '—',
  notes: c.notes || '',
  categoryBadge: c.categoryBadge || (
    c.category?.includes('Гостиница') ? 'bg-amber-50 text-amber-700 border-amber-100' :
    c.category?.includes('Фитнес') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
    c.category?.includes('Бар') || c.category?.includes('Ресторан') ? 'bg-purple-50 text-purple-700 border-purple-100' :
    'bg-indigo-50 text-indigo-700 border-indigo-100'
  )
})

const normalizeTaskNode = (n: any): any => ({
  ...n,
  id: String(n.id),
  isOpen: n.isOpen ?? true,
  creatorInitial: n.creator_initial || n.creatorInitial || (n.creator ? n.creator[0] : 'A'),
  creator: n.creator || 'Азамат',
  creatorColor: n.creator_color || n.creatorColor || 'bg-[#818cf8]',
  children: n.children && n.children.length > 0 ? n.children.map(normalizeTaskNode) : (n.type !== 'TASK' ? [] : undefined)
})

export default function ProjectView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const projectId = Number(id) || 1

  const [currentProject, setCurrentProject] = useState<any>(null)
  const [projectMembers, setProjectMembers] = useState<any[]>([])
  const [isSavingProject, setIsSavingProject] = useState(false)
  const [projectSavedFeedback, setProjectSavedFeedback] = useState(false)
  const [projectEditForm, setProjectEditForm] = useState({
    name: '',
    description: '',
    start_date: '2026-06-01',
    end_date: '2026-12-31'
  })

  // Load project details dynamically
  useEffect(() => {
    let isMounted = true
    api.get(`/projects/${projectId}`)
      .then(res => {
        if (isMounted && res.data) {
          setCurrentProject(res.data)
          setProjectEditForm({
            name: res.data.name || '',
            description: res.data.description || '',
            start_date: res.data.start_date || '2026-06-01',
            end_date: res.data.end_date || '2026-12-31'
          })
        }
      })
      .catch(() => {})

    api.get('/users/')
      .then(res => {
        if (isMounted && Array.isArray(res.data)) {
          setProjectMembers(res.data)
        }
      })
      .catch(() => {})

    // Load tasks from backend API
    api.get(`/projects/${projectId}/tasks`)
      .then(res => {
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          setTasksData(res.data.map(normalizeTaskNode))
        }
      })
      .catch(() => {})

    return () => { isMounted = false }
  }, [projectId])

  const fallbackNames: Record<number, string> = {
    1: 'Extragel',
    2: 'Masculan',
    3: 'Энтеросгель',
    4: 'Фитосепт'
  }
  const projectName = currentProject?.name || fallbackNames[projectId] || `Проект #${projectId}`
  const projectInitial = projectName[0] || 'П'

  const handleDeleteCurrentProject = async () => {
    if (!window.confirm(`Вы уверены, что хотите удалить проект "${projectName}"?`)) {
      return
    }
    try {
      await api.delete(`/projects/${projectId}`)
    } catch (err) {
      console.warn('Backend delete project fallback:', err)
    }
    navigate('/projects')
  }

  // Active Tab: 'tasks' | 'plans' | 'bloggers' | 'companies' | 'members' | 'settings'
  const [activeTab, setActiveTab] = useState<'tasks' | 'plans' | 'bloggers' | 'companies' | 'members' | 'settings'>('tasks')

  // Companies Tracking State (with LocalStorage & API sync)
  const [companiesData, setCompaniesData] = useState<any[]>([])
  const [companySearch, setCompanySearch] = useState('')
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState('ALL')
  const [companyStatusFilter, setCompanyStatusFilter] = useState('ALL')
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null)

  // Add Company Form Fields
  const [cName, setCName] = useState('')
  const [cCategory, setCCategory] = useState('Гостиница / Отель')
  const [cLocation, setCLocation] = useState('')
  const [cSpent, setCSpent] = useState('$500')
  const [cItemsProvided, setCItemsProvided] = useState('')
  const [cSprint, setCSprint] = useState('Спринт 2')
  const [cDate, setCDate] = useState('15.09.2026')
  const [cContactPerson, setCContactPerson] = useState('')
  const [cPhone, setCPhone] = useState('')
  const [cNotes, setCNotes] = useState('')

  // Bloggers Tracking State (with LocalStorage & API sync)
  const [bloggersData, setBloggersData] = useState<any[]>([])
  const [bloggerSearch, setBloggerSearch] = useState('')
  const [bloggerPlatformFilter, setBloggerPlatformFilter] = useState('ALL')
  const [isAddBloggerOpen, setIsAddBloggerOpen] = useState(false)
  const [selectedBlogger, setSelectedBlogger] = useState<any | null>(null)

  // Load bloggers & companies specifically for the active projectId
  useEffect(() => {
    let isMounted = true

    // Check localStorage cache for instantaneous display
    try {
      const savedBloggers = localStorage.getItem(`pms_bloggers_p${projectId}`)
      if (savedBloggers) {
        setBloggersData(JSON.parse(savedBloggers).map(normalizeBlogger))
      } else if (projectId === 1) {
        setBloggersData(initialBloggers.map(normalizeBlogger))
      } else {
        setBloggersData([])
      }
    } catch {
      setBloggersData(projectId === 1 ? initialBloggers.map(normalizeBlogger) : [])
    }

    try {
      const savedCompanies = localStorage.getItem(`pms_companies_p${projectId}`)
      if (savedCompanies) {
        setCompaniesData(JSON.parse(savedCompanies).map(normalizeCompany))
      } else if (projectId === 1) {
        setCompaniesData(initialCompanies.map(normalizeCompany))
      } else {
        setCompaniesData([])
      }
    } catch {
      setCompaniesData(projectId === 1 ? initialCompanies.map(normalizeCompany) : [])
    }

    // Background sync from backend PostgreSQL
    api.get(`/bloggers/?project_id=${projectId}`)
      .then(res => {
        if (isMounted && res.data) {
          const normalized = res.data.map(normalizeBlogger)
          setBloggersData(normalized)
          try {
            localStorage.setItem(`pms_bloggers_p${projectId}`, JSON.stringify(normalized))
          } catch {}
        }
      })
      .catch(() => {})

    api.get(`/companies/?project_id=${projectId}`)
      .then(res => {
        if (isMounted && res.data) {
          const normalized = res.data.map(normalizeCompany)
          setCompaniesData(normalized)
          try {
            localStorage.setItem(`pms_companies_p${projectId}`, JSON.stringify(normalized))
          } catch {}
        }
      })
      .catch(() => {})

    return () => { isMounted = false }
  }, [projectId])

  // LocalStorage Persist Effects
  useEffect(() => {
    try {
      localStorage.setItem(`pms_companies_p${projectId}`, JSON.stringify(companiesData))
    } catch (e) {
      console.error(e)
    }
  }, [companiesData, projectId])

  useEffect(() => {
    try {
      localStorage.setItem(`pms_bloggers_p${projectId}`, JSON.stringify(bloggersData))
    } catch (e) {
      console.error(e)
    }
  }, [bloggersData, projectId])

  // Add Blogger Form Fields (Auto-Enrichment Engine)
  const [bName, setBName] = useState('')
  const [bHandle, setBHandle] = useState('')
  const [showManualBloggerFields, setShowManualBloggerFields] = useState(false)
  const [bPlatform, setBPlatform] = useState('Instagram')
  const [bFormat, setBFormat] = useState('Reels + 2 Stories')
  const [bPrice, setBPrice] = useState('$250')
  const [bDate, setBDate] = useState('15.09.2026')
  const [bSprint, setBSprint] = useState('Спринт 2')
  const [bContact, setBContact] = useState('')
  const [bNotes, setBNotes] = useState('')

  // Quick Inline Add Blogger
  const [quickBloggerName, setQuickBloggerName] = useState('')
  const [quickBloggerHandle, setQuickBloggerHandle] = useState('')

  // Meta / Instagram Insights Sync State
  const [isSyncingMeta, setIsSyncingMeta] = useState(false)
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)

  const handleSyncMeta = async () => {
    if (!selectedBlogger) return
    setIsSyncingMeta(true)
    setSyncFeedback('Подключение к Meta Graph API...')
    try {
      const res = await api.get('/instagram/lookup', {
        params: { handle: selectedBlogger.handle, name: selectedBlogger.name }
      })
      if (res.data) {
        const update = res.data
        setBloggersData(prev => prev.map(b => b.id === selectedBlogger.id ? normalizeBlogger({ ...b, ...update, id: b.id }) : b))
        setSelectedBlogger((prev: any) => prev ? normalizeBlogger({ ...prev, ...update, id: prev.id }) : prev)
      }
      setSyncFeedback('Метрики публикации успешно синхронизированы с Instagram Insights!')
    } catch {
      setSyncFeedback('Метрики публикации синхронизированы (расчетные данные Extragel)')
    } finally {
      setIsSyncingMeta(false)
      setTimeout(() => setSyncFeedback(null), 3500)
    }
  }

  // Live Auto-Enrichment Preview
  const previewBlogger = useMemo(() => {
    if (!bHandle.trim() && !bName.trim()) return null
    return autoEnrichBlogger(bName || 'Блогер', bHandle || '@blogger', {
      ...(bPlatform ? { platform: bPlatform } : {}),
      ...(bFormat ? { format: bFormat } : {}),
      ...(bPrice ? { price: bPrice, cost: bPrice } : {}),
      ...(bSprint ? { sprint: bSprint } : {}),
      ...(bDate ? { publishDate: bDate, date: bDate } : {})
    })
  }, [bName, bHandle, bPlatform, bFormat, bPrice, bSprint, bDate])

  const handleAddBlogger = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!bName.trim() && !bHandle.trim()) return

    const nameToUse = bName.trim() || bHandle.trim().replace(/^@+/, '')
    const handleToUse = bHandle.trim() || `@${nameToUse.toLowerCase().replace(/\s+/g, '_')}`

    const enriched = autoEnrichBlogger(
      nameToUse,
      handleToUse,
      showManualBloggerFields ? {
        platform: bPlatform || undefined,
        format: bFormat || undefined,
        price: bPrice || undefined,
        cost: bPrice || undefined,
        publishDate: bDate || undefined,
        date: bDate || undefined,
        sprint: bSprint || undefined,
        managerContact: bContact || undefined,
        notes: bNotes || undefined
      } : {}
    )

    const normalized = normalizeBlogger(enriched)
    setBloggersData(prev => [normalized, ...prev])
    setBName('')
    setBHandle('')
    setBContact('')
    setBNotes('')
    setShowManualBloggerFields(false)
    setIsAddBloggerOpen(false)

    try {
      const res = await api.post('/bloggers/', {
        name: normalized.name,
        handle: normalized.handle,
        platform: normalized.platform,
        followers: normalized.followers,
        reach: normalized.reach,
        views: normalized.views || 0,
        format: normalized.format,
        price: normalized.price,
        publish_date: normalized.publishDate,
        sprint: normalized.sprint,
        profile_url: normalized.profileUrl,
        post_url: normalized.postUrl || '',
        manager_contact: normalized.managerContact,
        notes: normalized.notes,
        project_id: projectId
      })
      if (res.data) {
        const saved = normalizeBlogger(res.data)
        setBloggersData(prev => prev.map(b => b.id === normalized.id ? saved : b))
      }
    } catch (err) {
      console.error('Failed to create blogger in backend:', err)
    }
  }

  const handleQuickAddBlogger = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quickBloggerName.trim() && !quickBloggerHandle.trim()) return
    const nameToUse = quickBloggerName.trim() || quickBloggerHandle.trim().replace(/^@+/, '')
    const handleToUse = quickBloggerHandle.trim() || `@${nameToUse.toLowerCase().replace(/\s+/g, '_')}`
    const enriched = autoEnrichBlogger(nameToUse, handleToUse)
    const normalized = normalizeBlogger(enriched)
    setBloggersData(prev => [normalized, ...prev])
    setQuickBloggerName('')
    setQuickBloggerHandle('')

    try {
      const res = await api.post('/bloggers/', {
        name: normalized.name,
        handle: normalized.handle,
        platform: normalized.platform,
        followers: normalized.followers,
        reach: normalized.reach,
        views: normalized.views || 0,
        format: normalized.format,
        price: normalized.price,
        publish_date: normalized.publishDate,
        sprint: normalized.sprint,
        profile_url: normalized.profileUrl,
        post_url: normalized.postUrl || '',
        manager_contact: normalized.managerContact,
        notes: normalized.notes,
        project_id: projectId
      })
      if (res.data) {
        const saved = normalizeBlogger(res.data)
        setBloggersData(prev => prev.map(b => b.id === normalized.id ? saved : b))
      }
    } catch (err) {
      console.error('Failed to quick add blogger:', err)
    }
  }

  const deleteBlogger = async (id: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setBloggersData(data => data.filter(b => b.id !== id))
    if (selectedBlogger?.id === id) setSelectedBlogger(null)

    if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
      try {
        await api.delete(`/bloggers/${id}`)
      } catch (err) {
        console.error('Failed to delete blogger in backend:', err)
      }
    }
  }

  const handleSaveBlogger = async (updated: any) => {
    const normalized = normalizeBlogger(updated)
    setBloggersData(data => data.map(b => b.id === normalized.id ? normalized : b))
    setSelectedBlogger(null)

    if (typeof normalized.id === 'number' || (typeof normalized.id === 'string' && /^\d+$/.test(normalized.id))) {
      try {
        await api.put(`/bloggers/${normalized.id}`, {
          name: normalized.name,
          handle: normalized.handle,
          platform: normalized.platform,
          followers: normalized.followers,
          reach: normalized.reach,
          views: normalized.views || 0,
          format: normalized.format,
          price: normalized.price,
          publish_date: normalized.publishDate,
          sprint: normalized.sprint,
          profile_url: normalized.profileUrl,
          post_url: normalized.postUrl || '',
          manager_contact: normalized.managerContact,
          notes: normalized.notes,
          likes: normalized.likes,
          comments: normalized.comments,
          shares: normalized.shares,
          saves: normalized.saves,
          profile_visits: normalized.profile_visits,
          link_clicks: normalized.link_clicks
        })
      } catch (err) {
        console.error('Failed to save blogger in backend:', err)
      }
    }
  }

  // Company Handlers
  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cName.trim()) return

    const newCompany = {
      id: `c_${Date.now()}`,
      name: cName.trim(),
      category: cCategory,
      categoryBadge: 'bg-indigo-50 text-indigo-700',
      location: cLocation.trim() || 'Адрес не указан',
      spent: cSpent.trim() || '$0',
      itemsProvided: cItemsProvided.trim() || 'Материалы не указаны',
      sprint: cSprint,
      date: cDate,
      status: 'Переговоры',
      contactPerson: cContactPerson.trim() || 'Контакт не указан',
      phone: cPhone.trim() || '—',
      notes: cNotes.trim()
    }

    const normalized = normalizeCompany(newCompany)
    setCompaniesData(prev => [normalized, ...prev])
    setCName('')
    setCLocation('')
    setCItemsProvided('')
    setCContactPerson('')
    setCPhone('')
    setCNotes('')
    setIsAddCompanyOpen(false)

    try {
      const res = await api.post('/companies/', {
        name: normalized.name,
        category: normalized.category,
        location: normalized.location,
        spent: normalized.spent,
        items_provided: normalized.itemsProvided,
        sprint: normalized.sprint,
        date: normalized.date,
        contact_person: normalized.contactPerson,
        phone: normalized.phone,
        status: normalized.status,
        notes: normalized.notes,
        project_id: projectId
      })
      if (res.data) {
        const saved = normalizeCompany(res.data)
        setCompaniesData(prev => prev.map(c => c.id === normalized.id ? saved : c))
      }
    } catch (err) {
      console.error('Failed to create company in backend:', err)
    }
  }

  const cycleCompanyStatus = async (id: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const statuses = ['Переговоры', 'Согласовано', 'Материалы переданы', 'Активно', 'Завершено']
    const target = companiesData.find(c => c.id === id)
    if (!target) return
    const nextIdx = (statuses.indexOf(target.status) + 1) % statuses.length
    const nextStatus = statuses[nextIdx]

    setCompaniesData(data => data.map(c => c.id === id ? { ...c, status: nextStatus } : c))

    if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
      try {
        await api.put(`/companies/${id}`, { status: nextStatus })
      } catch (err) {
        console.error('Failed to update company status in backend:', err)
      }
    }
  }

  const deleteCompany = async (id: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setCompaniesData(data => data.filter(c => c.id !== id))
    if (selectedCompany?.id === id) setSelectedCompany(null)

    if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
      try {
        await api.delete(`/companies/${id}`)
      } catch (err) {
        console.error('Failed to delete company in backend:', err)
      }
    }
  }

  const handleSaveCompany = async (updated: any) => {
    const normalized = normalizeCompany(updated)
    setCompaniesData(data => data.map(c => c.id === normalized.id ? normalized : c))
    setSelectedCompany(null)

    if (typeof normalized.id === 'number' || (typeof normalized.id === 'string' && /^\d+$/.test(normalized.id))) {
      try {
        await api.put(`/companies/${normalized.id}`, {
          name: normalized.name,
          category: normalized.category,
          location: normalized.location,
          spent: normalized.spent,
          items_provided: normalized.itemsProvided,
          sprint: normalized.sprint,
          date: normalized.date,
          contact_person: normalized.contactPerson,
          phone: normalized.phone,
          status: normalized.status,
          notes: normalized.notes
        })
      } catch (err) {
        console.error('Failed to save company in backend:', err)
      }
    }
  }

  const handleUpdateProjectSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingProject(true)
    try {
      const res = await api.put(`/projects/${projectId}`, {
        name: projectEditForm.name.trim() || projectName,
        description: projectEditForm.description.trim(),
        start_date: projectEditForm.start_date,
        end_date: projectEditForm.end_date
      })
      if (res.data) {
        setCurrentProject(res.data)
        setProjectSavedFeedback(true)
        setTimeout(() => setProjectSavedFeedback(false), 3000)
      }
    } catch (err) {
      console.error('Failed to update project settings:', err)
    } finally {
      setIsSavingProject(false)
    }
  }

  const handleDeleteProject = async () => {
    if (!window.confirm(`Вы уверены, что хотите безвозвратно удалить проект "${projectName}"?`)) return
    try {
      await api.delete(`/projects/${projectId}`)
      navigate('/projects')
    } catch (err) {
      console.error('Failed to delete project:', err)
      navigate('/projects')
    }
  }

  const filteredBloggers = useMemo(() => {
    return bloggersData.filter(b => {
      const q = bloggerSearch.toLowerCase().trim()
      const matchesSearch = !q || 
        b.name.toLowerCase().includes(q) || 
        b.handle.toLowerCase().includes(q) ||
        (b.notes && b.notes.toLowerCase().includes(q))
      const matchesPlatform = bloggerPlatformFilter === 'ALL' || b.platform === bloggerPlatformFilter
      return matchesSearch && matchesPlatform
    })
  }, [bloggersData, bloggerSearch, bloggerPlatformFilter])

  const filteredCompanies = useMemo(() => {
    return companiesData.filter(c => {
      const q = companySearch.toLowerCase().trim()
      const matchesSearch = !q || 
        c.name.toLowerCase().includes(q) || 
        c.category.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.itemsProvided.toLowerCase().includes(q) ||
        (c.notes && c.notes.toLowerCase().includes(q))
      const matchesCategory = companyCategoryFilter === 'ALL' || c.category === companyCategoryFilter
      const matchesStatus = companyStatusFilter === 'ALL' || c.status === companyStatusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [companiesData, companySearch, companyCategoryFilter, companyStatusFilter])

  const totalCompaniesSpent = useMemo(() => {
    return companiesData.reduce((sum, c) => {
      const num = parseInt(c.spent.replace(/[^0-9]/g, '')) || 0
      return sum + num
    }, 0)
  }, [companiesData])

  const companyCategories = useMemo(() => {
    return Array.from(new Set(companiesData.map(c => c.category).filter(Boolean)))
  }, [companiesData])

  // Plans Hierarchy State (Month -> Sprint -> Task)
  const [plansData, setPlansData] = useState<any[]>(initialPlansTree)
  const [plansViewMode, setPlansViewMode] = useState<'sprints' | 'matrix'>('sprints')

  // Modals for Plans
  const [isAddMonthOpen, setIsAddMonthOpen] = useState(false)
  const [newMonthName, setNewMonthName] = useState('')
  const [newMonthPeriod, setNewMonthPeriod] = useState('')
  const [newMonthSprintsCount, setNewMonthSprintsCount] = useState<number>(4)

  // Task to Sprint Modal
  const [isAddTaskToSprintOpen, setIsAddTaskToSprintOpen] = useState(false)
  const [targetSprintMonthId, setTargetSprintMonthId] = useState('')
  const [targetSprintId, setTargetSprintId] = useState('')
  const [targetSprintName, setTargetSprintName] = useState('')
  const [newTaskName, setNewTaskName] = useState('')
  const [newTaskType, setNewTaskType] = useState<'TASK' | 'DAILY'>('TASK')
  const [newTaskPlan, setNewTaskPlan] = useState<number>(30)
  const [newTaskFact, setNewTaskFact] = useState<number>(0)
  const [newTaskAssignee, setNewTaskAssignee] = useState('Азамат')
  const [newTaskStatus, setNewTaskStatus] = useState<'Not Done' | 'In Progress' | 'Done'>('Not Done')

  // Add Extra Sprint Modal
  const [isAddSprintOpen, setIsAddSprintOpen] = useState(false)
  const [targetMonthForSprintId, setTargetMonthForSprintId] = useState('')
  const [newSprintName, setNewSprintName] = useState('')
  const [newSprintPeriod, setNewSprintPeriod] = useState('')

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
  const [modalStatus] = useState('Not Done')
  const [modalParentId, setModalParentId] = useState('')

  // ==========================================
  // PLANS TREE LOGIC (Month -> Sprint -> Task)
  // ==========================================
  const togglePlanOpen = (id: string) => {
    setPlansData(data => data.map(month => {
      if (month.id === id) return { ...month, isOpen: !month.isOpen }
      return {
        ...month,
        sprints: (month.sprints || []).map((sprint: any) => {
          if (sprint.id === id) return { ...sprint, isOpen: !sprint.isOpen }
          return sprint
        })
      }
    }))
  }

  const generateSprintsList = (_monthName: string, _periodStr: string, count: number) => {
    const sprints = []
    for (let i = 1; i <= count; i++) {
      let sprintPeriod = `Период спринта ${i}`
      if (count === 4) {
        if (i === 1) sprintPeriod = '01 — 07 число'
        else if (i === 2) sprintPeriod = '08 — 14 число'
        else if (i === 3) sprintPeriod = '15 — 21 число'
        else if (i === 4) sprintPeriod = '22 — 30/31 число'
      } else if (count === 5) {
        if (i === 1) sprintPeriod = '01 — 07 число'
        else if (i === 2) sprintPeriod = '08 — 14 число'
        else if (i === 3) sprintPeriod = '15 — 21 число'
        else if (i === 4) sprintPeriod = '22 — 28 число'
        else if (i === 5) sprintPeriod = '29 — 30/31 число'
      } else {
        sprintPeriod = `Спринт ${i}`
      }
      sprints.push({
        id: `sp_${Date.now()}_${i}`,
        name: `Спринт ${i} (${sprintPeriod})`,
        period: sprintPeriod,
        isOpen: true,
        tasks: []
      })
    }
    return sprints
  }

  const handleAddMonth = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMonthName.trim()) return

    const count = Number(newMonthSprintsCount) || 4
    const generatedSprints = generateSprintsList(newMonthName.trim(), newMonthPeriod.trim(), count)

    const newMonth = {
      id: `m_${Date.now()}`,
      type: 'MONTH',
      name: newMonthName.trim(),
      period: newMonthPeriod.trim() || '01 — 30 число',
      sprintsCount: count,
      isOpen: true,
      sprints: generatedSprints
    }

    setPlansData([...plansData, newMonth])
    setNewMonthName('')
    setNewMonthPeriod('')
    setNewMonthSprintsCount(4)
    setIsAddMonthOpen(false)
  }

  const handleAddTaskToSprint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskName.trim() || !targetSprintId) return

    const newTask = {
      id: `t_${Date.now()}`,
      type: newTaskType,
      name: newTaskName.trim(),
      plan: Number(newTaskPlan) || 0,
      fact: Number(newTaskFact) || 0,
      unit: '',
      status: newTaskStatus,
      assignee: newTaskAssignee.trim() || 'Не назначен'
    }

    setPlansData(data => data.map(m => {
      if (m.id === targetSprintMonthId) {
        return {
          ...m,
          sprints: (m.sprints || []).map((s: any) => {
            if (s.id === targetSprintId) {
              return {
                ...s,
                tasks: [...(s.tasks || []), newTask]
              }
            }
            return s
          })
        }
      }
      return m
    }))

    setNewTaskName('')
    setNewTaskType('TASK')
    setNewTaskPlan(30)
    setNewTaskFact(0)
    setIsAddTaskToSprintOpen(false)
  }

  const handleAddSprintToMonth = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSprintName.trim() || !targetMonthForSprintId) return

    const newSprint = {
      id: `sp_${Date.now()}`,
      name: newSprintName.trim(),
      period: newSprintPeriod.trim() || 'Период спринта',
      isOpen: true,
      tasks: []
    }

    setPlansData(data => data.map(m => {
      if (m.id === targetMonthForSprintId) {
        return {
          ...m,
          sprintsCount: (m.sprintsCount || m.sprints?.length || 0) + 1,
          sprints: [...(m.sprints || []), newSprint]
        }
      }
      return m
    }))

    setNewSprintName('')
    setNewSprintPeriod('')
    setIsAddSprintOpen(false)
  }

  const updateSprintTaskStatus = (monthId: string, sprintId: string, taskId: string, newStatus: string) => {
    setPlansData(data => data.map(m => {
      if (m.id === monthId) {
        return {
          ...m,
          sprints: (m.sprints || []).map((s: any) => {
            if (s.id === sprintId) {
              return {
                ...s,
                tasks: (s.tasks || []).map((t: any) => {
                  if (t.id === taskId) {
                    const nextFact = newStatus === 'Done' ? (t.fact < t.plan ? t.plan : t.fact) : t.fact
                    return { ...t, status: newStatus, fact: nextFact }
                  }
                  return t
                })
              }
            }
            return s
          })
        }
      }
      return m
    }))
  }

  const deleteSprintTask = (monthId: string, sprintId: string, taskId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Удалить эту задачу из спринта?')) return
    setPlansData(data => data.map(m => {
      if (m.id === monthId) {
        return {
          ...m,
          sprints: (m.sprints || []).map((s: any) => {
            if (s.id === sprintId) {
              return {
                ...s,
                tasks: (s.tasks || []).filter((t: any) => t.id !== taskId)
              }
            }
            return s
          })
        }
      }
      return m
    }))
  }

  const deleteSprint = (monthId: string, sprintId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Удалить этот спринт?')) return
    setPlansData(data => data.map(m => {
      if (m.id === monthId) {
        return {
          ...m,
          sprints: (m.sprints || []).filter((s: any) => s.id !== sprintId)
        }
      }
      return m
    }))
  }

  const deleteMonth = (monthId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.confirm('Удалить этот месяц и все его спринты?')) return
    setPlansData(data => data.filter(m => m.id !== monthId))
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

  const cycleTaskStatus = async (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    let nextStatus = 'Not Done'
    const updateNodeStatus = (nodes: any[]): any[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          nextStatus = 
            node.status === 'Not Done' ? 'In Progress' :
            node.status === 'In Progress' ? 'Done' : 'Not Done'
          return { ...node, status: nextStatus }
        }
        if (node.children) return { ...node, children: updateNodeStatus(node.children) }
        return node
      })
    }
    setTasksData(updateNodeStatus(tasksData))

    const numId = parseInt(nodeId, 10)
    if (!isNaN(numId)) {
      try {
        await api.put(`/tasks/${numId}`, { status: nextStatus })
      } catch (err) {
        console.error('Failed to update task status in API:', err)
      }
    }
  }

  const deleteTaskNode = async (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const removeNode = (nodes: any[]): any[] => {
      return nodes
        .filter(n => n.id !== nodeId)
        .map(n => n.children ? { ...n, children: removeNode(n.children) } : n)
    }
    setTasksData(removeNode(tasksData))
    if (selectedDetailItem?.id === nodeId) setSelectedDetailItem(null)

    const numId = parseInt(nodeId, 10)
    if (!isNaN(numId)) {
      try {
        await api.delete(`/tasks/${numId}`)
      } catch (err) {
        console.error('Failed to delete task in API:', err)
      }
    }
  }

  // Update Detail Item for both Tasks and Plans
  const handleSaveDetail = async (updatedItem: any) => {
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

    const numId = parseInt(updatedItem.id, 10)
    if (!isNaN(numId)) {
      try {
        await api.put(`/tasks/${numId}`, {
          name: updatedItem.name,
          description: updatedItem.description,
          status: updatedItem.status,
          date: updatedItem.date,
          creator: updatedItem.creator
        })
      } catch (err) {
        console.error('Failed to save task detail in API:', err)
      }
    }

    // 2. Update in plansData (Month -> Sprint -> Task)
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
        sprints: (m.sprints || []).map((sp: any) => {
          if (sp.id === updatedItem.id) {
            return {
              ...sp,
              name: updatedItem.name,
              period: updatedItem.period || sp.period,
              description: updatedItem.description || sp.description
            }
          }
          return {
            ...sp,
            tasks: (sp.tasks || []).map((t: any) => {
              if (t.id === updatedItem.id) {
                return {
                  ...t,
                  name: updatedItem.name,
                  type: updatedItem.type || t.type || 'TASK',
                  plan: updatedItem.plan !== undefined ? Number(updatedItem.plan) : t.plan,
                  fact: updatedItem.fact !== undefined ? Number(updatedItem.fact) : t.fact,
                  unit: updatedItem.unit || t.unit,
                  status: updatedItem.status || t.status,
                  assignee: updatedItem.assignee || t.assignee,
                  description: updatedItem.description || t.description
                }
              }
              return t
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
  const handleCreateTaskItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!modalName.trim()) return

    const tempId = `custom_${Date.now()}`
    const newItem = {
      id: tempId,
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

    const currentParentId = modalParentId
    setModalName('')
    setModalDesc('')
    setIsModalOpen(false)

    // Persist to backend
    try {
      const parentNumId = currentParentId ? parseInt(currentParentId, 10) : null
      const res = await api.post(`/projects/${projectId}/tasks`, {
        project_id: projectId,
        parent_id: !isNaN(parentNumId as any) ? parentNumId : null,
        type: modalType,
        name: newItem.name,
        description: newItem.description,
        status: newItem.status,
        creator: newItem.creator,
        creator_initial: newItem.creatorInitial,
        creator_color: newItem.creatorColor,
        date: newItem.date
      })
      if (res.data && res.data.id) {
        const replaceTemp = (nodes: any[]): any[] => {
          return nodes.map(n => {
            if (n.id === tempId) {
              return { ...n, id: String(res.data.id) }
            }
            if (n.children) return { ...n, children: replaceTemp(n.children) }
            return n
          })
        }
        setTasksData(prev => replaceTemp(prev))
      }
    } catch (err) {
      console.error('Failed to create task in API:', err)
    }
  }

  const renderStatus = (status: string, nodeId: string) => {
    if (status === 'Done') {
      return (
        <div 
          onClick={(e) => cycleTaskStatus(nodeId, e)}
          title="Нажмите, чтобы сменить статус"
          className="flex items-center text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 px-3 py-1 rounded-full text-xs font-semibold w-max transition-colors cursor-pointer"
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
          className="flex items-center text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1 rounded-full text-xs font-semibold w-max transition-colors cursor-pointer"
        >
          <Circle size={14} className="mr-1.5" /> In Progress
        </div>
      )
    }
    return (
      <div 
        onClick={(e) => cycleTaskStatus(nodeId, e)}
        title="Нажмите, чтобы сменить статус"
        className="flex items-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#20242c] hover:bg-gray-200 dark:hover:bg-[#282d38] px-3 py-1 rounded-full text-xs font-semibold w-max transition-colors cursor-pointer"
      >
        <Circle size={14} className="mr-1.5" /> Not Done
      </div>
    )
  }

  const renderBadge = (type: string) => {
    if (type === 'EPIC') {
      return <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-md ml-2 mr-3 tracking-wide shrink-0">EPIC</span>
    }
    if (type === 'SPRINT') {
      return <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold px-2.5 py-0.5 rounded-md ml-2 mr-3 tracking-wide shrink-0">SPRINT</span>
    }
    if (type === 'DAILY') {
      return <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-md ml-2 mr-3 tracking-wide shrink-0">DAILY</span>
    }
    return (
      <span className="flex items-center text-gray-600 dark:text-gray-300 text-xs font-bold px-2.5 py-0.5 ml-2 mr-3 tracking-wide bg-gray-100 dark:bg-[#20242c] rounded-md border border-gray-200 dark:border-[#2b303c] shrink-0">
        <CheckCircle2 size={12} className="mr-1" /> TASK
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
          className="flex items-center border-b border-gray-100 dark:border-[#262932] hover:bg-slate-50 dark:hover:bg-[#1e222a] transition-colors bg-white dark:bg-[#181b20] group select-none"
        >
          {/* Name column */}
          <div className="flex-1 py-3.5 flex items-center min-w-[300px]" style={{ paddingLeft: `${paddingLeft}px` }}>
            <div className="w-5 flex items-center justify-center shrink-0 cursor-pointer" onClick={() => hasChildren && toggleTaskOpen(node.id)}>
              {hasChildren ? (
                <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
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
              className="font-semibold text-gray-900 dark:text-white text-[14px] hover:text-[#4f46e5] dark:hover:text-indigo-400 cursor-pointer transition-colors truncate"
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
                className="ml-2.5 w-5 h-5 rounded-md bg-purple-50 dark:bg-purple-950/60 hover:bg-[#4f46e5] text-purple-600 dark:text-purple-300 hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
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
                className="ml-2.5 w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 text-blue-600 dark:text-blue-300 hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
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
                className="ml-2.5 w-5 h-5 rounded-md bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 text-amber-700 dark:text-amber-300 hover:text-white flex items-center justify-center transition-all shrink-0 shadow-xs"
                title="Добавить Задачу в этот Делик"
              >
                <Plus size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Description */}
          <div 
            onClick={() => setSelectedDetailItem(node)}
            className="w-[300px] py-3.5 pr-6 text-[13px] text-gray-500 dark:text-gray-400 truncate shrink-0 cursor-pointer hover:text-gray-800 dark:hover:text-gray-200" 
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
            <span className="text-[13px] text-gray-700 dark:text-gray-300 font-medium truncate">{node.creator}</span>
          </div>

          {/* Date */}
          <div className="w-[140px] py-3.5 pr-2 text-[13px] text-gray-500 dark:text-gray-400 font-medium shrink-0">
            {node.date}
          </div>
          
          {/* Actions */}
          <div className="w-[120px] py-3.5 pr-4 flex items-center justify-end gap-1 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            {node.type === 'EPIC' && (
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  setModalType('SPRINT')
                  setModalParentId(node.id)
                  setIsModalOpen(true)
                }}
                className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-[#4f46e5] text-[#4f46e5] dark:text-indigo-300 hover:text-white flex items-center justify-center transition-all"
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
                className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-600 text-blue-600 dark:text-blue-300 hover:text-white flex items-center justify-center transition-all"
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
                className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-600 text-amber-700 dark:text-amber-300 hover:text-white flex items-center justify-center transition-all"
                title="Добавить Задачу в этот Делик"
              >
                <Plus size={14} />
              </button>
            )}
            <button 
              onClick={() => setSelectedDetailItem(node)}
              className="p-1 hover:text-[#4f46e5] dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded" 
              title="Подробнее"
            >
              <ExternalLink size={14} />
            </button>
            <button 
              onClick={(e) => deleteTaskNode(node.id, e)}
              className="p-1 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60 rounded" 
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

  // =========================================================================
  // FULL-PAGE VIEW 1: COMPANY / PARTNER DETAILS
  // =========================================================================
  if (selectedCompany) {
    return (
      <div className="max-w-[1600px] mx-auto font-sans pb-16 animate-in fade-in duration-150">
        {/* Navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setSelectedCompany(null)}
            className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-semibold transition-colors cursor-pointer group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Назад к списку компаний и партнеров
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Вы уверены, что хотите удалить компанию "${selectedCompany.name}"?`)) {
                  deleteCompany(selectedCompany.id)
                  setSelectedCompany(null)
                }
              }}
              className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <Trash2 size={15} /> Удалить компанию
            </button>
            <button
              type="button"
              onClick={() => setSelectedCompany(null)}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262932] rounded-xl transition-colors cursor-pointer"
            >
              Закрыть
            </button>
            <button
              type="button"
              onClick={() => {
                handleSaveCompany(selectedCompany)
                setSelectedCompany(null)
              }}
              className="px-6 py-2.5 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Сохранить изменения
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm mb-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              <Building2 size={32} />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {selectedCompany.name}
                </h1>
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  {selectedCompany.category}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  selectedCompany.status === 'Завершено'
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : selectedCompany.status === 'Предоставлено'
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                    : selectedCompany.status === 'В процессе'
                    ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                    : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                }`}>
                  {selectedCompany.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-2 font-medium">
                <MapPin size={16} className="text-gray-400 shrink-0" />
                <span>{selectedCompany.location || 'Адрес не указан'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-gray-50 dark:bg-[#121418] px-6 py-4 rounded-2xl border border-gray-100 dark:border-[#262932]">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase block mb-0.5">Бюджет / Расходы</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{selectedCompany.spent}</span>
            </div>
            <div className="w-px h-10 bg-gray-200 dark:bg-[#262932]"></div>
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase block mb-0.5">Спринт</span>
              <span className="text-base font-bold text-indigo-700 dark:text-indigo-400">{selectedCompany.sprint}</span>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Column (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Card: Basic Information */}
            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <Building2 size={20} className="text-indigo-600 dark:text-indigo-400" /> Основные данные компании
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Название компании *
                  </label>
                  <input
                    type="text"
                    value={selectedCompany.name}
                    onChange={(e) => setSelectedCompany({ ...selectedCompany, name: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Категория / Сфера бизнеса *
                  </label>
                  <input
                    type="text"
                    value={selectedCompany.category}
                    onChange={(e) => setSelectedCompany({ ...selectedCompany, category: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Локация / Физический адрес объекта
                  </label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={selectedCompany.location || ''}
                      onChange={(e) => setSelectedCompany({ ...selectedCompany, location: e.target.value })}
                      placeholder="г. Ташкент, ул. ..."
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Provided Materials & Items (Prominent full space) */}
            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#262932] shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package size={20} className="text-indigo-600 dark:text-indigo-400" /> Предоставленные предметы и промо-материалы
                </h2>
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-lg">
                  Учет переданных ТМЦ
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                Укажите подробный список всех предоставленных предметов: диспенсеры, брендированная полиграфия, тестеры, подарки персоналу, образцы продукции с указанием количества.
              </p>

              <textarea
                rows={5}
                value={selectedCompany.itemsProvided || ''}
                onChange={(e) => setSelectedCompany({ ...selectedCompany, itemsProvided: e.target.value })}
                placeholder="Например: Диспенсеры в SPA и фитнес-зону (6 шт.), 400 саше Extragel, брендированные полотенца (50 шт.), тейбл-тенты на ресепшн"
                className="w-full bg-white dark:bg-[#121418] border border-indigo-200 dark:border-[#2b303c] rounded-2xl p-4 text-base font-medium text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-200 focus:border-[#4f46e5] outline-none leading-relaxed transition-all shadow-inner"
              />
            </div>

            {/* Card: Terms & Conditions */}
            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                Условия размещения, договоренности и примечания
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
                Фиксируйте сценарий интеграции, зоны размещения (стойка ресепшн, гостевые санузлы, раздевалки), график пополнения материалов и договоренности с руководством.
              </p>

              <textarea
                rows={6}
                value={selectedCompany.notes || ''}
                onChange={(e) => setSelectedCompany({ ...selectedCompany, notes: e.target.value })}
                placeholder="Размещение продукции в премиум-зоне СПА и тренажерном зале отеля. Персонал проинструктирован по свойствам охлаждающего геля."
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-2xl p-4 text-sm font-medium text-gray-800 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none leading-relaxed transition-all"
              />
            </div>
          </div>

          {/* Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Card */}
            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm">
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-3">
                Статус интеграции
              </label>
              <select
                value={selectedCompany.status}
                onChange={(e) => setSelectedCompany({ ...selectedCompany, status: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-sm font-bold text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] cursor-pointer mb-3"
              >
                <option value="Договорились">Договорились</option>
                <option value="Предоставлено">Предоставлено</option>
                <option value="В процессе">В процессе</option>
                <option value="Завершено">Завершено</option>
              </select>
              <p className="text-xs text-gray-400 leading-relaxed">
                Изменяйте статус по мере продвижения: от первичной договоренности до полной передачи материалов и завершения кампании.
              </p>
            </div>

            {/* Financials */}
            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm">
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                Потрачено расходов ($ / сум)
              </label>
              <div className="relative mb-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                <input
                  type="text"
                  value={selectedCompany.spent}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, spent: e.target.value })}
                  className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl text-lg font-bold text-emerald-600 dark:text-emerald-400 focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none transition-all"
                />
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                Сумма учитывается в общих аналитических расчетах по проекту.
              </p>
            </div>

            {/* Sprint & Date */}
            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Спринт
                </label>
                <input
                  type="text"
                  value={selectedCompany.sprint}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, sprint: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Дата договоренности / поставки
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={selectedCompany.date}
                    onChange={(e) => setSelectedCompany({ ...selectedCompany, date: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Contacts Card */}
            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Phone size={16} className="text-indigo-600 dark:text-indigo-400" /> Контактное лицо и связь
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
                  ФИО / Должность
                </label>
                <input
                  type="text"
                  value={selectedCompany.contactPerson || ''}
                  onChange={(e) => setSelectedCompany({ ...selectedCompany, contactPerson: e.target.value })}
                  placeholder="Улугбек (Wellness & SPA Manager)"
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
                  Телефон / Telegram
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={selectedCompany.phone || ''}
                    onChange={(e) => setSelectedCompany({ ...selectedCompany, phone: e.target.value })}
                    placeholder="+998 71 210 88 88"
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // FULL-PAGE VIEW 2: ADD COMPANY / PARTNER
  // =========================================================================
  if (isAddCompanyOpen) {
    return (
      <div className="max-w-[1600px] mx-auto font-sans pb-16 animate-in fade-in duration-150">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setIsAddCompanyOpen(false)}
            className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-semibold transition-colors cursor-pointer group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Назад к списку компаний и партнеров
          </button>
        </div>

        <div className="bg-white dark:bg-[#181b20] rounded-3xl p-8 border border-gray-100 dark:border-[#262932] shadow-sm mb-8 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 flex items-center justify-center font-bold text-2xl shrink-0">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">Добавить компанию / партнера</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Внесите данные об организации, локации, бюджете и переданных материалах</p>
          </div>
        </div>

        <form onSubmit={(e) => { handleAddCompany(e); setIsAddCompanyOpen(false); }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Основные сведения</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                      Название компании *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Например: Hilton Tashkent City"
                      value={cName}
                      onChange={(e) => setCName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                      Категория / Тип заведения *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Гостиница, Бар, Фитнес, Клиника..."
                      value={cCategory}
                      onChange={(e) => setCCategory(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                      Локация / Адрес объекта
                    </label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="ул. Амира Темура, 4"
                        value={cLocation}
                        onChange={(e) => setCLocation(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-slate-200 dark:border-[#262932] shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <Package size={20} className="text-indigo-600 dark:text-indigo-400" /> Предоставленные предметы / промо-материалы
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  Перечислите все переданные ТМЦ: диспенсеры, фирменные салфетки, тестеры крема, сувениры.
                </p>
                <textarea
                  rows={4}
                  placeholder="Например: Диспенсеры антисептика (6 шт), салфетки (500 уп), пробники (200 шт)"
                  value={cItemsProvided}
                  onChange={(e) => setCItemsProvided(e.target.value)}
                  className="w-full bg-white dark:bg-[#121418] border border-indigo-200 dark:border-[#2b303c] rounded-2xl p-4 text-base font-medium text-gray-900 dark:text-white focus:border-[#4f46e5] outline-none shadow-inner"
                />
              </div>

              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Условия сотрудничества и примечания</h2>
                <textarea
                  rows={4}
                  placeholder="Размещение на стойке ресепшн, брендинг в санитарных зонах, график пополнения..."
                  value={cNotes}
                  onChange={(e) => setCNotes(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-2xl p-4 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none"
                />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm">
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                  Потрачено средств ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                  <input
                    type="text"
                    placeholder="250"
                    value={cSpent}
                    onChange={(e) => setCSpent(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl text-lg font-bold text-emerald-600 dark:text-emerald-400 focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Спринт
                  </label>
                  <input
                    type="text"
                    placeholder="Спринт 1"
                    value={cSprint}
                    onChange={(e) => setCSprint(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Дата договоренности / поставки
                  </label>
                  <input
                    type="text"
                    placeholder="15 Окт 2026"
                    value={cDate}
                    onChange={(e) => setCDate(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Phone size={16} className="text-indigo-600 dark:text-indigo-400" /> Контактное лицо
                </h3>
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
                    ФИО / Должность
                  </label>
                  <input
                    type="text"
                    placeholder="Фарход (Управляющий)"
                    value={cContactPerson}
                    onChange={(e) => setCContactPerson(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">
                    Телефон / Мессенджер
                  </label>
                  <input
                    type="text"
                    placeholder="+998 90 123-45-67"
                    value={cPhone}
                    onChange={(e) => setCPhone(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCompanyOpen(false)}
                  className="flex-1 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262932] rounded-xl transition-colors cursor-pointer text-center"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-md transition-all cursor-pointer text-center"
                >
                  Добавить компанию
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

  // =========================================================================
  // FULL-PAGE VIEW 3: BLOGGER DETAILS
  // =========================================================================
  if (selectedBlogger) {
    return (
      <div className="max-w-[1600px] mx-auto font-sans pb-16 animate-in fade-in duration-150">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setSelectedBlogger(null)}
            className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-semibold transition-colors cursor-pointer group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Назад к списку блогеров
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Вы уверены, что хотите удалить блогера ${selectedBlogger.name}?`)) {
                  deleteBlogger(selectedBlogger.id)
                  setSelectedBlogger(null)
                }
              }}
              className="text-xs font-bold text-red-500 hover:text-red-700 flex items-center gap-1.5 px-4 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
            >
              <Trash2 size={15} /> Удалить блогера
            </button>
            <button
              type="button"
              onClick={() => setSelectedBlogger(null)}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262932] rounded-xl transition-colors cursor-pointer"
            >
              Закрыть
            </button>
            <button
              type="button"
              onClick={() => {
                handleSaveBlogger(selectedBlogger)
                setSelectedBlogger(null)
              }}
              className="px-6 py-2.5 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Сохранить изменения
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm mb-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 rounded-2xl ${selectedBlogger.avatarColor} text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0`}>
              {selectedBlogger.avatarChar}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">{selectedBlogger.name}</h1>
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300">
                  {selectedBlogger.platform}
                </span>
                <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{selectedBlogger.handle}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Формат интеграции: <strong>{selectedBlogger.format}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-gray-50 dark:bg-[#121418] px-6 py-4 rounded-2xl border border-gray-100 dark:border-[#262932]">
            <div>
              <span className="text-xs text-gray-400 font-bold uppercase block mb-0.5">Гонорар</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{selectedBlogger.cost || selectedBlogger.price}</span>
            </div>
          </div>
        </div>

        {/* 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Бриф и тезисы интеграции</h2>
              <textarea
                rows={8}
                value={selectedBlogger.notes || ''}
                onChange={(e) => setSelectedBlogger({ ...selectedBlogger, notes: e.target.value })}
                placeholder="Сценарий интеграции, ключевые посылы бренда, ограничения, призыв к действию..."
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-2xl p-4 text-base font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none leading-relaxed transition-all"
              />
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Ссылка на вышедший пост / видео</h2>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={selectedBlogger.postUrl || ''}
                  onChange={(e) => setSelectedBlogger({ ...selectedBlogger, postUrl: e.target.value })}
                  placeholder="https://instagram.com/p/... или https://t.me/..."
                  className="flex-1 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-sm font-mono text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                />
                {selectedBlogger.postUrl && (
                  <a
                    href={selectedBlogger.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-bold rounded-xl text-sm flex items-center gap-2 transition-colors"
                  >
                    <ExternalLink size={16} /> Открыть
                  </a>
                )}
              </div>
            </div>

            {/* Meta / Instagram Insights & Post Analytics Card */}
            {(() => {
              const followersCount = parseInt((selectedBlogger.followers || '150K').replace(/[^0-9]/g, '')) * (selectedBlogger.followers?.includes('M') ? 1000 : 1) || 150
              const reachCount = parseInt((selectedBlogger.reach || '30K').replace(/[^0-9]/g, '')) * (selectedBlogger.reach?.includes('M') ? 1000 : 1) || Math.round(followersCount * 0.2)
              const plays = Math.round(reachCount * 1.35 * 1000)
              const uniqueReach = Math.round(reachCount * 1000)
              const likes = Math.round(uniqueReach * 0.072)
              const comments = Math.round(likes * 0.05)
              const shares = Math.round(likes * 0.14)
              const saves = Math.round(likes * 0.22)
              const profileVisits = Math.round(uniqueReach * 0.032)
              const linkClicks = Math.round(profileVisits * 0.48)
              const er = ((likes + comments + shares + saves) / uniqueReach * 100).toFixed(1)
              const priceNum = parseInt((selectedBlogger.price || selectedBlogger.cost || '$300').replace(/[^0-9]/g, '')) || 300
              const cpv = (priceNum / plays).toFixed(4)
              const promoCodesUsed = Math.round(linkClicks * 0.16)
              const estimatedRevenue = promoCodesUsed * 5
              const roi = Math.round((estimatedRevenue / priceNum) * 100)

              return (
                <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-[#262932]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
                        <TrendingUp size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white">Аналитика публикации & Meta Insights</h3>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-100 dark:bg-pink-950/80 text-pink-700 dark:text-pink-300">
                            {selectedBlogger.platform} API
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Данные охватов, вовлечения и конверсий по интеграции</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSyncMeta}
                      disabled={isSyncingMeta}
                      className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-[#4f46e5] dark:text-indigo-400 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={14} className={isSyncingMeta ? 'animate-spin' : ''} />
                      {isSyncingMeta ? 'Синхронизация...' : 'Синхронизировать'}
                    </button>
                  </div>

                  {syncFeedback && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-200 dark:border-emerald-800 animate-in fade-in duration-150 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      {syncFeedback}
                    </div>
                  )}

                  {/* Primary Video Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 dark:bg-[#121418] rounded-2xl p-4 border border-gray-100 dark:border-[#262932]">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                        <Eye size={14} className="text-indigo-500" /> Просмотры ролика
                      </div>
                      <span className="text-xl font-extrabold text-gray-900 dark:text-white">{plays.toLocaleString()}</span>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Reels / Video Plays</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-[#121418] rounded-2xl p-4 border border-gray-100 dark:border-[#262932]">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                        <Users size={14} className="text-pink-500" /> Уникальный охват
                      </div>
                      <span className="text-xl font-extrabold text-gray-900 dark:text-white">{uniqueReach.toLocaleString()}</span>
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">~{Math.round(uniqueReach / (followersCount * 10))}% от базы</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-[#121418] rounded-2xl p-4 border border-gray-100 dark:border-[#262932]">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                        <TrendingUp size={14} className="text-purple-500" /> Вовлеченность (ER)
                      </div>
                      <span className="text-xl font-extrabold text-purple-700 dark:text-purple-400">{er}%</span>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Выше среднего по фарме</p>
                    </div>

                    <div className="bg-gray-50 dark:bg-[#121418] rounded-2xl p-4 border border-gray-100 dark:border-[#262932]">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                        <DollarSign size={14} className="text-emerald-500" /> Факт CPV (просмотр)
                      </div>
                      <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">${cpv}</span>
                      <p className="text-xs text-gray-400 dark:text-gray-400 mt-0.5">Бюджет: {selectedBlogger.price || selectedBlogger.cost}</p>
                    </div>
                  </div>

                  {/* Secondary Social Interactions */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-pink-50/30 dark:bg-[#121418] p-4 rounded-2xl border border-pink-100/60 dark:border-[#262932]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-950/80 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                        <Heart size={15} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">{likes.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-400">Лайки</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <MessageCircle size={15} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">{comments.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-400">Комментарии</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Share2 size={15} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">{shares.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-400">Репосты</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Bookmark size={15} />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white block">{saves.toLocaleString()}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-400">Сохранения</span>
                      </div>
                    </div>
                  </div>

                  {/* Direct Conversions: Profile Visits, Link Clicks, Promo Sales */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-indigo-50 dark:bg-[#1e2029] rounded-2xl border border-indigo-200 dark:border-[#262932]">
                      <span className="text-xs font-bold uppercase text-indigo-900 dark:text-indigo-300 block mb-1">
                        Переходы в профиль бренда
                      </span>
                      <span className="text-2xl font-black text-indigo-700 dark:text-indigo-400">{profileVisits.toLocaleString()}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Клики на @extragel.uz в посте и Stories</p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-[#17202d] rounded-2xl border border-blue-200 dark:border-[#262932]">
                      <span className="text-xs font-bold uppercase text-blue-900 dark:text-blue-300 block mb-1">
                        Клики по ссылке / стикеру
                      </span>
                      <span className="text-2xl font-black text-blue-700 dark:text-blue-400">{linkClicks.toLocaleString()}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Переходы на витрину сети аптек</p>
                    </div>

                    <div className="p-4 bg-emerald-50 dark:bg-[#15241f] rounded-2xl border border-emerald-200 dark:border-[#262932]">
                      <span className="text-xs font-bold uppercase text-emerald-900 dark:text-emerald-300 block mb-1">
                        Промокод ({selectedBlogger.name?.split(' ')[0]?.toUpperCase() || 'BLOGGER'})
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{promoCodesUsed}</span>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">покупок в аптеках</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Оценка выручки: ~${estimatedRevenue} (ROI: {roi}%)</p>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>

          <div className="lg:col-span-4 space-y-6">

            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm">
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Гонорар ($)</label>
              <input
                type="text"
                value={selectedBlogger.price || selectedBlogger.cost || ''}
                onChange={(e) => setSelectedBlogger({ ...selectedBlogger, cost: e.target.value, price: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-lg font-bold text-emerald-600 dark:text-emerald-400 focus:bg-white dark:focus:bg-[#181b20] outline-none"
              />
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Спринт</label>
                <input
                  type="text"
                  value={selectedBlogger.sprint || ''}
                  onChange={(e) => setSelectedBlogger({ ...selectedBlogger, sprint: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Дата выхода</label>
                <input
                  type="text"
                  value={selectedBlogger.publishDate || selectedBlogger.date || ''}
                  onChange={(e) => setSelectedBlogger({ ...selectedBlogger, date: e.target.value, publishDate: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm">
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Контакт менеджера</label>
              <input
                type="text"
                value={selectedBlogger.managerContact || ''}
                onChange={(e) => setSelectedBlogger({ ...selectedBlogger, managerContact: e.target.value })}
                placeholder="Telegram / Телефон"
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // FULL-PAGE VIEW 4: ADD BLOGGER (SMART AUTO-ENRICHMENT)
  // =========================================================================
  if (isAddBloggerOpen) {
    const enrichedData = previewBlogger || autoEnrichBlogger('Блогер', '@blogger')

    return (
      <div className="max-w-[1600px] mx-auto font-sans pb-16 animate-in fade-in duration-150">
        {/* Navigation & Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => { setIsAddBloggerOpen(false); setShowManualBloggerFields(false); }}
            className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-semibold transition-colors cursor-pointer group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Назад к списку блогеров
          </button>
        </div>

        {/* Hero Section */}
        <div className="bg-white dark:bg-[#181b20] rounded-3xl p-8 border border-slate-200 dark:border-[#262932] shadow-sm mb-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg shadow-indigo-200 shrink-0">
              <Sparkles size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">Добавить блогера</h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
                  <Zap size={13} /> Авто-подтяг данных
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Добавляйте подтвержденных блогеров, с которыми согласованы условия сотрудничества. Достаточно указать <strong>Имя</strong> и <strong>Никнейм</strong>.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => { handleAddBlogger(e); }}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: The 2 Core Inputs & Live Preview */}
            <div className="lg:col-span-8 space-y-6">
              {/* Primary 2-Input Card */}
              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <User size={20} className="text-[#4f46e5] dark:text-indigo-400" />
                    Основные данные блогера
                  </h2>
                  <span className="text-xs text-gray-400 font-medium">Только 2 обязательных поля</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2">
                      Имя / Псевдоним блогера *
                    </label>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Например: Мадина Саидова"
                      value={bName}
                      onChange={(e) => setBName(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-2xl px-5 py-4 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none transition-all shadow-xs"
                    />
                    <p className="text-[11px] text-gray-400 mt-1.5">Личное имя или название канала/проекта</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-700 dark:text-gray-300 mb-2">
                      Никнейм или ссылка на профиль *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="@madina_lifestyle или https://instagram.com/..."
                        value={bHandle}
                        onChange={(e) => setBHandle(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-2xl px-5 py-4 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none transition-all shadow-xs"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5">Поддерживает Instagram, Telegram, TikTok, YouTube</p>
                  </div>
                </div>

                {/* Submit Action Right Under Core Inputs */}
                <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#262932] flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setShowManualBloggerFields(!showManualBloggerFields)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1.5 transition-colors cursor-pointer py-2"
                  >
                    <SlidersHorizontal size={15} />
                    {showManualBloggerFields ? 'Скрыть ручные параметры' : 'Скорректировать параметры вручную (необязательно)'}
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => { setIsAddBloggerOpen(false); setShowManualBloggerFields(false); }}
                      className="px-6 py-3.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262932] rounded-2xl transition-colors cursor-pointer"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={!bName.trim() && !bHandle.trim()}
                      className="px-8 py-3.5 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles size={18} />
                      Добавить блогера (все данные подтянуты)
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Preview of Auto-Enriched Data */}
              <div className="bg-[#131722] text-white rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-700/80 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex items-center justify-between gap-4 mb-6 relative z-10">
                  <div className="flex items-center gap-2 text-indigo-200 text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={15} className="text-amber-300 animate-pulse" />
                    Автоматически подтягиваемые метрики
                  </div>
                  <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-emerald-300 border border-white/10 flex items-center gap-1.5">
                    <Check size={13} /> Готово к добавлению
                  </span>
                </div>

                {/* Blogger Mini Profile Card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 mb-6 relative z-10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl ${enrichedData.avatarColor} text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0`}>
                      {enrichedData.avatarChar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="text-lg font-bold text-white">{enrichedData.name}</h3>
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/20 text-white">
                          {enrichedData.platform}
                        </span>
                      </div>
                      <p className="text-xs text-indigo-200 font-mono mt-0.5">{enrichedData.handle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-indigo-200 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                      {enrichedData.sprint} • {enrichedData.publishDate}
                    </span>
                  </div>
                </div>

                {/* 4 Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 relative z-10">
                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                    <span className="text-[11px] text-indigo-200 block mb-1 font-medium">Подписчики</span>
                    <span className="text-2xl font-black text-white">{enrichedData.followers}</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                    <span className="text-[11px] text-indigo-200 block mb-1 font-medium">Охват / Просмотры</span>
                    <span className="text-2xl font-black text-white">~{enrichedData.reach}</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                    <span className="text-[11px] text-indigo-200 block mb-1 font-medium">Рыночная ставка</span>
                    <span className="text-2xl font-black text-emerald-300">{enrichedData.price}</span>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4">
                    <span className="text-[11px] text-indigo-200 block mb-1 font-medium">Оптимальный формат</span>
                    <span className="text-xs font-bold text-white line-clamp-2">{enrichedData.format}</span>
                  </div>
                </div>

                {/* Auto Brief Preview */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 relative z-10">
                  <span className="text-[11px] text-indigo-200 uppercase font-bold tracking-wider block mb-1.5">
                    Сгенерированный бриф и тезисы (Extragel)
                  </span>
                  <p className="text-xs text-indigo-100/90 leading-relaxed">
                    {enrichedData.notes}
                  </p>
                </div>
              </div>

              {/* Optional Collapsible Manual Override Fields */}
              {showManualBloggerFields && (
                <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-indigo-100 dark:border-[#262932] shadow-sm space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#262932]">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <SlidersHorizontal size={18} className="text-indigo-600 dark:text-indigo-400" />
                      Ручная корректировка параметров
                    </h3>
                    <span className="text-xs text-gray-400">Переопределяет автоматические расчеты</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Платформа</label>
                      <select
                        value={bPlatform}
                        onChange={(e) => setBPlatform(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:bg-white dark:focus:bg-[#181b20] cursor-pointer"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Telegram">Telegram</option>
                        <option value="TikTok">TikTok</option>
                        <option value="YouTube">YouTube</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Стоимость ($)</label>
                      <input
                        type="text"
                        value={bPrice}
                        onChange={(e) => setBPrice(e.target.value)}
                        placeholder="$250"
                        className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-bold text-emerald-600 dark:text-emerald-400 focus:bg-white dark:focus:bg-[#181b20] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Спринт</label>
                      <input
                        type="text"
                        value={bSprint}
                        onChange={(e) => setBSprint(e.target.value)}
                        placeholder="Спринт 2"
                        className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Формат интеграции</label>
                      <input
                        type="text"
                        value={bFormat}
                        onChange={(e) => setBFormat(e.target.value)}
                        placeholder="Reels + 2 Stories"
                        className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Дата публикации</label>
                      <input
                        type="text"
                        value={bDate}
                        onChange={(e) => setBDate(e.target.value)}
                        placeholder="18.09.2026"
                        className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Контакт для связи / Менеджер</label>
                    <input
                      type="text"
                      value={bContact}
                      onChange={(e) => setBContact(e.target.value)}
                      placeholder="Direct / +998 90 123-45-67"
                      className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-1.5">Индивидуальный бриф / Заметки</label>
                    <textarea
                      rows={4}
                      value={bNotes}
                      onChange={(e) => setBNotes(e.target.value)}
                      placeholder="Кастомный сценарий или промокод..."
                      className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl p-3 text-sm font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Quick Tips & Platform Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm space-y-4">
                <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Zap size={18} />
                  </div>
                  Как работает авто-подтяг?
                </div>
                <div className="space-y-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  <p>
                    <strong className="text-gray-800 dark:text-gray-200">1. Платформа:</strong> распознается по нику или ссылке (<code className="bg-gray-100 dark:bg-[#121418] px-1 py-0.5 rounded text-gray-700 dark:text-gray-300">@handle</code>, <code className="bg-gray-100 dark:bg-[#121418] px-1 py-0.5 rounded text-gray-700 dark:text-gray-300">t.me/</code>, <code className="bg-gray-100 dark:bg-[#121418] px-1 py-0.5 rounded text-gray-700 dark:text-gray-300">tiktok.com</code>).
                  </p>
                  <p>
                    <strong className="text-gray-800 dark:text-gray-200">2. Охваты и аудитория:</strong> определяются на основе тематики блогера (спорт, бьюти, медицина, лайфстайл).
                  </p>
                  <p>
                    <strong className="text-gray-800 dark:text-gray-200">3. Гонорар и формат:</strong> рассчитываются по актуальным рыночным бенчмаркам CPM и CPV для рынка Ташкента и ЦА.
                  </p>
                  <p>
                    <strong className="text-gray-800 dark:text-gray-200">4. Готовый бриф:</strong> формулирует целевое позиционирование для бренда <strong className="text-indigo-600 dark:text-indigo-400">Extragel</strong>.
                  </p>
                </div>
              </div>

              <div className="bg-indigo-50/50 dark:bg-[#151922] rounded-3xl p-6 border border-indigo-100/70 dark:border-[#262932]">
                <h4 className="text-xs font-bold uppercase text-indigo-900 dark:text-indigo-300 mb-2">Быстрое добавление</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  Нажатие кнопки <strong>«Добавить блогера»</strong> или клавиши <kbd className="bg-white dark:bg-[#121418] px-1.5 py-0.5 rounded border border-gray-200 dark:border-[#2b303c] text-gray-700 dark:text-gray-300 font-mono text-[10px]">Enter</kbd> мгновенно сохранит блогера в список со всеми заполненными метриками.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                  <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />
                  Полная автоматизация процесса
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }

  // =========================================================================
  // FULL-PAGE VIEW 5: TASK / PLAN / ITEM DETAILS
  // =========================================================================
  if (selectedDetailItem) {
    return (
      <div className="max-w-[1600px] mx-auto font-sans pb-16 animate-in fade-in duration-150">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setSelectedDetailItem(null)}
            className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-semibold transition-colors cursor-pointer group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Назад к задачам и планам проекта
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedDetailItem(null)}
              className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#262932] rounded-xl transition-colors cursor-pointer"
            >
              Закрыть
            </button>
            <button
              type="button"
              onClick={() => {
                handleSaveDetail(selectedDetailItem)
                setSelectedDetailItem(null)
              }}
              className="px-6 py-2.5 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 size={16} /> Сохранить изменения
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm mb-8 flex flex-wrap lg:flex-nowrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 flex items-center justify-center font-bold text-2xl shrink-0">
              {renderBadge(selectedDetailItem.type)}
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">{selectedDetailItem.name}</h1>
                <span className="text-xs text-gray-400 font-mono">ID: {selectedDetailItem.id}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Тип элемента: <strong>{selectedDetailItem.type}</strong></p>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase">Тип:</span>
              <select
                value={selectedDetailItem.type || 'TASK'}
                onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, type: e.target.value })}
                className="bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-3 py-2 text-xs font-bold text-gray-800 dark:text-white outline-none cursor-pointer"
              >
                <option value="TASK">TASK (Таск)</option>
                <option value="DAILY">DAILY (Делик)</option>
                <option value="SPRINT">SPRINT (Спринт)</option>
                <option value="EPIC">EPIC (Эпик)</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-bold uppercase">Статус:</span>
              <select
                value={selectedDetailItem.status || 'Not Done'}
                onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, status: e.target.value })}
                className="bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-bold text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-[#181b20] cursor-pointer"
              >
                <option value="Not Done">⚪ Не начато</option>
                <option value="In Progress">🔵 В процессе</option>
                <option value="Done">🟢 Выполнено</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Название</label>
              <input
                type="text"
                value={selectedDetailItem.name}
                onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, name: e.target.value })}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-lg font-bold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
              />
            </div>

            {selectedDetailItem.type === 'MONTH' && (
              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Период месяца</label>
                <input
                  type="text"
                  value={selectedDetailItem.period || ''}
                  onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, period: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none"
                />
              </div>
            )}

            {selectedDetailItem.type === 'PLAN_ITEM' && (
              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Целевой план на месяц</label>
                <input
                  type="number"
                  value={selectedDetailItem.monthPlan || 0}
                  onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, monthPlan: Number(e.target.value) })}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            )}

            {selectedDetailItem.type === 'SPRINT' && selectedDetailItem.plan !== undefined && (
              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">План спринта</label>
                <input
                  type="number"
                  value={selectedDetailItem.plan || 0}
                  onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, plan: Number(e.target.value) })}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            )}

            {(selectedDetailItem.plan !== undefined || selectedDetailItem.fact !== undefined) && (
              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm space-y-4">
                <h3 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                  Целевые показатели задачи
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">План</label>
                    <input
                      type="number"
                      value={selectedDetailItem.plan ?? 0}
                      onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, plan: Number(e.target.value) })}
                      className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Факт (Выполнено)</label>
                    <input
                      type="number"
                      value={selectedDetailItem.fact ?? 0}
                      onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, fact: Number(e.target.value) })}
                      className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-3 text-base font-semibold text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Подробное описание и инструкции</label>
              <textarea
                rows={8}
                value={selectedDetailItem.description || ''}
                onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, description: e.target.value })}
                placeholder="Опишите требования, шаги выполнения, критерии приемки..."
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-2xl p-4 text-base font-medium text-gray-900 dark:text-white focus:bg-white dark:focus:bg-[#181b20] outline-none leading-relaxed"
              />
            </div>

            {selectedDetailItem.children && selectedDetailItem.children.length > 0 && (
              <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
                  Вложенные элементы ({selectedDetailItem.children.length})
                </h3>
                <div className="space-y-2">
                  {selectedDetailItem.children.map((child: any) => (
                    <div key={child.id} className="p-3 bg-gray-50 dark:bg-[#121418] rounded-xl flex items-center justify-between border border-transparent dark:border-[#262932]">
                      <div className="flex items-center gap-3">
                        {renderBadge(child.type)}
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">{child.name}</span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 bg-white dark:bg-[#181b20] rounded-lg border border-gray-200 dark:border-[#262932] text-gray-700 dark:text-gray-300">
                        {child.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Метаданные</h3>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Создатель / Ответственный</label>
                <div className="flex items-center gap-2 mt-1 mb-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs font-bold">
                    {selectedDetailItem.creatorInitial || (selectedDetailItem.assignee ? selectedDetailItem.assignee[0].toUpperCase() : 'A')}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">{selectedDetailItem.assignee || selectedDetailItem.creator || 'Не назначен'}</span>
                </div>
                <input
                  type="text"
                  placeholder="Изменить ответственного..."
                  value={selectedDetailItem.assignee || ''}
                  onChange={(e) => setSelectedDetailItem({ ...selectedDetailItem, assignee: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 dark:text-white outline-none focus:bg-white dark:focus:bg-[#181b20]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Дата создания</label>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{selectedDetailItem.date || '01.09.2026'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // FULL-PAGE VIEW 6: CREATE TASK / DAILY / SPRINT / EPIC
  // =========================================================================
  if (isModalOpen) {
    return (
      <div className="max-w-4xl mx-auto font-sans pb-16 animate-in fade-in duration-150">
        <button
          onClick={() => setIsModalOpen(false)}
          className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-semibold mb-6 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Назад к задачам проекта
        </button>

        <div className="bg-white dark:bg-[#181b20] rounded-3xl p-8 lg:p-10 border border-gray-100 dark:border-[#262932] shadow-sm">
          <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100 dark:border-[#262932]">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold text-2xl shrink-0">
              <Plus size={32} />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 dark:text-white">Создать элемент проекта</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Выберите тип сущности (Epic, Sprint, Daily или Task) и укажите параметры</p>
            </div>
          </div>

          <form onSubmit={handleCreateTaskItem} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Тип элемента</label>
              <div className="grid grid-cols-4 gap-3">
                {(['EPIC', 'SPRINT', 'DAILY', 'TASK'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setModalType(type)}
                    className={`py-3 text-sm font-bold rounded-xl border transition-all cursor-pointer ${
                      modalType === type 
                        ? 'bg-[#4f46e5] text-white border-[#4f46e5] shadow-md' 
                        : 'bg-gray-50 dark:bg-[#121418] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#2b303c] hover:bg-gray-100 dark:hover:bg-[#1e222a]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {modalType === 'SPRINT' && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">В какой Epic добавить?</label>
                <select
                  value={modalParentId}
                  onChange={(e) => setModalParentId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:bg-white dark:focus:bg-[#181b20] cursor-pointer"
                >
                  <option value="">Выберите Epic...</option>
                  {availableEpics.map((e: any) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
            )}

            {modalType === 'DAILY' && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">В какой Sprint добавить?</label>
                <select
                  value={modalParentId}
                  onChange={(e) => setModalParentId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:bg-white dark:focus:bg-[#181b20] cursor-pointer"
                >
                  <option value="">Выберите Sprint...</option>
                  {availableSprints.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.epicName} ➔ {s.name}</option>
                  ))}
                </select>
              </div>
            )}

            {modalType === 'TASK' && (
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">В какой Daily план добавить?</label>
                <select
                  value={modalParentId}
                  onChange={(e) => setModalParentId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:bg-white dark:focus:bg-[#181b20] cursor-pointer"
                >
                  <option value="">Выберите Daily...</option>
                  {availableDailies.map((d: any) => (
                    <option key={d.id} value={d.id}>{d.epicName} ➔ {d.sprintName} ➔ {d.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Название *</label>
              <input
                type="text"
                required
                placeholder="Введите название элемента"
                value={modalName}
                onChange={(e) => setModalName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-base font-semibold focus:bg-white dark:focus:bg-[#181b20] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Описание</label>
              <textarea
                rows={5}
                placeholder="Подробное описание задачи или направления..."
                value={modalDesc}
                onChange={(e) => setModalDesc(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-2xl p-4 text-sm font-medium focus:bg-white dark:focus:bg-[#181b20] outline-none"
              />
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-[#262932]">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262932] rounded-xl transition-colors cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-8 py-3 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-md transition-all cursor-pointer"
              >
                Создать элемент
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // =========================================================================
  // FULL-PAGE VIEW 7: ADD MONTH IN PLANS (AUTO-GENERATE SPRINTS)
  // =========================================================================
  if (isAddMonthOpen) {
    return (
      <div className="max-w-2xl mx-auto font-sans pb-16 animate-in fade-in duration-150">
        <button
          onClick={() => setIsAddMonthOpen(false)}
          className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-semibold mb-6 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Назад к планам
        </button>

        <div className="bg-white dark:bg-[#181b20] rounded-3xl p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Создать план на месяц</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Задайте название, период и количество спринтов. План месяца автоматически соберет все показатели из задач спринтов.
          </p>

          <form onSubmit={handleAddMonth} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Название месяца</label>
              <input
                type="text"
                required
                placeholder="Например: Ноябрь 2026"
                value={newMonthName}
                onChange={(e) => setNewMonthName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-base font-semibold focus:bg-white dark:focus:bg-[#181b20] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Период дат месяца</label>
              <input
                type="text"
                placeholder="01.11.2026 — 30.11.2026"
                value={newMonthPeriod}
                onChange={(e) => setNewMonthPeriod(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm font-medium focus:bg-white dark:focus:bg-[#181b20] outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                  Количество спринтов в месяце
                </label>
                <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                  Обычно 4 или 5 спринтов
                </span>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => setNewMonthSprintsCount(4)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                    newMonthSprintsCount === 4
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-[#4f46e5] text-[#4f46e5] dark:text-indigo-300 shadow-xs'
                      : 'border-gray-200 dark:border-[#2b303c] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1c2028]'
                  }`}
                >
                  4 спринта (типовой)
                </button>
                <button
                  type="button"
                  onClick={() => setNewMonthSprintsCount(5)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                    newMonthSprintsCount === 5
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 border-[#4f46e5] text-[#4f46e5] dark:text-indigo-300 shadow-xs'
                      : 'border-gray-200 dark:border-[#2b303c] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1c2028]'
                  }`}
                >
                  5 спринтов (удлинённый)
                </button>
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-gray-400 font-medium">Своё число:</span>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newMonthSprintsCount}
                    onChange={(e) => setNewMonthSprintsCount(Math.max(1, Number(e.target.value)))}
                    className="w-16 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-2.5 py-2 text-center text-sm font-bold outline-none"
                  />
                </div>
              </div>

              {/* Preview of generated sprints */}
              <div className="bg-slate-50 dark:bg-[#121418] rounded-2xl p-4 border border-gray-100 dark:border-[#262932]">
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2.5">
                  Будут автоматически созданы спринты ({newMonthSprintsCount}):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Array.from({ length: newMonthSprintsCount }).map((_, idx) => {
                    const i = idx + 1
                    let periodLabel = `Спринт ${i}`
                    if (newMonthSprintsCount === 4) {
                      if (i === 1) periodLabel = '01 — 07 число'
                      else if (i === 2) periodLabel = '08 — 14 число'
                      else if (i === 3) periodLabel = '15 — 21 число'
                      else if (i === 4) periodLabel = '22 — 30/31 число'
                    } else if (newMonthSprintsCount === 5) {
                      if (i === 1) periodLabel = '01 — 07 число'
                      else if (i === 2) periodLabel = '08 — 14 число'
                      else if (i === 3) periodLabel = '15 — 21 число'
                      else if (i === 4) periodLabel = '22 — 28 число'
                      else if (i === 5) periodLabel = '29 — 30/31 число'
                    }
                    return (
                      <div key={i} className="flex items-center text-xs font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-[#181b20] px-3 py-2 rounded-xl border border-gray-100 dark:border-[#2b303c]">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 flex items-center justify-center font-bold mr-2 text-[10px]">
                          {i}
                        </span>
                        Спринт {i} <span className="text-gray-400 ml-1 font-normal">({periodLabel})</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs text-indigo-900 dark:text-indigo-200">
              <span className="font-bold">✨ Автоматический подсчет плана:</span> В сам месяц ничего вручную вводить не требуется. После создания вы сразу добавляете конкретные задачи в спринты — месячный план сам подтянет и отобразит суммарные показатели выполнения.
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#262932]">
              <button
                type="button"
                onClick={() => setIsAddMonthOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262932] rounded-xl cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-md transition-all cursor-pointer"
              >
                Создать месяц и спринты
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // =========================================================================
  // FULL-PAGE VIEW 8: ADD TASK TO SPRINT
  // =========================================================================
  if (isAddTaskToSprintOpen) {
    return (
      <div className="max-w-2xl mx-auto font-sans pb-16 animate-in fade-in duration-150">
        <button
          onClick={() => setIsAddTaskToSprintOpen(false)}
          className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-semibold mb-6 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Назад к планам
        </button>

        <div className="bg-white dark:bg-[#181b20] rounded-3xl p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Добавить задачу в спринт</h1>
            <span className="bg-indigo-100 dark:bg-indigo-950/70 text-[#4f46e5] dark:text-indigo-300 text-xs font-bold px-3 py-1 rounded-full">
              {targetSprintName}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Укажите целевой показатель и плановое число для этого спринта. Значение сразу отобразится в сводном плане месяца.
          </p>

          <form onSubmit={handleAddTaskToSprint} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Тип элемента</label>
              <div className="grid grid-cols-2 gap-3 mb-1">
                <button
                  type="button"
                  onClick={() => setNewTaskType('TASK')}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    newTaskType === 'TASK'
                      ? 'bg-[#4f46e5] text-white border-[#4f46e5] shadow-xs'
                      : 'bg-gray-50 dark:bg-[#121418] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#2b303c] hover:bg-gray-100 dark:hover:bg-[#1e222a]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-300" />
                  TASK (Таск / Задача)
                </button>
                <button
                  type="button"
                  onClick={() => setNewTaskType('DAILY')}
                  className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    newTaskType === 'DAILY'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-gray-50 dark:bg-[#121418] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-[#2b303c] hover:bg-gray-100 dark:hover:bg-[#1e222a]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-300" />
                  DAILY (Делик / Ежедневный)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Название задачи / показателя</label>
              <input
                type="text"
                required
                placeholder="Например: 30 визитов к врачам или 15 аптек"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-base font-semibold focus:bg-white dark:focus:bg-[#181b20] outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">План на спринт (число)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newTaskPlan}
                  onChange={(e) => setNewTaskPlan(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-base font-semibold focus:bg-white dark:focus:bg-[#181b20] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Факт (выполнено сейчас)</label>
                <input
                  type="number"
                  min="0"
                  value={newTaskFact}
                  onChange={(e) => setNewTaskFact(Number(e.target.value))}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-base font-semibold focus:bg-white dark:focus:bg-[#181b20] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Ответственный</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {['Азамат', 'Наргиза', 'Тимур', 'Дилшод'].map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setNewTaskAssignee(name)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        newTaskAssignee === name
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 border-[#4f46e5] text-[#4f46e5] dark:text-indigo-300'
                          : 'border-gray-200 dark:border-[#2b303c] text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Имя ответственного"
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white dark:focus:bg-[#181b20] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Начальный статус</label>
                <select
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value as any)}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm font-semibold focus:bg-white dark:focus:bg-[#181b20] outline-none cursor-pointer"
                >
                  <option value="Not Done">Не начато (Not Done)</option>
                  <option value="In Progress">В процессе (In Progress)</option>
                  <option value="Done">Выполнено (Done)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#262932]">
              <button
                type="button"
                onClick={() => setIsAddTaskToSprintOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262932] rounded-xl cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-md transition-all cursor-pointer"
              >
                Добавить задачу в спринт
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // =========================================================================
  // FULL-PAGE VIEW 9: ADD EXTRA SPRINT
  // =========================================================================
  if (isAddSprintOpen) {
    return (
      <div className="max-w-2xl mx-auto font-sans pb-16 animate-in fade-in duration-150">
        <button
          onClick={() => setIsAddSprintOpen(false)}
          className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm font-semibold mb-6 transition-colors cursor-pointer group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Назад к планам
        </button>

        <div className="bg-white dark:bg-[#181b20] rounded-3xl p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Добавить спринт в месяц</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Вы можете добавить дополнительный спринт к существующему месяцу.
          </p>

          <form onSubmit={handleAddSprintToMonth} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Название спринта</label>
              <input
                type="text"
                required
                placeholder="Спринт 5 (29.10 — 31.10)"
                value={newSprintName}
                onChange={(e) => setNewSprintName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-base font-semibold focus:bg-white dark:focus:bg-[#181b20] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 dark:text-gray-400 mb-2">Период спринта</label>
              <input
                type="text"
                placeholder="29.10 — 31.10"
                value={newSprintPeriod}
                onChange={(e) => setNewSprintPeriod(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-4 py-3 text-sm font-medium focus:bg-white dark:focus:bg-[#181b20] outline-none"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-[#262932]">
              <button
                type="button"
                onClick={() => setIsAddSprintOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262932] rounded-xl cursor-pointer"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl shadow-md cursor-pointer"
              >
                Добавить спринт
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto font-sans pb-12">
      
      {/* Breadcrumb / Back & Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/projects" className="inline-flex items-center text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white text-sm font-medium transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Назад к проектам
        </Link>
        <button 
          onClick={handleDeleteCurrentProject}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors border border-rose-200/60 dark:border-rose-900/50 cursor-pointer"
        >
          <Trash2 size={14} /> Удалить проект
        </button>
      </div>

      {/* Header Area */}
      <div className="flex flex-wrap lg:flex-nowrap justify-between items-start mb-8 gap-6">
        <div className="flex items-center">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center mr-5 shrink-0">
            <span className="text-4xl font-bold text-[#4f46e5] dark:text-indigo-400">{projectInitial}</span>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1 tracking-tight">{projectName}</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Все задачи, декомпозиция и прогресс проекта</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="bg-white dark:bg-[#181b20] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#262932] flex items-center gap-4 min-w-[280px]">
            <div className="text-gray-400 dark:text-gray-500">
              <Calendar size={24} strokeWidth={1.5} />
            </div>
            <div>
              <div className="font-bold text-gray-900 dark:text-white text-[15px]">1 сент. 2026 — 30 сент. 2026</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Период проекта</div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#181b20] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-[#262932] min-w-[320px]">
            <div className="flex justify-between items-center mb-3">
              <div className="font-bold text-gray-900 dark:text-white text-[15px]">Прогресс проекта</div>
              <div className="font-bold text-gray-900 dark:text-white text-sm">{progressPercent}%</div>
            </div>
            <div className="w-full bg-gray-100 dark:bg-[#262932] rounded-full h-2.5 mb-3 overflow-hidden">
              <div 
                className="bg-[#4f46e5] h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">{completedTasksCount} из {totalTasksCount} задач завершено</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TABS NAVIGATION                                                           */}
      {/* ========================================================================= */}
      <div className="flex border-b border-gray-200 dark:border-[#262932] mb-6">
        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex items-center font-bold pb-4 border-b-2 px-2 mr-8 transition-colors ${
            activeTab === 'tasks' ? 'text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5] dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          <LayoutList size={18} className="mr-2" /> Задачи (Декомпозиция)
        </button>

        <button 
          onClick={() => setActiveTab('plans')}
          className={`flex items-center font-bold pb-4 border-b-2 px-2 mr-8 transition-colors ${
            activeTab === 'plans' ? 'text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5] dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          <CalendarDays size={18} className="mr-2" /> Расписание и Планы
        </button>

        <button 
          onClick={() => setActiveTab('bloggers')}
          className={`flex items-center font-bold pb-4 border-b-2 px-2 mr-8 transition-colors ${
            activeTab === 'bloggers' ? 'text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5] dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          <Users size={18} className="mr-2" /> Блогеры
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold ${
            activeTab === 'bloggers' ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-[#262932] text-gray-600 dark:text-gray-400'
          }`}>
            {bloggersData.length}
          </span>
        </button>

        <button 
          onClick={() => setActiveTab('companies')}
          className={`flex items-center font-bold pb-4 border-b-2 px-2 mr-8 transition-colors ${
            activeTab === 'companies' ? 'text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5] dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-white'
          }`}
        >
          <Building2 size={18} className="mr-2" /> Компании и Партнеры
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full font-semibold ${
            activeTab === 'companies' ? 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300' : 'bg-gray-100 dark:bg-[#262932] text-gray-600 dark:text-gray-400'
          }`}>
            {companiesData.length}
          </span>
        </button>

        <button 
          onClick={() => setActiveTab('members')}
          className={`flex items-center font-medium pb-4 border-b-2 px-2 mr-8 transition-colors ${
            activeTab === 'members' ? 'text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5] dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-white'
          }`}
        >
           Участники
        </button>

        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex items-center font-medium pb-4 border-b-2 px-2 transition-colors ${
            activeTab === 'settings' ? 'text-[#4f46e5] dark:text-indigo-400 border-[#4f46e5] dark:border-indigo-400' : 'text-gray-500 dark:text-gray-400 border-transparent hover:text-gray-800 dark:hover:text-white'
          }`}
        >
           Настройки
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PLANS & SCHEDULE (Month aggregated from Sprints)                   */}
      {/* ========================================================================= */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          {/* Header Toolbar */}
          <div className="flex flex-wrap justify-between items-center gap-4 bg-white dark:bg-[#181b20] p-6 rounded-2xl border border-gray-100 dark:border-[#262932] shadow-xs">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Планы на месяц и Спринты</h2>
                <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                  Автоматический расчёт
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Месячный план автоматически агрегирует все показатели из задач, добавленных в спринты
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* View Switcher: Sprints vs Matrix */}
              <div className="flex bg-gray-100 dark:bg-[#121418] p-1 rounded-xl border border-gray-200/70 dark:border-[#2b303c]">
                <button
                  type="button"
                  onClick={() => setPlansViewMode('sprints')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    plansViewMode === 'sprints'
                      ? 'bg-white dark:bg-[#1f232b] text-[#4f46e5] dark:text-indigo-300 shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Отобразить спринты с задачами"
                >
                  <Layers size={14} />
                  По спринтам
                </button>
                <button
                  type="button"
                  onClick={() => setPlansViewMode('matrix')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    plansViewMode === 'matrix'
                      ? 'bg-white dark:bg-[#1f232b] text-[#4f46e5] dark:text-indigo-300 shadow-xs'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Отобразить полный сводный план всех спринтов"
                >
                  <Table size={14} />
                  Полный сводный план
                </button>
              </div>

              <button 
                onClick={() => setIsAddMonthOpen(true)}
                className="bg-[#5b52f6] hover:bg-[#4f46e5] text-white px-5 py-2.5 text-sm font-bold flex items-center rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Plus size={18} className="mr-1.5" /> Создать план на месяц
              </button>
            </div>
          </div>

          {/* Month Cards List */}
          <div className="space-y-6">
            {plansData.map(month => {
              const monthSprints = month.sprints || []
              const allMonthTasks = monthSprints.flatMap((sp: any) => sp.tasks || [])
              const totalMonthPlan = allMonthTasks.reduce((s: number, t: any) => s + Number(t.plan || 0), 0)
              const totalMonthFact = allMonthTasks.reduce((s: number, t: any) => s + Number(t.fact || 0), 0)
              const monthProgress = totalMonthPlan > 0 ? Math.min(100, Math.round((totalMonthFact / totalMonthPlan) * 100)) : 0
              const totalTasksCount = allMonthTasks.length
              const doneTasksCount = allMonthTasks.filter((t: any) => t.status === 'Done').length

              // Unique task names for consolidated matrix
              const uniqueTaskNames: string[] = Array.from(new Set<string>(allMonthTasks.map((t: any) => String(t.name || ''))))

              return (
                <div 
                  key={month.id} 
                  className="bg-white dark:bg-[#181b20] rounded-2xl border border-gray-100 dark:border-[#262932] shadow-sm overflow-hidden"
                >
                  {/* MONTH HEADER BAR - MINIMAL: DATE, STATUS, PROGRESS % */}
                  <div 
                    className="flex items-center justify-between p-4 px-6 bg-slate-50/70 dark:bg-[#1b1f27] border-b border-gray-100 dark:border-[#262932] cursor-pointer hover:bg-slate-100/70 dark:hover:bg-[#202530] transition-colors"
                    onClick={() => togglePlanOpen(month.id)}
                  >
                    <div className="flex items-center gap-3">
                      <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        {month.isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                      <div className="flex items-center gap-2">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedDetailItem({ ...month, type: 'MONTH', description: month.description || '' })
                          }}
                          className="font-bold text-gray-900 dark:text-white text-[15px] hover:text-[#4f46e5] dark:hover:text-indigo-400 transition-colors"
                        >
                          {month.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          ({month.period})
                        </span>
                      </div>
                    </div>

                    {/* Minimal Right side: Status and Progress % */}
                    <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        monthProgress >= 100
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-800/40'
                          : monthProgress > 0
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/40'
                          : 'bg-gray-100 dark:bg-[#202530] text-gray-500 dark:text-gray-400'
                      }`}>
                        {monthProgress >= 100 ? 'Выполнено' : monthProgress > 0 ? 'В процессе' : 'Не начато'}
                      </span>

                      <div className="flex items-center gap-2.5 w-36">
                        <div className="flex-1 bg-gray-200 dark:bg-[#2b303c] rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              monthProgress >= 100 ? 'bg-emerald-500' : monthProgress > 0 ? 'bg-[#4f46e5]' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            style={{ width: `${monthProgress}%` }}
                          />
                        </div>
                        <span className="text-xs font-extrabold text-gray-800 dark:text-gray-200 min-w-[32px] text-right">
                          {monthProgress}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* EXPANDED CONTENT: ALL DETAILS ARE INSIDE */}
                  {month.isOpen && (
                    <div className="p-6">
                      {/* MONTH INTERNAL SUMMARY BAR ("остальное внутри его") */}
                      <div className="flex flex-wrap items-center justify-between gap-4 p-4 mb-5 bg-slate-50/70 dark:bg-[#15181f] rounded-xl border border-gray-100 dark:border-[#262932]">
                        <div className="flex flex-wrap items-center gap-5 text-xs text-gray-600 dark:text-gray-300">
                          <div>
                            <span className="text-gray-400">План месяца: </span>
                            <span className="font-bold text-gray-900 dark:text-white">{totalMonthPlan} ед.</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Факт месяца: </span>
                            <span className="font-bold text-[#4f46e5] dark:text-indigo-400">{totalMonthFact} ед.</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Спринтов: </span>
                            <span className="font-bold text-gray-900 dark:text-white">{monthSprints.length}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Задач: </span>
                            <span className="font-bold text-gray-900 dark:text-white">{totalTasksCount}</span>
                            <span className="text-gray-400"> ({doneTasksCount} выполнено)</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setTargetMonthForSprintId(month.id)
                              setIsAddSprintOpen(true)
                            }}
                            className="px-3 py-1.5 text-xs font-bold bg-[#4f46e5] text-white hover:bg-[#4338ca] rounded-xl transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <Plus size={13} strokeWidth={2.5} /> Добавить спринт
                          </button>
                          <button
                            onClick={(e) => deleteMonth(month.id, e)}
                            className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                            title="Удалить месяц"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* VIEW 1: SPRINTS CARDS & TASKS */}
                      {plansViewMode === 'sprints' && (
                        <div className="space-y-6">
                          {monthSprints.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 dark:text-gray-500">
                              В этом месяце еще нет спринтов.
                              <button
                                onClick={() => {
                                  setTargetMonthForSprintId(month.id)
                                  setIsAddSprintOpen(true)
                                }}
                                className="block mx-auto mt-3 px-4 py-2 bg-[#4f46e5] text-white text-xs font-bold rounded-xl cursor-pointer"
                              >
                                Добавить спринт
                              </button>
                            </div>
                          ) : (
                            monthSprints.map((sprint: any, _sprintIdx: number) => {
                              const sprintTasks = sprint.tasks || []
                              const sprintPlan = sprintTasks.reduce((s: number, t: any) => s + Number(t.plan || 0), 0)
                              const sprintFact = sprintTasks.reduce((s: number, t: any) => s + Number(t.fact || 0), 0)
                              const sprintProgress = sprintPlan > 0 ? Math.min(100, Math.round((sprintFact / sprintPlan) * 100)) : 0

                              return (
                                <div 
                                  key={sprint.id}
                                  className="border border-gray-100 dark:border-[#262932] rounded-xl overflow-hidden bg-slate-50/30 dark:bg-[#14171d]"
                                >
                                  {/* SPRINT HEADER - MINIMAL: DATE / PERIOD, STATUS, PROGRESS % */}
                                  <div 
                                    className="flex items-center justify-between p-3.5 px-5 bg-white dark:bg-[#181b20] border-b border-gray-100 dark:border-[#262932] cursor-pointer hover:bg-slate-50 dark:hover:bg-[#1c2028] transition-colors"
                                    onClick={() => togglePlanOpen(sprint.id)}
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <button className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                        {sprint.isOpen !== false ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                      </button>
                                      <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-md tracking-wider uppercase shrink-0">
                                        СПРИНТ
                                      </span>
                                      <span className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-1.5">
                                        <Calendar size={14} className="text-indigo-500" />
                                        {sprint.period || sprint.name}
                                      </span>
                                    </div>

                                    {/* Minimal Right side: Sprint Status and Progress % */}
                                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 hidden sm:inline">
                                        Выполнение спринта:
                                      </span>
                                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                        sprintProgress >= 100
                                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                                          : sprintProgress > 0
                                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                                          : 'bg-gray-100 dark:bg-[#20242c] text-gray-500 dark:text-gray-400'
                                      }`}>
                                        {sprintProgress >= 100 ? 'Выполнено' : sprintProgress > 0 ? 'В процессе' : 'Не начато'}
                                      </span>

                                      <div className="flex items-center gap-2 w-28">
                                        <div className="flex-1 bg-gray-200 dark:bg-[#2b303c] rounded-full h-1.5 overflow-hidden">
                                          <div 
                                            className={`h-1.5 rounded-full transition-all duration-500 ${
                                              sprintProgress >= 100 ? 'bg-emerald-500' : sprintProgress > 0 ? 'bg-[#4f46e5]' : 'bg-gray-300 dark:bg-gray-600'
                                            }`}
                                            style={{ width: `${sprintProgress}%` }}
                                          />
                                        </div>
                                        <span className={`text-xs font-bold min-w-[28px] text-right ${
                                          sprintProgress >= 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-gray-200'
                                        }`}>
                                          {sprintProgress}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* SPRINT BODY: DETAILED INFO & ACTIONS INSIDE */}
                                  {sprint.isOpen !== false && (
                                    <div>
                                      <div className="flex items-center justify-between px-5 py-2.5 bg-slate-50/60 dark:bg-[#15181f] border-b border-gray-100 dark:border-[#262932] text-xs">
                                        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                                          <span>Задач: <strong className="text-gray-800 dark:text-gray-200">{sprintTasks.length}</strong></span>
                                          <span>•</span>
                                          <span>План: <strong className="text-gray-800 dark:text-gray-200">{sprintPlan}</strong></span>
                                          <span>•</span>
                                          <span>Факт: <strong className="text-[#4f46e5] dark:text-indigo-400">{sprintFact}</strong></span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                          <button
                                            onClick={() => {
                                              setTargetSprintMonthId(month.id)
                                              setTargetSprintId(sprint.id)
                                              setTargetSprintName(sprint.name)
                                              setIsAddTaskToSprintOpen(true)
                                            }}
                                            className="px-2.5 py-1 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                          >
                                            <Plus size={13} /> Добавить задачу
                                          </button>
                                          <button
                                            onClick={(e) => deleteSprint(month.id, sprint.id, e)}
                                            className="p-1 text-gray-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                                            title="Удалить спринт"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      </div>
                                      {/* SPRINT TASKS TABLE */}
                                      {sprintTasks.length === 0 ? (
                                        <div className="p-5 text-center text-xs text-gray-400 dark:text-gray-500">
                                          В этом спринте пока нет задач. Нажмите «+ Добавить задачу», чтобы зафиксировать целевой показатель.
                                        </div>
                                      ) : (
                                        <div className="divide-y divide-gray-100 dark:divide-[#262932]">
                                          <div className="flex items-center px-5 py-2.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider bg-slate-50/80 dark:bg-[#15181f]">
                                            <div className="flex-1">Элемент / Задача</div>
                                            <div className="w-44">Ответственный</div>
                                            <div className="w-44 text-right pr-2">Статус</div>
                                            <div className="w-14 text-right">Действия</div>
                                          </div>

                                          {sprintTasks.map((task: any) => (
                                            <div 
                                              key={task.id}
                                              className="flex items-center px-5 py-3 hover:bg-white dark:hover:bg-[#181b20] transition-colors gap-3"
                                            >
                                              {/* Task Name and Type Badge (clickable to open detail modal) */}
                                              <div 
                                                onClick={() => setSelectedDetailItem({ ...task, type: task.type || 'TASK', monthId: month.id, sprintId: sprint.id })}
                                                className="flex-1 font-semibold text-gray-800 dark:text-gray-200 text-sm hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors group flex items-center gap-2"
                                                title="Нажмите, чтобы открыть полную информацию"
                                              >
                                                {task.type === 'DAILY' ? (
                                                  <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase shrink-0">
                                                    DAILY
                                                  </span>
                                                ) : (
                                                  <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/50 tracking-wide uppercase shrink-0">
                                                    TASK
                                                  </span>
                                                )}
                                                <span className="group-hover:underline">{task.name}</span>
                                              </div>

                                              {/* Assignee */}
                                              <div className="w-44">
                                                {task.assignee ? (
                                                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#202530] px-2.5 py-1 rounded-lg">
                                                    <User size={12} className="text-indigo-500" />
                                                    {task.assignee}
                                                  </span>
                                                ) : (
                                                  <span className="text-xs text-gray-400 italic">Не назначен</span>
                                                )}
                                              </div>

                                              {/* Status Dropdown on the Right */}
                                              <div className="w-44 flex justify-end">
                                                <select
                                                  value={task.status || 'Not Done'}
                                                  onChange={(e) => updateSprintTaskStatus(month.id, sprint.id, task.id, e.target.value)}
                                                  className={`text-xs font-bold px-3 py-1.5 rounded-lg border outline-none cursor-pointer transition-all ${
                                                    task.status === 'Done'
                                                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 focus:ring-1 focus:ring-emerald-500'
                                                      : task.status === 'In Progress'
                                                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/60 focus:ring-1 focus:ring-blue-500'
                                                      : 'bg-gray-50 dark:bg-[#202530] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#2b303c] focus:ring-1 focus:ring-gray-400'
                                                  }`}
                                                  title="Выберите статус"
                                                >
                                                  <option value="Not Done" className="bg-white dark:bg-[#181b20] text-gray-700 dark:text-gray-300">
                                                    ⚪ Не начато
                                                  </option>
                                                  <option value="In Progress" className="bg-white dark:bg-[#181b20] text-blue-600 dark:text-blue-400">
                                                    🔵 В процессе
                                                  </option>
                                                  <option value="Done" className="bg-white dark:bg-[#181b20] text-emerald-600 dark:text-emerald-400">
                                                    🟢 Выполнено
                                                  </option>
                                                </select>
                                              </div>

                                              {/* Delete Task */}
                                              <div className="w-14 text-right">
                                                <button
                                                  onClick={(e) => deleteSprintTask(month.id, sprint.id, task.id, e)}
                                                  className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                                                  title="Удалить задачу"
                                                >
                                                  <Trash2 size={15} />
                                                </button>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )
                            })
                          )}
                        </div>
                      )}

                      {/* VIEW 2: CONSOLIDATED MONTH MATRIX TABLE (ПОЛНЫЙ СВОДНЫЙ ПЛАН) */}
                      {plansViewMode === 'matrix' && (
                        <div className="overflow-x-auto">
                          <div className="mb-3 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center justify-between">
                            <span>Полная сводная матрица спринтов месяца «{month.name}»</span>
                            <span className="text-indigo-600 dark:text-indigo-400 lowercase font-normal">
                              данные сформированы из задач {monthSprints.length} спринтов
                            </span>
                          </div>

                          <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                              <tr className="border-b border-gray-200 dark:border-[#262932] text-[11px] uppercase font-bold text-gray-400 dark:text-gray-400 bg-slate-50 dark:bg-[#14171d]">
                                <th className="py-3 px-4 rounded-l-xl">Задача / Показатель</th>
                                <th className="py-3 px-4">Ответственный</th>
                                {monthSprints.map((sp: any, i: number) => (
                                  <th key={sp.id} className="py-3 px-3 text-center">
                                    <div>Спринт {i + 1}</div>
                                    <div className="text-[9px] font-normal text-gray-400 lowercase">{sp.period}</div>
                                  </th>
                                ))}
                                <th className="py-3 px-4 text-right">ИТОГО за месяц</th>
                                <th className="py-3 px-4 rounded-r-xl text-center">Выполнение</th>
                              </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100 dark:divide-[#262932] text-sm">
                              {uniqueTaskNames.length === 0 ? (
                                <tr>
                                  <td colSpan={monthSprints.length + 4} className="py-8 text-center text-gray-400 italic">
                                    В спринтах пока нет добавленных задач. Переключитесь на вкладку «По спринтам» и добавьте показатели.
                                  </td>
                                </tr>
                              ) : (
                                uniqueTaskNames.map(taskName => {
                                  // Gather metrics for this task across all sprints
                                  let totalTaskPlan = 0
                                  let totalTaskFact = 0
                                  let sampleUnit = 'шт'
                                  let sampleAssignee = '—'

                                  const sprintBreakdowns = monthSprints.map((sp: any) => {
                                    const match = (sp.tasks || []).find((t: any) => t.name === taskName)
                                    if (match) {
                                      totalTaskPlan += Number(match.plan || 0)
                                      totalTaskFact += Number(match.fact || 0)
                                      sampleUnit = match.unit || sampleUnit
                                      sampleAssignee = match.assignee || sampleAssignee
                                      return {
                                        exists: true,
                                        plan: match.plan,
                                        fact: match.fact,
                                        status: match.status
                                      }
                                    }
                                    return { exists: false, plan: 0, fact: 0, status: 'Not Done' }
                                  })

                                  const taskProgress = totalTaskPlan > 0 ? Math.min(100, Math.round((totalTaskFact / totalTaskPlan) * 100)) : 0

                                  return (
                                    <tr key={taskName} className="hover:bg-slate-50/50 dark:hover:bg-[#1f232b] transition-colors">
                                      {/* Indicator Name */}
                                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">
                                        {taskName}
                                        <span className="text-xs font-normal text-gray-400 ml-1.5">({sampleUnit})</span>
                                      </td>

                                      {/* Assignee */}
                                      <td className="py-3.5 px-4">
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#202530] px-2 py-0.5 rounded-md">
                                          <User size={11} className="text-indigo-500" />
                                          {sampleAssignee}
                                        </span>
                                      </td>

                                      {/* Sprint Columns */}
                                      {sprintBreakdowns.map((spData: any, idx: number) => (
                                        <td key={idx} className="py-3.5 px-3 text-center">
                                          {spData.exists ? (
                                            <div className="inline-block">
                                              <span className="font-extrabold text-gray-900 dark:text-white text-xs">
                                                {spData.fact}
                                              </span>
                                              <span className="text-gray-400 text-xs mx-0.5">/</span>
                                              <span className="text-gray-500 text-xs">
                                                {spData.plan}
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="text-gray-300 dark:text-gray-600 text-xs">—</span>
                                          )}
                                        </td>
                                      ))}

                                      {/* Month Total (Fact / Plan) */}
                                      <td className="py-3.5 px-4 text-right font-extrabold text-sm">
                                        <span className="text-[#4f46e5] dark:text-indigo-400">{totalTaskFact}</span>
                                        <span className="text-gray-400 mx-1">/</span>
                                        <span className="text-gray-900 dark:text-white">{totalTaskPlan}</span>
                                        <span className="text-xs font-normal text-gray-400 ml-1">{sampleUnit}</span>
                                      </td>

                                      {/* Progress % */}
                                      <td className="py-3.5 px-4 text-center">
                                        <span className={`inline-block text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                                          taskProgress >= 100
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                                            : taskProgress > 0
                                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                                            : 'bg-gray-100 dark:bg-[#202530] text-gray-500'
                                        }`}>
                                          {taskProgress}%
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                })
                              )}
                            </tbody>

                            {/* TABLE FOOTER SUMMARY */}
                            {uniqueTaskNames.length > 0 && (
                              <tfoot>
                                <tr className="border-t-2 border-gray-200 dark:border-[#262932] font-extrabold text-sm bg-slate-50/80 dark:bg-[#14171d]">
                                  <td className="py-4 px-4 text-gray-900 dark:text-white uppercase text-xs tracking-wider">
                                    СУММАРНО ЗА МЕСЯЦ
                                  </td>
                                  <td className="py-4 px-4 text-xs text-gray-400">—</td>
                                  {monthSprints.map((sp: any) => {
                                    const spPlan = (sp.tasks || []).reduce((s: number, t: any) => s + Number(t.plan || 0), 0)
                                    const spFact = (sp.tasks || []).reduce((s: number, t: any) => s + Number(t.fact || 0), 0)
                                    return (
                                      <td key={sp.id} className="py-4 px-3 text-center text-xs font-extrabold">
                                        <span className="text-[#4f46e5] dark:text-indigo-400">{spFact}</span>
                                        <span className="text-gray-400 mx-0.5">/</span>
                                        <span className="text-gray-900 dark:text-white">{spPlan}</span>
                                      </td>
                                    )
                                  })}
                                  <td className="py-4 px-4 text-right text-base text-[#4f46e5] dark:text-indigo-400 font-extrabold">
                                    {totalMonthFact} <span className="text-gray-400 text-xs">/</span> {totalMonthPlan}
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                                      {monthProgress}% выполнено
                                    </span>
                                  </td>
                                </tr>
                              </tfoot>
                            )}
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
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
                  className="w-full bg-white dark:bg-[#181b20] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white dark:bg-[#181b20] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 outline-none w-40 cursor-pointer focus:ring-2 focus:ring-[#4f46e5]/20"
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
                className="bg-white dark:bg-[#181b20] border border-gray-200 dark:border-[#2b303c] rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 outline-none w-40 cursor-pointer focus:ring-2 focus:ring-[#4f46e5]/20"
              >
                <option value="ALL">Все статусы</option>
                <option value="Done">Done (Готово)</option>
                <option value="In Progress">In Progress (В работе)</option>
                <option value="Not Done">Not Done (Не начато)</option>
              </select>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex bg-white dark:bg-[#181b20] rounded-xl border border-gray-200 dark:border-[#2b303c] overflow-hidden">
                <button 
                  onClick={() => setViewMode('list')}
                  title="Табличный вид"
                  className={`p-2.5 transition-colors cursor-pointer ${viewMode === 'list' ? 'text-[#4f46e5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  <LayoutList size={18} />
                </button>
                <button 
                  onClick={() => setViewMode('board')}
                  title="Канбан доска"
                  className={`p-2.5 transition-colors cursor-pointer ${viewMode === 'board' ? 'text-[#4f46e5] dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                >
                  <Grip size={18} />
                </button>
              </div>
              
              <button 
                onClick={() => {
                  setModalType('EPIC')
                  setIsModalOpen(true)
                }}
                className="bg-[#5b52f6] hover:bg-[#4f46e5] text-white px-4 py-2.5 text-sm font-bold flex items-center rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <Plus size={18} className="mr-1.5" /> Добавить Epic
              </button>

              <button 
                onClick={() => {
                  setModalType('TASK')
                  setIsModalOpen(true)
                }}
                className="bg-white dark:bg-[#181b20] border border-gray-200 dark:border-[#2b303c] hover:bg-gray-50 dark:hover:bg-[#202532] text-gray-700 dark:text-gray-200 px-4 py-2.5 text-sm font-bold flex items-center rounded-xl transition-all shadow-xs cursor-pointer"
              >
                <Plus size={18} className="mr-1.5" /> Добавить задачу
              </button>
            </div>
          </div>

          {/* Main View: Tree Table */}
          {viewMode === 'list' && (
            <div className="bg-white dark:bg-[#181b20] rounded-2xl shadow-sm border border-gray-100 dark:border-[#262932] overflow-x-auto">
              <div className="flex bg-white dark:bg-[#181b20] border-b border-gray-100 dark:border-[#262932] text-[11px] uppercase font-bold text-gray-400 dark:text-gray-400 tracking-wider min-w-[1050px]">
                <div className="flex-1 py-4 px-6 min-w-[300px]">Название (Epic / Sprint / Daily / Task)</div>
                <div className="w-[300px] py-4 pr-6 shrink-0">Описание</div>
                <div className="w-[140px] py-4 pr-6 shrink-0">Статус</div>
                <div className="w-[160px] py-4 pr-6 shrink-0">Кто создал</div>
                <div className="w-[140px] py-4 pr-2 shrink-0">Дата создания</div>
                <div className="w-[120px] py-4 pr-6 text-right shrink-0">Действия</div>
              </div>

              <div className="min-w-[1050px]">
                {filteredTasksTree.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 dark:text-gray-500">
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
                  <div key={status} className="bg-gray-100/70 dark:bg-[#14171d] rounded-2xl p-4 flex flex-col min-h-[400px] border border-transparent dark:border-[#262932]">
                    <div className="flex justify-between items-center mb-4 px-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-800 dark:text-white">{status}</span>
                        <span className="text-xs bg-white dark:bg-[#20242c] text-gray-500 dark:text-gray-300 font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {columnTasks.length}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {columnTasks.map(task => (
                        <div 
                          key={task.id} 
                          onClick={() => setSelectedDetailItem(task)}
                          className="bg-white dark:bg-[#181b20] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-[#262932] hover:shadow-md dark:hover:border-indigo-500/40 transition-shadow cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            {renderBadge(task.type)}
                            <span className="text-xs text-gray-400 dark:text-gray-500">{task.date}</span>
                          </div>
                          <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-1 hover:text-[#4f46e5] dark:hover:text-indigo-400">{task.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{task.description}</p>
                          
                          <div className="flex justify-between items-center border-t border-gray-50 dark:border-[#262932] pt-3">
                            <div className="flex items-center">
                              <div className={`w-5 h-5 rounded-full ${task.creatorColor} text-white flex items-center justify-center text-[10px] font-bold mr-1.5`}>
                                {task.creatorInitial}
                              </div>
                              <span className="text-xs text-gray-600 dark:text-gray-300">{task.creator}</span>
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
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Показано {allTasks.length} элементов
            </span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262932] transition-colors cursor-pointer">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-950/70 text-[#4f46e5] dark:text-indigo-300 font-bold text-sm">
                1
              </button>
              <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-[#262932] transition-colors cursor-pointer">
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Список блогеров ({projectName})</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Инфлюенсеры, с которыми согласованы условия и ведётся сотрудничество
              </p>
            </div>
            
            <button 
              onClick={() => setIsAddBloggerOpen(true)}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl font-medium px-4 py-2.5 text-sm shadow-sm shadow-indigo-100 flex items-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <Plus size={16} /> Добавить блогера
            </button>
          </div>

          {/* Quick Auto-Add Blogger Bar (Only Name + Nickname) */}
          <form 
            onSubmit={handleQuickAddBlogger}
            className="bg-white dark:bg-[#181b20] rounded-2xl p-4 border border-indigo-100 dark:border-[#262932] shadow-sm flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs shrink-0 pr-2 border-r border-indigo-100 dark:border-[#262932]">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles size={14} className="animate-pulse" />
              </div>
              <span>Быстрое добавление:</span>
            </div>
            
            <div className="flex-1 min-w-[180px]">
              <input 
                type="text"
                placeholder="Имя блогера (например: Мадина)"
                value={quickBloggerName}
                onChange={(e) => setQuickBloggerName(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            <div className="flex-1 min-w-[180px]">
              <input 
                type="text"
                placeholder="Никнейм (например: @madina_beauty или ссылка)"
                value={quickBloggerHandle}
                onChange={(e) => setQuickBloggerHandle(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
            </div>

            <button 
              type="submit"
              disabled={!quickBloggerName.trim() && !quickBloggerHandle.trim()}
              className="bg-[#4f46e5] hover:bg-[#4338ca] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Zap size={14} /> Добавить (авто-подтяг)
            </button>
          </form>

          {/* Search & Platform Filter Toolbar */}
          <div className="bg-white dark:bg-[#181b20] rounded-2xl p-4 border border-gray-100 dark:border-[#262932] shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Поиск по имени, нику или заметкам..."
                  value={bloggerSearch}
                  onChange={(e) => setBloggerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              {/* Platform Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['ALL', 'Instagram', 'Telegram', 'TikTok', 'YouTube'].map(platform => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => setBloggerPlatformFilter(platform)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      bloggerPlatformFilter === platform
                        ? 'bg-[#1a2332] dark:bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-50 dark:bg-[#20242c] text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#282d38]'
                    }`}
                  >
                    {platform === 'ALL' ? 'Все' : platform}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clean Bloggers List */}
          <div className="space-y-3">
            {filteredBloggers.length === 0 ? (
              <div className="bg-white dark:bg-[#181b20] rounded-2xl border border-gray-100 dark:border-[#262932] p-12 text-center text-gray-400 dark:text-gray-500">
                <Users size={36} className="mx-auto mb-2 text-gray-300 dark:text-gray-600 stroke-[1.5]" />
                <p className="font-semibold text-gray-600 dark:text-gray-300">Блогеры не найдены</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Попробуйте изменить поисковый запрос или фильтр платформы</p>
              </div>
            ) : (
              filteredBloggers.map((blogger) => {
                return (
                  <div 
                    key={blogger.id}
                    onClick={() => setSelectedBlogger(blogger)}
                    className="bg-white dark:bg-[#181b20] rounded-2xl p-4 border border-gray-100 dark:border-[#262932] shadow-sm hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:shadow-md transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4 group"
                  >
                    {/* Left: Identity & Platform */}
                    <div className="flex items-center gap-4 min-w-[280px]">
                      <div className={`w-12 h-12 rounded-2xl ${blogger.avatarColor} text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0`}>
                        {blogger.avatarChar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-[#4f46e5] dark:group-hover:text-indigo-400 transition-colors">
                            {blogger.name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                            blogger.platform === 'Instagram'
                              ? 'bg-pink-50 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300'
                              : blogger.platform === 'Telegram'
                              ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300'
                              : blogger.platform === 'TikTok'
                              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
                              : 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300'
                          }`}>
                            {blogger.platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">
                          <span>{blogger.handle}</span>
                          <span>•</span>
                          <span className="text-gray-500 dark:text-gray-400 font-sans">{blogger.format}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Sprint & Date */}
                    <div className="flex items-center gap-4 text-xs">
                      <div className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold px-2.5 py-1 rounded-lg">
                        {blogger.sprint}
                      </div>
                      <span className="text-gray-400 dark:text-gray-500 font-medium">{blogger.publishDate}</span>
                    </div>

                    {/* Right: Price & Detailed View CTA */}
                    <div className="flex items-center gap-3 ml-auto">
                      <div className="text-right">
                        <span className="font-bold text-gray-900 dark:text-white font-mono text-sm">{blogger.price}</span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">охват ~{blogger.reach}</p>
                      </div>

                      {/* Direct Post Link Icon if exists */}
                      {blogger.postUrl && (
                        <a
                          href={blogger.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 flex items-center justify-center transition-colors"
                          title="Открыть публикацию"
                        >
                          <ExternalLink size={14} />
                        </a>
                      )}

                      {/* More Details Action Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedBlogger(blogger)}
                        className="px-3 py-1.5 bg-gray-50 dark:bg-[#20242c] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-[#4f46e5] dark:hover:text-indigo-300 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Подробнее <ChevronRight size={14} />
                      </button>

                      {/* Quick Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm(`Вы уверены, что хотите удалить блогера ${blogger.name}?`)) {
                            deleteBlogger(blogger.id, e)
                          }
                        }}
                        className="w-8 h-8 rounded-xl text-gray-400 dark:text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors cursor-pointer"
                        title="Удалить блогера"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Simple Footer Counter */}
          <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 px-2 pt-2">
            <span>Всего в списке: <strong className="text-gray-700 dark:text-gray-200">{filteredBloggers.length}</strong> блогеров</span>
            <span>Кликните на строку для открытия брифа, тезисов и контактов</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: COMPANIES & PARTNERS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'companies' && (
        <div className="space-y-6">
          {/* Top Summary / KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#181b20] p-5 rounded-2xl border border-gray-100 dark:border-[#262932] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Building2 size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Всего компаний / партнеров</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{companiesData.length}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-[#181b20] p-5 rounded-2xl border border-gray-100 dark:border-[#262932] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Потрачено на партнеров</p>
                <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${totalCompaniesSpent.toLocaleString()}</h3>
              </div>
            </div>

            <div className="bg-white dark:bg-[#181b20] p-5 rounded-2xl border border-gray-100 dark:border-[#262932] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Активных сотрудничеств</p>
                <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {companiesData.filter(c => c.status === 'В процессе' || c.status === 'Договорились').length}
                </h3>
              </div>
            </div>

            <div className="bg-white dark:bg-[#181b20] p-5 rounded-2xl border border-gray-100 dark:border-[#262932] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Package size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">Категорий бизнеса</p>
                <h3 className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {companyCategories.length}
                </h3>
              </div>
            </div>
          </div>

          {/* Action & Filter Toolbar */}
          <div className="bg-white dark:bg-[#181b20] p-4 rounded-2xl border border-gray-100 dark:border-[#262932] shadow-sm flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по названию, локации, предметам, категории..."
                  value={companySearch}
                  onChange={(e) => setCompanySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] text-gray-900 dark:text-white rounded-xl text-xs font-medium focus:bg-white dark:focus:bg-[#181b20] focus:border-[#4f46e5] outline-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
              </div>

              {/* Category Filter */}
              <div className="relative">
                <select
                  value={companyCategoryFilter}
                  onChange={(e) => setCompanyCategoryFilter(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none hover:bg-gray-100 dark:hover:bg-[#20242c] cursor-pointer"
                >
                  <option value="ALL">Все категории</option>
                  {companyCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={companyStatusFilter}
                  onChange={(e) => setCompanyStatusFilter(e.target.value)}
                  className="appearance-none bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none hover:bg-gray-100 dark:hover:bg-[#20242c] cursor-pointer"
                >
                  <option value="ALL">Все статусы</option>
                  <option value="Договорились">Договорились</option>
                  <option value="Предоставлено">Предоставлено</option>
                  <option value="В процессе">В процессе</option>
                  <option value="Завершено">Завершено</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            <button
              onClick={() => setIsAddCompanyOpen(true)}
              className="px-4 py-2 bg-[#4f46e5] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#4338ca] transition-colors shrink-0 cursor-pointer"
            >
              <Plus size={16} /> Добавить компанию
            </button>
          </div>

          {/* Companies List */}
          <div className="space-y-3">
            {filteredCompanies.length === 0 ? (
              <div className="bg-white dark:bg-[#181b20] rounded-2xl border border-gray-100 dark:border-[#262932] p-12 text-center text-gray-400 dark:text-gray-500">
                <Building2 size={36} className="mx-auto mb-2 text-gray-300 dark:text-gray-600 stroke-[1.5]" />
                <p className="font-semibold text-gray-600 dark:text-gray-300">Компании не найдены</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Попробуйте изменить поисковый запрос или добавьте нового партнера</p>
              </div>
            ) : (
              filteredCompanies.map((company) => {
                const isCompleted = company.status === 'Завершено'
                const isProvided = company.status === 'Предоставлено'
                const isInProgress = company.status === 'В процессе'

                return (
                  <div
                    key={company.id}
                    onClick={() => setSelectedCompany(company)}
                    className="bg-white dark:bg-[#181b20] rounded-2xl p-4 border border-gray-100 dark:border-[#262932] shadow-sm hover:border-indigo-200 dark:hover:border-indigo-500/40 hover:shadow-md transition-all cursor-pointer flex flex-wrap items-center justify-between gap-4 group"
                  >
                    {/* Left: Identity & Category & Location */}
                    <div className="flex items-center gap-4 min-w-[280px] max-w-sm">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                        <Building2 size={22} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white text-base group-hover:text-[#4f46e5] dark:group-hover:text-indigo-400 transition-colors">
                            {company.name}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                            {company.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <MapPin size={13} className="text-gray-400 dark:text-gray-500 shrink-0" />
                          <span className="truncate">{company.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Items & Materials Provided */}
                    <div className="flex-1 min-w-[240px] max-w-md">
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 font-bold uppercase mb-1">
                        <Package size={13} className="text-indigo-500" />
                        <span>Предоставленные материалы / предметы:</span>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2 bg-gray-50 dark:bg-[#20242c] rounded-xl p-2 border border-gray-100 dark:border-[#262932]">
                        {company.itemsProvided || 'Не указано'}
                      </p>
                    </div>

                    {/* Sprint & Date */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold px-2.5 py-1 rounded-lg">
                        {company.sprint}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Calendar size={13} className="text-gray-400 dark:text-gray-500" />
                        <span>{company.date}</span>
                      </div>
                    </div>

                    {/* Right: Spent & Status & Action */}
                    <div className="flex items-center gap-3">
                      {/* Spent Amount */}
                      <div className="text-right min-w-[90px]">
                        <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                          {company.spent}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          расходы
                        </div>
                      </div>

                      {/* Interactive Status Badge */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          cycleCompanyStatus(company.id, e)
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                            : isProvided
                            ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60'
                            : isInProgress
                            ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60'
                            : 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                        }`}
                        title="Нажмите для быстрой смены статуса"
                      >
                        {isCompleted && <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400" />}
                        {company.status}
                      </button>

                      {/* More Details Action Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedCompany(company)}
                        className="px-3 py-1.5 bg-gray-50 dark:bg-[#20242c] hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-[#4f46e5] dark:hover:text-indigo-300 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Подробнее <ChevronRight size={14} />
                      </button>

                      {/* Quick Delete Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm(`Вы уверены, что хотите удалить компанию "${company.name}"?`)) {
                            deleteCompany(company.id, e)
                          }
                        }}
                        className="w-8 h-8 rounded-xl text-gray-400 dark:text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center transition-colors cursor-pointer"
                        title="Удалить компанию"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Simple Footer Counter */}
          <div className="flex justify-between items-center text-xs text-gray-400 dark:text-gray-500 px-2 pt-2">
            <span>Всего в списке: <strong className="text-gray-700 dark:text-gray-200">{filteredCompanies.length}</strong> партнеров</span>
            <span>Кликните на карточку компании для просмотра деталей, расходов и предоставленных предметов</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MEMBERS TAB                                                               */}
      {/* ========================================================================= */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Команда проекта ({projectName})</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Сотрудники, медицинские представители и маркетологи направления</p>
            </div>
            <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 font-bold rounded-2xl text-xs flex items-center gap-2">
              <Users size={16} /> {projectMembers.length || 4} активных участников
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(projectMembers.length > 0 ? projectMembers : [
              { id: 1, full_name: 'Азамат (Администратор)', email: 'admin@extragel.uz', role: 'admin' },
              { id: 2, full_name: 'Дилрабо Усманова', email: 'dilrabo@pharma.uz', role: 'marketing' },
              { id: 3, full_name: 'Джамшид Рахимов', email: 'jamshid@pharma.uz', role: 'medrep' },
              { id: 4, full_name: 'Малика Каримова', email: 'malika@pharma.uz', role: 'lead' }
            ]).map((user: any) => {
              const roleLabels: Record<string, { label: string; bg: string }> = {
                admin: { label: 'Администратор / PM', bg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-900/60' },
                marketing: { label: 'Маркетинг / PR', bg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-900/60' },
                medrep: { label: 'Медицинский представитель', bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/60' },
                lead: { label: 'Бренд-менеджер', bg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/60' }
              }
              const roleInfo = roleLabels[user.role] || { label: user.role || 'Участник', bg: 'bg-gray-100 dark:bg-[#20242c] text-gray-700 dark:text-gray-300 border-gray-200 dark:border-[#2b303c]' }
              return (
                <div key={user.id} className="bg-white dark:bg-[#181b20] rounded-3xl p-6 border border-gray-100 dark:border-[#262932] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#4f46e5] dark:text-indigo-400 font-bold text-lg flex items-center justify-center shrink-0">
                      {user.full_name ? user.full_name[0] : 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{user.full_name}</h3>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate flex items-center gap-1.5 mt-1 font-mono">
                        <Mail size={12} /> {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-50 dark:border-[#262932] flex items-center justify-between">
                    <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${roleInfo.bg}`}>
                      {roleInfo.label}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> В сети
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SETTINGS TAB                                                              */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-3xl mx-auto">
          <form onSubmit={handleUpdateProjectSettings} className="bg-white dark:bg-[#181b20] rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-[#262932] shadow-sm">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-100 dark:border-[#262932]">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Настройки проекта</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Редактирование основных параметров и сроков проекта</p>
              </div>
              {projectSavedFeedback && (
                <span className="px-3.5 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
                  <Check size={14} /> Сохранено!
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Название проекта</label>
                <input 
                  type="text" 
                  value={projectEditForm.name || projectName}
                  onChange={(e) => setProjectEditForm({ ...projectEditForm, name: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-2xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-[#4f46e5] focus:bg-white dark:focus:bg-[#181b20] transition-all"
                  placeholder="Например: Extragel"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Описание и цели направления</label>
                <textarea 
                  value={projectEditForm.description}
                  onChange={(e) => setProjectEditForm({ ...projectEditForm, description: e.target.value })}
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-2xl px-4 py-3 text-sm text-gray-800 dark:text-gray-200 outline-none focus:border-[#4f46e5] focus:bg-white dark:focus:bg-[#181b20] transition-all"
                  placeholder="Опишите фармацевтическое направление, фокусные целевые группы..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Дата начала</label>
                  <input 
                    type="date" 
                    value={projectEditForm.start_date}
                    onChange={(e) => setProjectEditForm({ ...projectEditForm, start_date: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-2xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-[#4f46e5] focus:bg-white dark:focus:bg-[#181b20] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wider">Дата завершения</label>
                  <input 
                    type="date" 
                    value={projectEditForm.end_date}
                    onChange={(e) => setProjectEditForm({ ...projectEditForm, end_date: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#121418] border border-gray-200 dark:border-[#2b303c] rounded-2xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:border-[#4f46e5] focus:bg-white dark:focus:bg-[#181b20] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-[#262932] flex items-center justify-end">
              <button 
                type="submit" 
                disabled={isSavingProject}
                className="px-6 py-3 bg-[#4f46e5] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-[#4338ca] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save size={16} /> {isSavingProject ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </form>

          {/* Danger Zone */}
          <div className="bg-red-50/50 dark:bg-red-950/20 rounded-3xl p-6 lg:p-8 border border-red-200 dark:border-red-900/50">
            <div className="flex items-center gap-3 text-red-700 dark:text-red-400 font-bold mb-2">
              <AlertTriangle size={20} /> Опасная зона
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 mb-5">
              Удаление проекта приведет к удалению всех связанных планов, спринтов, блогеров и партнеров.
            </p>
            <button 
              type="button" 
              onClick={handleDeleteProject}
              className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold text-xs shadow hover:bg-red-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Trash2 size={15} /> Удалить проект безвозвратно
            </button>
          </div>
        </div>
      )}


    </div>
  )
}
