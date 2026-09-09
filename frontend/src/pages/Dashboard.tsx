import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Target, CheckCircle2, FolderKanban, TrendingUp, Calendar, ArrowRight, 
  Users, Eye, DollarSign, ExternalLink, Building2, MapPin, Package, Store, Layers
} from 'lucide-react'

// Influencer & Project Performance Data By Period
interface PeriodData {
  stats: Array<{
    title: string
    value: string
    change: string
    positive: boolean
    subtext: string
    icon: any
    iconColor: string
  }>
  projectProgress: Array<{
    name: string
    plan: number
    fact: number
    percent: number
    unit: string
  }>
  bloggerMetrics: {
    planReach: string
    factReach: string
    reachPercent: number
    planBudget: string
    factBudget: string
    budgetPercent: number
    publishedCount: number
    totalCount: number
    cpm: string
  }
  platforms: Array<{
    name: string
    reach: string
    share: number
    color: string
    bgColor: string
    textColor: string
  }>
  bloggers: Array<{
    id: string
    project: string
    projectColor: string
    name: string
    handle: string
    platform: string
    avatarChar: string
    avatarColor: string
    reach: string
    price: string
    format: string
    status: 'Вышел пост' | 'Оплачено' | 'Согласовано' | 'Переговоры'
    postUrl?: string
    date: string
  }>
  companyMetrics: {
    totalSpent: string
    planBudget: string
    budgetPercent: number
    locationsCount: number
    planLocations: number
    locationsPercent: number
    itemsDistributedCount: number
    activePartnerships: number
  }
  companyCategories: Array<{
    name: string
    count: number
    spent: string
    share: number
    color: string
    bgColor: string
    textColor: string
  }>
  companies: Array<{
    id: string
    project: string
    projectColor: string
    name: string
    category: string
    categoryBadge: string
    location: string
    spent: string
    itemsSummary: string
    status: 'Материалы переданы' | 'Активно' | 'Согласовано' | 'Переговоры' | 'На паузе'
    contactPerson: string
    date: string
  }>
}

const periodsData: Record<string, PeriodData> = {
  'Сентябрь 2026': {
    stats: [
      { title: 'Задач в спринтах', value: '48', change: '+12%', positive: true, subtext: 'По сравнению с прошлым месяцем', icon: Target, iconColor: 'bg-emerald-50 text-emerald-600' },
      { title: 'Выполнение плана', value: '78%', change: '+9%', positive: true, subtext: 'Средний Fact / Plan по проектам', icon: TrendingUp, iconColor: 'bg-indigo-50 text-[#4f46e5]' },
      { title: 'Активные проекты', value: '3', change: '100%', positive: true, subtext: 'Extragel, Masculan, Энтеросгель', icon: FolderKanban, iconColor: 'bg-blue-50 text-blue-600' },
      { title: 'Охват блогеров', value: '380K', change: '+28%', positive: true, subtext: '84% от плана месяца (450K)', icon: Eye, iconColor: 'bg-purple-50 text-purple-600' },
    ],
    projectProgress: [
      { name: 'Extragel', plan: 50, fact: 33, percent: 66, unit: 'визитов/задач' },
      { name: 'Masculan', plan: 50, fact: 20, percent: 40, unit: 'визитов/задач' },
      { name: 'Энтеросгель', plan: 60, fact: 48, percent: 80, unit: 'визитов/задач' },
    ],
    bloggerMetrics: {
      planReach: '450K',
      factReach: '380K',
      reachPercent: 84,
      planBudget: '$1,500',
      factBudget: '$1,330',
      budgetPercent: 88,
      publishedCount: 2,
      totalCount: 4,
      cpm: '$3.50',
    },
    platforms: [
      { name: 'Instagram', reach: '275K', share: 72, color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
      { name: 'TikTok', reach: '60K', share: 16, color: 'bg-neutral-800', bgColor: 'bg-neutral-100', textColor: 'text-neutral-800' },
      { name: 'Telegram', reach: '45K', share: 12, color: 'bg-sky-500', bgColor: 'bg-sky-50', textColor: 'text-sky-700' },
    ],
    bloggers: [
      {
        id: 'b1',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Шахзода Мухаммедова',
        handle: '@shakhzoda__mukhammedova',
        platform: 'Instagram',
        avatarChar: 'Ш',
        avatarColor: 'bg-pink-500',
        reach: '180K',
        price: '$650',
        format: 'Reels + 2 Stories',
        status: 'Вышел пост',
        postUrl: 'https://instagram.com/p/example1',
        date: '05.09.2026'
      },
      {
        id: 'b2',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Доктор Алимов (Health & Life)',
        handle: '@dr_alimov_health',
        platform: 'Telegram',
        avatarChar: 'Д',
        avatarColor: 'bg-sky-500',
        reach: '45K',
        price: '$200',
        format: 'Экспертный пост с опросом',
        status: 'Оплачено',
        date: '12.09.2026'
      },
      {
        id: 'b3',
        project: 'Masculan',
        projectColor: 'bg-blue-50 text-blue-700 border-blue-200',
        name: 'Мадина Мамасидикова',
        handle: '@madina_lifestyle',
        platform: 'Instagram',
        avatarChar: 'М',
        avatarColor: 'bg-purple-500',
        reach: '95K',
        price: '$300',
        format: 'Stories распаковка аптечки',
        status: 'Согласовано',
        date: '18.09.2026'
      },
      {
        id: 'b4',
        project: 'Энтеросгель',
        projectColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        name: 'Фитнес Ташкент (Артём)',
        handle: '@tashkent_fit_artem',
        platform: 'TikTok',
        avatarChar: 'Ф',
        avatarColor: 'bg-neutral-800',
        reach: '60K',
        price: '$180',
        format: 'Динамичный ролик тренировки',
        status: 'Переговоры',
        date: '24.09.2026'
      }
    ],
    companyMetrics: {
      totalSpent: '$2,950',
      planBudget: '$3,500',
      budgetPercent: 84,
      locationsCount: 14,
      planLocations: 18,
      locationsPercent: 78,
      itemsDistributedCount: 1850,
      activePartnerships: 11,
    },
    companyCategories: [
      { name: 'Гостиницы & Отели', count: 5, spent: '$1,250', share: 42, color: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
      { name: 'Фитнес & СПА', count: 4, spent: '$850', share: 29, color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
      { name: 'Бары & Рестораны', count: 3, spent: '$550', share: 19, color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
      { name: 'Клиники & Медцентры', count: 2, spent: '$300', share: 10, color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    ],
    companies: [
      {
        id: 'c1',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Hilton Tashkent City',
        category: 'Гостиница / Отель',
        categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        location: 'г. Ташкент, ул. Ислама Каримова, 2',
        spent: '$850',
        itemsSummary: 'Диспенсеры в SPA (6 шт.), 400 саше Extragel, полотенца (50 шт.), тейбл-тенты на ресепшн',
        status: 'Материалы переданы',
        contactPerson: 'Улугбек (Wellness Manager)',
        date: '03.09.2026'
      },
      {
        id: 'c2',
        project: 'Masculan',
        projectColor: 'bg-blue-50 text-blue-700 border-blue-200',
        name: 'Steam Bar & Lounge',
        category: 'Бар / Ресторан',
        categoryBadge: 'bg-purple-50 text-purple-700 border-purple-200',
        location: 'г. Ташкент, ул. Нукус, 21',
        spent: '$400',
        itemsSummary: 'Брендированные салфетницы Masculan (30 шт.), светящиеся костеры (100 шт.), наборы образцов',
        status: 'Активно',
        contactPerson: 'Рустам (Арт-директор)',
        date: '10.09.2026'
      },
      {
        id: 'c3',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'B-Fit Wellness Complex',
        category: 'Фитнес-клуб',
        categoryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        location: 'г. Ташкент, ул. Кичик Бешагач, 104',
        spent: '$600',
        itemsSummary: 'Фирменный стенд Extragel с гелем у зоны кроссфита, 250 пробников, плакаты А1 (4 шт.)',
        status: 'Согласовано',
        contactPerson: 'Сардор (Главный тренер)',
        date: '14.09.2026'
      },
      {
        id: 'c4',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Hyatt Regency Tashkent',
        category: 'Гостиница / Отель',
        categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        location: 'г. Ташкент, ул. Навои, 1',
        spent: '$1,100',
        itemsSummary: 'Диспенсеры в номерах Люкс (12 шт.), 600 саше-пробников, промо-стойка в фитнес-зоне',
        status: 'Активно',
        contactPerson: 'Дильноза (PR-отдел)',
        date: '18.09.2026'
      }
    ]
  },
  'Август 2026': {
    stats: [
      { title: 'Задач в спринтах', value: '44', change: '+8%', positive: true, subtext: 'По сравнению с июлем', icon: Target, iconColor: 'bg-emerald-50 text-emerald-600' },
      { title: 'Выполнение плана', value: '92%', change: '+14%', positive: true, subtext: 'Высокая конверсия по аптекам', icon: TrendingUp, iconColor: 'bg-indigo-50 text-[#4f46e5]' },
      { title: 'Активные проекты', value: '3', change: '100%', positive: true, subtext: 'Extragel, Masculan, Энтеросгель', icon: FolderKanban, iconColor: 'bg-blue-50 text-blue-600' },
      { title: 'Охват блогеров', value: '440K', change: '+35%', positive: true, subtext: '110% от плана (400K)', icon: Eye, iconColor: 'bg-purple-50 text-purple-600' },
    ],
    projectProgress: [
      { name: 'Extragel', plan: 50, fact: 48, percent: 96, unit: 'визитов/задач' },
      { name: 'Masculan', plan: 50, fact: 44, percent: 88, unit: 'визитов/задач' },
      { name: 'Энтеросгель', plan: 60, fact: 56, percent: 93, unit: 'визитов/задач' },
    ],
    bloggerMetrics: {
      planReach: '400K',
      factReach: '440K',
      reachPercent: 110,
      planBudget: '$1,600',
      factBudget: '$1,650',
      budgetPercent: 103,
      publishedCount: 3,
      totalCount: 3,
      cpm: '$3.75',
    },
    platforms: [
      { name: 'Instagram', reach: '250K', share: 57, color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
      { name: 'YouTube', reach: '110K', share: 25, color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' },
      { name: 'Telegram', reach: '80K', share: 18, color: 'bg-sky-500', bgColor: 'bg-sky-50', textColor: 'text-sky-700' },
    ],
    bloggers: [
      {
        id: 'ba1',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Севара Назархан',
        handle: '@sevara_nazarkhan_official',
        platform: 'Instagram',
        avatarChar: 'С',
        avatarColor: 'bg-pink-500',
        reach: '250K',
        price: '$800',
        format: 'Reels + 3 Stories',
        status: 'Вышел пост',
        postUrl: 'https://instagram.com/p/example_aug1',
        date: '10.08.2026'
      },
      {
        id: 'ba2',
        project: 'Энтеросгель',
        projectColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        name: 'Health Club UZ (Доктор Рахимов)',
        handle: '@health_club_uz',
        platform: 'Telegram',
        avatarChar: 'H',
        avatarColor: 'bg-sky-500',
        reach: '80K',
        price: '$350',
        format: 'Статья + Закрепленный пост',
        status: 'Вышел пост',
        postUrl: 'https://t.me/example_aug2',
        date: '16.08.2026'
      },
      {
        id: 'ba3',
        project: 'Masculan',
        projectColor: 'bg-blue-50 text-blue-700 border-blue-200',
        name: 'Азиз Мухамедов',
        handle: '@aziz_mens_talk',
        platform: 'YouTube',
        avatarChar: 'А',
        avatarColor: 'bg-red-500',
        reach: '110K',
        price: '$500',
        format: 'Интеграция 90 сек в подкаст',
        status: 'Вышел пост',
        postUrl: 'https://youtube.com/watch?v=example_aug3',
        date: '25.08.2026'
      }
    ],
    companyMetrics: {
      totalSpent: '$2,700',
      planBudget: '$3,000',
      budgetPercent: 90,
      locationsCount: 12,
      planLocations: 15,
      locationsPercent: 80,
      itemsDistributedCount: 1600,
      activePartnerships: 10,
    },
    companyCategories: [
      { name: 'Гостиницы & Отели', count: 4, spent: '$1,100', share: 41, color: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
      { name: 'Фитнес & СПА', count: 4, spent: '$800', share: 30, color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
      { name: 'Бары & Рестораны', count: 3, spent: '$500', share: 19, color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
      { name: 'Клиники & Медцентры', count: 1, spent: '$300', share: 10, color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    ],
    companies: [
      {
        id: 'ca1',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Hilton Tashkent City',
        category: 'Гостиница / Отель',
        categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        location: 'г. Ташкент, ул. Ислама Каримова, 2',
        spent: '$850',
        itemsSummary: 'Диспенсеры в SPA (6 шт.), 400 саше Extragel, брендированные полотенца',
        status: 'Материалы переданы',
        contactPerson: 'Улугбек (Wellness Manager)',
        date: '08.08.2026'
      },
      {
        id: 'ca2',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Chekhov Sport Club',
        category: 'Фитнес-клуб',
        categoryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        location: 'г. Ташкент, ул. Чехова, 28',
        spent: '$500',
        itemsSummary: 'Стенд в зоне тяжелой атлетики, 300 саше, баннер у раздевалок',
        status: 'Активно',
        contactPerson: 'Алишер (Инструктор)',
        date: '15.08.2026'
      },
      {
        id: 'ca3',
        project: 'Masculan',
        projectColor: 'bg-blue-50 text-blue-700 border-blue-200',
        name: 'Steam Bar & Lounge',
        category: 'Бар / Ресторан',
        categoryBadge: 'bg-purple-50 text-purple-700 border-purple-200',
        location: 'г. Ташкент, ул. Нукус, 21',
        spent: '$400',
        itemsSummary: 'Брендированные салфетницы Masculan (30 шт.), светящиеся костеры (100 шт.)',
        status: 'Активно',
        contactPerson: 'Рустам (Арт-директор)',
        date: '20.08.2026'
      }
    ]
  },
  'Июль 2026': {
    stats: [
      { title: 'Задач в спринтах', value: '40', change: '+5%', positive: true, subtext: 'Старт третьего квартала', icon: Target, iconColor: 'bg-emerald-50 text-emerald-600' },
      { title: 'Выполнение плана', value: '85%', change: '+7%', positive: true, subtext: 'Выполнение планов по аптекам', icon: TrendingUp, iconColor: 'bg-indigo-50 text-[#4f46e5]' },
      { title: 'Активные проекты', value: '3', change: '100%', positive: true, subtext: 'Extragel, Masculan, Энтеросгель', icon: FolderKanban, iconColor: 'bg-blue-50 text-blue-600' },
      { title: 'Охват блогеров', value: '375K', change: '+20%', positive: true, subtext: '107% от плана (350K)', icon: Eye, iconColor: 'bg-purple-50 text-purple-600' },
    ],
    projectProgress: [
      { name: 'Extragel', plan: 50, fact: 42, percent: 84, unit: 'визитов/задач' },
      { name: 'Masculan', plan: 50, fact: 40, percent: 80, unit: 'визитов/задач' },
      { name: 'Энтеросгель', plan: 60, fact: 54, percent: 90, unit: 'визитов/задач' },
    ],
    bloggerMetrics: {
      planReach: '350K',
      factReach: '375K',
      reachPercent: 107,
      planBudget: '$1,200',
      factBudget: '$1,150',
      budgetPercent: 96,
      publishedCount: 2,
      totalCount: 2,
      cpm: '$3.06',
    },
    platforms: [
      { name: 'Instagram', reach: '310K', share: 83, color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
      { name: 'Telegram', reach: '65K', share: 17, color: 'bg-sky-500', bgColor: 'bg-sky-50', textColor: 'text-sky-700' },
    ],
    bloggers: [
      {
        id: 'bj1',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Зарина Низомиддинова',
        handle: '@zarina_nizomiddinova',
        platform: 'Instagram',
        avatarChar: 'З',
        avatarColor: 'bg-pink-500',
        reach: '310K',
        price: '$900',
        format: 'Reels + 2 Stories',
        status: 'Вышел пост',
        postUrl: 'https://instagram.com/p/example_jul1',
        date: '14.07.2026'
      },
      {
        id: 'bj2',
        project: 'Энтеросгель',
        projectColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        name: 'Доктор Фарход (Педиатрия)',
        handle: '@dr_farhod_pediatr',
        platform: 'Telegram',
        avatarChar: 'Ф',
        avatarColor: 'bg-sky-500',
        reach: '65K',
        price: '$250',
        format: 'Пост в канале + памятка',
        status: 'Вышел пост',
        postUrl: 'https://t.me/example_jul2',
        date: '22.07.2026'
      }
    ],
    companyMetrics: {
      totalSpent: '$2,200',
      planBudget: '$2,500',
      budgetPercent: 88,
      locationsCount: 10,
      planLocations: 12,
      locationsPercent: 83,
      itemsDistributedCount: 1300,
      activePartnerships: 9,
    },
    companyCategories: [
      { name: 'Гостиницы & Отели', count: 4, spent: '$950', share: 43, color: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
      { name: 'Фитнес & СПА', count: 3, spent: '$650', share: 30, color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
      { name: 'Бары & Рестораны', count: 2, spent: '$400', share: 18, color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
      { name: 'Клиники & Медцентры', count: 1, spent: '$200', share: 9, color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    ],
    companies: [
      {
        id: 'cj1',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Hyatt Regency Tashkent',
        category: 'Гостиница / Отель',
        categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        location: 'г. Ташкент, ул. Навои, 1',
        spent: '$950',
        itemsSummary: 'Диспенсеры в номерах Люкс (10 шт.), 450 саше Extragel',
        status: 'Активно',
        contactPerson: 'Дильноза (PR)',
        date: '10.07.2026'
      },
      {
        id: 'cj2',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'B-Fit Wellness Complex',
        category: 'Фитнес-клуб',
        categoryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        location: 'г. Ташкент, ул. Кичик Бешагач, 104',
        spent: '$650',
        itemsSummary: 'Брендированные стойки, 300 саше, баннеры в кардиозоне',
        status: 'Материалы переданы',
        contactPerson: 'Сардор (Главный тренер)',
        date: '18.07.2026'
      }
    ]
  },
  'Q3 2026': {
    stats: [
      { title: 'Задач в спринтах', value: '132', change: '+24%', positive: true, subtext: 'Суммарно за 3 месяца', icon: Target, iconColor: 'bg-emerald-50 text-emerald-600' },
      { title: 'Выполнение плана', value: '85%', change: '+12%', positive: true, subtext: 'Квартальный Fact / Plan', icon: TrendingUp, iconColor: 'bg-indigo-50 text-[#4f46e5]' },
      { title: 'Активные проекты', value: '3', change: '100%', positive: true, subtext: 'Extragel, Masculan, Энтеросгель', icon: FolderKanban, iconColor: 'bg-blue-50 text-blue-600' },
      { title: 'Охват блогеров', value: '1.19M', change: '+31%', positive: true, subtext: 'Суммарный охват кампаний', icon: Eye, iconColor: 'bg-purple-50 text-purple-600' },
    ],
    projectProgress: [
      { name: 'Extragel', plan: 150, fact: 123, percent: 82, unit: 'визитов/задач' },
      { name: 'Masculan', plan: 150, fact: 104, percent: 69, unit: 'визитов/задач' },
      { name: 'Энтеросгель', plan: 180, fact: 158, percent: 87, unit: 'визитов/задач' },
    ],
    bloggerMetrics: {
      planReach: '1.20M',
      factReach: '1.19M',
      reachPercent: 99,
      planBudget: '$4,300',
      factBudget: '$4,130',
      budgetPercent: 96,
      publishedCount: 7,
      totalCount: 9,
      cpm: '$3.47',
    },
    platforms: [
      { name: 'Instagram', reach: '835K', share: 70, color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700' },
      { name: 'Telegram', reach: '190K', share: 16, color: 'bg-sky-500', bgColor: 'bg-sky-50', textColor: 'text-sky-700' },
      { name: 'YouTube', reach: '110K', share: 9, color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700' },
      { name: 'TikTok', reach: '60K', share: 5, color: 'bg-neutral-800', bgColor: 'bg-neutral-100', textColor: 'text-neutral-800' },
    ],
    bloggers: [
      {
        id: 'b1',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Шахзода Мухаммедова',
        handle: '@shakhzoda__mukhammedova',
        platform: 'Instagram',
        avatarChar: 'Ш',
        avatarColor: 'bg-pink-500',
        reach: '180K',
        price: '$650',
        format: 'Reels + 2 Stories',
        status: 'Вышел пост',
        postUrl: 'https://instagram.com/p/example1',
        date: '05.09.2026'
      },
      {
        id: 'ba1',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Севара Назархан',
        handle: '@sevara_nazarkhan_official',
        platform: 'Instagram',
        avatarChar: 'С',
        avatarColor: 'bg-pink-500',
        reach: '250K',
        price: '$800',
        format: 'Reels + 3 Stories',
        status: 'Вышел пост',
        postUrl: 'https://instagram.com/p/example_aug1',
        date: '10.08.2026'
      },
      {
        id: 'bj1',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Зарина Низомиддинова',
        handle: '@zarina_nizomiddinova',
        platform: 'Instagram',
        avatarChar: 'З',
        avatarColor: 'bg-pink-500',
        reach: '310K',
        price: '$900',
        format: 'Reels + 2 Stories',
        status: 'Вышел пост',
        postUrl: 'https://instagram.com/p/example_jul1',
        date: '14.07.2026'
      },
      {
        id: 'ba3',
        project: 'Masculan',
        projectColor: 'bg-blue-50 text-blue-700 border-blue-200',
        name: 'Азиз Мухамедов',
        handle: '@aziz_mens_talk',
        platform: 'YouTube',
        avatarChar: 'А',
        avatarColor: 'bg-red-500',
        reach: '110K',
        price: '$500',
        format: 'Интеграция 90 сек в подкаст',
        status: 'Вышел пост',
        postUrl: 'https://youtube.com/watch?v=example_aug3',
        date: '25.08.2026'
      }
    ],
    companyMetrics: {
      totalSpent: '$7,850',
      planBudget: '$9,000',
      budgetPercent: 87,
      locationsCount: 22,
      planLocations: 25,
      locationsPercent: 88,
      itemsDistributedCount: 4750,
      activePartnerships: 18,
    },
    companyCategories: [
      { name: 'Гостиницы & Отели', count: 9, spent: '$3,300', share: 42, color: 'bg-amber-500', bgColor: 'bg-amber-50', textColor: 'text-amber-700' },
      { name: 'Фитнес & СПА', count: 7, spent: '$2,300', share: 29, color: 'bg-emerald-500', bgColor: 'bg-emerald-50', textColor: 'text-emerald-700' },
      { name: 'Бары & Рестораны', count: 4, spent: '$1,450', share: 19, color: 'bg-purple-500', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
      { name: 'Клиники & Медцентры', count: 2, spent: '$800', share: 10, color: 'bg-blue-500', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    ],
    companies: [
      {
        id: 'cq1',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Hilton Tashkent City',
        category: 'Гостиница / Отель',
        categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        location: 'г. Ташкент, ул. Ислама Каримова, 2',
        spent: '$1,700',
        itemsSummary: 'Диспенсеры в SPA (12 шт.), 800 саше Extragel, брендинг в фитнес-центре отеля',
        status: 'Активно',
        contactPerson: 'Улугбек (Wellness Manager)',
        date: '03.09.2026'
      },
      {
        id: 'cq2',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Hyatt Regency Tashkent',
        category: 'Гостиница / Отель',
        categoryBadge: 'bg-amber-50 text-amber-700 border-amber-200',
        location: 'г. Ташкент, ул. Навои, 1',
        spent: '$2,050',
        itemsSummary: 'Диспенсеры в номерах Люкс (22 шт.), 1050 саше, промо-стойки',
        status: 'Активно',
        contactPerson: 'Дильноза (PR-отдел)',
        date: '18.09.2026'
      },
      {
        id: 'cq3',
        project: 'Masculan',
        projectColor: 'bg-blue-50 text-blue-700 border-blue-200',
        name: 'Steam Bar & Lounge',
        category: 'Бар / Ресторан',
        categoryBadge: 'bg-purple-50 text-purple-700 border-purple-200',
        location: 'г. Ташкент, ул. Нукус, 21',
        spent: '$800',
        itemsSummary: 'Брендированные салфетницы Masculan (60 шт.), светящиеся костеры (200 шт.)',
        status: 'Активно',
        contactPerson: 'Рустам (Арт-директор)',
        date: '10.09.2026'
      },
      {
        id: 'cq4',
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'B-Fit Wellness Complex',
        category: 'Фитнес-клуб',
        categoryBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        location: 'г. Ташкент, ул. Кичик Бешагач, 104',
        spent: '$1,250',
        itemsSummary: 'Фирменные стенды Extragel, 550 пробников, плакаты формата А1',
        status: 'Активно',
        contactPerson: 'Сардор (Главный тренер)',
        date: '14.09.2026'
      }
    ]
  },
}

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Сентябрь 2026')
  const [bloggerProjectFilter, setBloggerProjectFilter] = useState<string>('ALL')
  const [companyProjectFilter, setCompanyProjectFilter] = useState<string>('ALL')
  const [companyCategoryFilter, setCompanyCategoryFilter] = useState<string>('ALL')

  const currentData = periodsData[selectedPeriod] || periodsData['Сентябрь 2026']

  const recentTasks = [
    { id: 1, name: 'Съемка рекламных роликов', project: 'Extragel', sprint: 'Спринт 1', status: 'Done', creator: 'Азамат' },
    { id: 2, name: 'Кастинг актеров на промо', project: 'Extragel', sprint: 'Спринт 1', status: 'Done', creator: 'Дилрабо' },
    { id: 3, name: 'Настройка кабинетов FB, Google', project: 'Extragel', sprint: 'Спринт 2', status: 'In Progress', creator: 'Азамат' },
    { id: 4, name: 'Аптечные визиты Ташкент', project: 'Masculan', sprint: 'Спринт 1', status: 'In Progress', creator: 'Джамшид' },
    { id: 5, name: 'Фармкружки по сетям 36.6', project: 'Энтеросгель', sprint: 'Спринт 2', status: 'Not Done', creator: 'Азамат' },
  ]

  const filteredBloggers = currentData.bloggers.filter(
    b => bloggerProjectFilter === 'ALL' || b.project === bloggerProjectFilter
  )

  // Dynamic companies: merge localStorage if user added new partner companies in ProjectView
  const companiesList = useMemo(() => {
    let list = currentData.companies || []
    try {
      const stored = localStorage.getItem('project_companies_1')
      if (stored && selectedPeriod === 'Сентябрь 2026') {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed.map((item: any) => ({
            id: item.id || String(Math.random()),
            project: item.project || 'Extragel',
            projectColor: item.project === 'Masculan' 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : item.project === 'Энтеросгель'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-indigo-50 text-indigo-700 border-indigo-200',
            name: item.name || 'Партнерская площадка',
            category: item.category || 'Площадка',
            categoryBadge: item.categoryBadge || 'bg-amber-50 text-amber-700 border-amber-200',
            location: item.location || 'г. Ташкент',
            spent: item.spent || '$500',
            itemsSummary: item.itemsProvided || 'Рекламные материалы и пробники',
            status: item.status || 'Активно',
            contactPerson: item.contactPerson || 'Представитель',
            date: item.date || '01.09.2026'
          }))
        }
      }
    } catch (e) {
      console.warn('Failed reading companies from localStorage', e)
    }
    return list
  }, [selectedPeriod, currentData])

  const filteredCompanies = companiesList.filter(c => {
    const matchProject = companyProjectFilter === 'ALL' || c.project === companyProjectFilter
    const matchCategory = companyCategoryFilter === 'ALL' || c.category.toLowerCase().includes(companyCategoryFilter.toLowerCase())
    return matchProject && matchCategory
  })

  return (
    <div className="max-w-[1400px] mx-auto font-sans pb-16">
      {/* Top Header: Title & Period Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">
            Сводка показателей, выполнение планов, спринты и результаты по блогерам
          </p>
        </div>

        {/* Period Switcher */}
        <div className="flex items-center gap-2 bg-white border border-gray-200/80 p-1.5 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-gray-500">
            <Calendar size={15} className="text-[#4f46e5]" />
            <span>Период:</span>
          </div>
          <div className="flex items-center gap-1">
            {['Сентябрь 2026', 'Август 2026', 'Июль 2026', 'Q3 2026'].map((period) => (
              <button
                key={period}
                type="button"
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-[#1a2332] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {currentData.stats.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${item.iconColor} flex items-center justify-center font-bold`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    {item.change}
                  </span>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{item.title}</p>
                <h3 className="text-3xl font-extrabold text-gray-900 tracking-tight">{item.value}</h3>
              </div>
              <div className="border-t border-gray-50 pt-4 mt-4 text-xs font-medium text-gray-400">
                {item.subtext}
              </div>
            </div>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION: BLOGGERS & INFLUENCER RESULTS FOR SELECTED PERIOD                */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        {/* Section Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#4f46e5] flex items-center justify-center font-bold">
              <Users size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Результаты по блогерам за {selectedPeriod}
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4f46e5]">
                  Инфлюенс-маркетинг
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Фактический охват, бюджет, статус интеграций и платформы за выбранный период
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter by project */}
            <span className="text-xs text-gray-400 font-medium">Проект:</span>
            <select
              value={bloggerProjectFilter}
              onChange={(e) => setBloggerProjectFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none cursor-pointer focus:bg-white focus:border-[#4f46e5]"
            >
              <option value="ALL">Все бренды</option>
              <option value="Extragel">Extragel</option>
              <option value="Masculan">Masculan</option>
              <option value="Энтеросгель">Энтеросгель</option>
            </select>

            <Link 
              to="/projects/1" 
              className="px-3 py-1.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ml-2"
            >
              К базе блогеров <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* 4 Period Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Охват блогеров (Fact / Plan)</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-gray-900">{currentData.bloggerMetrics.factReach}</span>
              <span className="text-xs text-gray-400">из {currentData.bloggerMetrics.planReach}</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all" 
                style={{ width: `${Math.min(currentData.bloggerMetrics.reachPercent, 100)}%` }} 
              />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">
              {currentData.bloggerMetrics.reachPercent}% выполнения плана
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Бюджет интеграций</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-gray-900">{currentData.bloggerMetrics.factBudget}</span>
              <span className="text-xs text-gray-400">из {currentData.bloggerMetrics.planBudget}</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#4f46e5] h-full rounded-full transition-all" 
                style={{ width: `${Math.min(currentData.bloggerMetrics.budgetPercent, 100)}%` }} 
              />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 mt-1 inline-block">
              {currentData.bloggerMetrics.budgetPercent}% освоено
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Публикации вышли</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-gray-900">
                {currentData.bloggerMetrics.publishedCount} / {currentData.bloggerMetrics.totalCount}
              </span>
              <span className="text-xs text-purple-600 font-bold">постов</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-purple-600 h-full rounded-full transition-all" 
                style={{ width: `${(currentData.bloggerMetrics.publishedCount / currentData.bloggerMetrics.totalCount) * 100}%` }} 
              />
            </div>
            <span className="text-[10px] font-bold text-purple-600 mt-1 inline-block">
              {Math.round((currentData.bloggerMetrics.publishedCount / currentData.bloggerMetrics.totalCount) * 100)}% выходов
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Эффективность (CPM)</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-gray-900">{currentData.bloggerMetrics.cpm}</span>
              <span className="text-xs text-emerald-600 font-bold">за 1000 охвата</span>
            </div>
            <div className="w-full bg-emerald-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full w-full" />
            </div>
            <span className="text-[10px] font-bold text-gray-500 mt-1 inline-block">
              В рамках фарм-бенчмарка ($4.20)
            </span>
          </div>
        </div>

        {/* Subgrid: Bloggers List for Period + Platform Shares */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Bloggers Table (2 cols) */}
          <div className="lg:col-span-2 border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-100 flex justify-between items-center text-xs font-bold text-gray-500">
              <span>Интеграции периода ({filteredBloggers.length})</span>
              <span>Охват & Статус</span>
            </div>
            
            <div className="divide-y divide-gray-100">
              {filteredBloggers.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  Нет блогеров по выбранному бренду в периоде {selectedPeriod}
                </div>
              ) : (
                filteredBloggers.map(blogger => (
                  <div key={blogger.id} className="p-3.5 hover:bg-gray-50/80 transition-colors flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className={`w-9 h-9 rounded-xl ${blogger.avatarColor} text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm`}>
                        {blogger.avatarChar}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-gray-900">{blogger.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${blogger.projectColor}`}>
                            {blogger.project}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                          <span>{blogger.handle}</span>
                          <span>•</span>
                          <span className="text-gray-500 font-sans">{blogger.platform}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-gray-800 font-mono">{blogger.reach}</span>
                        <p className="text-[10px] text-gray-400">{blogger.price}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 ${
                        blogger.status === 'Вышел пост'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : blogger.status === 'Оплачено'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : blogger.status === 'Согласовано'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {blogger.status === 'Вышел пост' && <CheckCircle2 size={12} className="text-emerald-600" />}
                        {blogger.status}
                      </span>

                      {blogger.postUrl && (
                        <a
                          href={blogger.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 flex items-center justify-center transition-colors"
                          title="Открыть вышедшую публикацию"
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Platform Reach Share (1 col) */}
          <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/40 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
                Охват по соцсетям ({selectedPeriod})
              </h4>
              <div className="space-y-4">
                {currentData.platforms.map(platform => (
                  <div key={platform.name}>
                    <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[11px] ${platform.bgColor} ${platform.textColor}`}>
                          {platform.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-mono">{platform.reach}</span>
                        <span className="text-gray-400 font-normal">({platform.share}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${platform.color}`} 
                        style={{ width: `${platform.share}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-gray-200/60 text-[11px] text-gray-500 flex justify-between items-center">
              <span>Лидирует: <strong className="text-gray-800">Instagram Reels</strong></span>
              <span className="text-indigo-600 font-bold">ER: ~4.8%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: PARTNER COMPANIES & B2B VENUES FOR SELECTED PERIOD               */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
        {/* Section Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Building2 size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Партнерские площадки & B2B-компании за {selectedPeriod}
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Отели • Бары • Фитнес • Клиники
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Учет локаций, бюджета интеграций, переданных диспенсеров, саше и рекламных материалов
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Filter by project */}
            <span className="text-xs text-gray-400 font-medium">Проект:</span>
            <select
              value={companyProjectFilter}
              onChange={(e) => setCompanyProjectFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none cursor-pointer focus:bg-white focus:border-[#4f46e5]"
            >
              <option value="ALL">Все бренды</option>
              <option value="Extragel">Extragel</option>
              <option value="Masculan">Masculan</option>
              <option value="Энтеросгель">Энтеросгель</option>
            </select>

            {/* Filter by category */}
            <span className="text-xs text-gray-400 font-medium ml-1">Тип:</span>
            <select
              value={companyCategoryFilter}
              onChange={(e) => setCompanyCategoryFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-700 outline-none cursor-pointer focus:bg-white focus:border-[#4f46e5]"
            >
              <option value="ALL">Все категории</option>
              <option value="Отель">Отели / HoReCa</option>
              <option value="Бар">Бары / Клубы</option>
              <option value="Фитнес">Фитнес-клубы</option>
              <option value="Клиника">Клиники / Медцентры</option>
            </select>

            <Link 
              to="/projects/1" 
              className="px-3 py-1.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ml-2"
            >
              К площадкам <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* 4 Period Metric Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Бюджет на площадки</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-gray-900">{currentData.companyMetrics.totalSpent}</span>
              <span className="text-xs text-gray-400">из {currentData.companyMetrics.planBudget}</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#4f46e5] h-full rounded-full transition-all" 
                style={{ width: `${Math.min(currentData.companyMetrics.budgetPercent, 100)}%` }} 
              />
            </div>
            <span className="text-[10px] font-bold text-indigo-600 mt-1 inline-block">
              {currentData.companyMetrics.budgetPercent}% освоено бюджета
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Охвачено локаций</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-gray-900">
                {currentData.companyMetrics.locationsCount}
              </span>
              <span className="text-xs text-gray-400">из {currentData.companyMetrics.planLocations} точек</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all" 
                style={{ width: `${Math.min(currentData.companyMetrics.locationsPercent, 100)}%` }} 
              />
            </div>
            <span className="text-[10px] font-bold text-amber-600 mt-1 inline-block">
              {currentData.companyMetrics.locationsPercent}% целевого покрытия
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Передано материалов</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-gray-900">
                {currentData.companyMetrics.itemsDistributedCount.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-600 font-bold">единиц</span>
            </div>
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all" 
                style={{ width: '92%' }} 
              />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 mt-1 inline-block">
              Саше, диспенсеры, промо-стойки
            </span>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Действующие партнерства</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-gray-900">
                {currentData.companyMetrics.activePartnerships}
              </span>
              <span className="text-xs text-purple-600 font-bold">из {currentData.companyMetrics.locationsCount}</span>
            </div>
            <div className="w-full bg-purple-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full w-full" />
            </div>
            <span className="text-[10px] font-bold text-purple-600 mt-1 inline-block">
              Все локации брендированы
            </span>
          </div>
        </div>

        {/* Subgrid: Companies Table (2 cols) + Category Breakdown (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Companies Table (2 cols) */}
          <div className="lg:col-span-2 border border-gray-100 rounded-2xl overflow-hidden">
            <div className="bg-gray-50/70 px-4 py-3 border-b border-gray-100 flex justify-between items-center text-xs font-bold text-gray-500">
              <span>Партнерские компании & Локации ({filteredCompanies.length})</span>
              <span>Бюджет & Статус</span>
            </div>

            <div className="divide-y divide-gray-100">
              {filteredCompanies.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-xs">
                  Нет компаний по выбранным фильтрам в периоде {selectedPeriod}
                </div>
              ) : (
                filteredCompanies.map(company => (
                  <div key={company.id} className="p-3.5 hover:bg-gray-50/80 transition-colors flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                        <Store size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-gray-900">{company.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${company.categoryBadge}`}>
                            {company.category}
                          </span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border ${company.projectColor}`}>
                            {company.project}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                          <MapPin size={11} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-[260px] sm:max-w-[340px] text-gray-500">{company.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-indigo-600 mt-1 font-medium">
                          <Package size={11} className="shrink-0" />
                          <span className="truncate max-w-[300px] sm:max-w-[380px]">{company.itemsSummary}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-extrabold text-gray-900 font-mono">{company.spent}</span>
                        <p className="text-[10px] text-gray-400">{company.contactPerson}</p>
                      </div>

                      <span className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center gap-1 ${
                        company.status === 'Материалы переданы'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : company.status === 'Активно'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : company.status === 'Согласовано'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : company.status === 'Переговоры'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {company.status === 'Активно' && <CheckCircle2 size={12} className="text-emerald-600" />}
                        {company.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Category Shares & Key Materials (1 col) */}
          <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50/40 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">
                Затраты по категориям ({selectedPeriod})
              </h4>
              <div className="space-y-4">
                {currentData.companyCategories.map(cat => (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center text-xs mb-1.5 font-bold">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] ${cat.bgColor} ${cat.textColor}`}>
                        {cat.name} ({cat.count})
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-900 font-mono">{cat.spent}</span>
                        <span className="text-gray-400 font-normal">({cat.share}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${cat.color}`} 
                        style={{ width: `${cat.share}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200/60">
              <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-gray-700 uppercase tracking-wider">
                <Layers size={13} className="text-[#4f46e5]" />
                <span>Распределено на точки:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400">Саше Extragel</p>
                  <p className="font-bold text-gray-900">1,250 шт.</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400">Диспенсеры</p>
                  <p className="font-bold text-gray-900">42 шт.</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400">Тейбл-тенты</p>
                  <p className="font-bold text-gray-900">150 шт.</p>
                </div>
                <div className="bg-white p-2 rounded-xl border border-gray-100">
                  <p className="text-[10px] text-gray-400">Стенды / Стойки</p>
                  <p className="font-bold text-gray-900">18 шт.</p>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-gray-500 flex justify-between items-center">
                <span>Лидер: <strong className="text-gray-800">Отели & СПА</strong></span>
                <span className="text-amber-600 font-bold">Высокий LTV</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Chart + Recent Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Chart Column (2 cols) */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Выполнение плана по проектам ({selectedPeriod})
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Сравнение плановых показателей и текущего факта</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-200 mr-2"></span> План</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-[#4f46e5] mr-2"></span> Факт</div>
              </div>
            </div>

            {/* Custom Bar Comparison */}
            <div className="space-y-6 pt-4">
              {currentData.projectProgress.map(project => (
                <div key={project.name}>
                  <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                    <span>{project.name}</span>
                    <span className="text-[#4f46e5]">
                      {project.percent}% ({project.fact} / {project.plan} {project.unit})
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex">
                    <div 
                      className="bg-[#4f46e5] h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${project.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 mt-8 flex justify-between items-center">
            <span className="text-xs font-medium text-gray-500">
              Статистика синхронизирована за {selectedPeriod}
            </span>
            <Link to="/projects" className="text-xs font-bold text-[#4f46e5] hover:text-[#4338ca] flex items-center">
              Перейти к проектам <ArrowRight size={14} className="ml-1" />
            </Link>
          </div>
        </div>

        {/* Recent Active Tasks (1 col) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Задачи в спринтах</h3>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                5 активных
              </span>
            </div>

            <div className="space-y-4">
              {recentTasks.map(task => (
                <div key={task.id} className="p-3.5 rounded-xl bg-gray-50 hover:bg-gray-100/80 transition-colors">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="text-xs font-bold text-[#4f46e5] bg-indigo-50 px-2 py-0.5 rounded">
                      {task.project}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.status === 'Done' ? 'bg-emerald-100 text-emerald-700' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-1">{task.name}</h4>
                  <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                    <span className="flex items-center"><Calendar size={12} className="mr-1" /> {task.sprint}</span>
                    <span>{task.creator}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 mt-6">
            <Link to="/projects" className="w-full block text-center py-2.5 bg-gray-50 hover:bg-gray-100 text-xs font-bold text-gray-700 rounded-xl transition-colors">
              Смотреть все задачи
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
