import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { 
  Target, FolderKanban, TrendingUp, ArrowRight, 
  Eye, ExternalLink
} from 'lucide-react'

export interface WeeklyPoint {
  period: string
  planVisits: number
  factVisits: number
  reachK: number
  planReachK: number
  budgetSpent: number
  budgetPlan: number
}

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
    doctorsVisits: number
    pharmacyVisits: number
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
    cpm: string
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
  weeklyTrend: WeeklyPoint[]
  sparklines: {
    plan: number[]
    reach: number[]
    venues: number[]
    tasks: number[]
  }
  materialsInventory: Array<{
    name: string
    allocated: number
    total: number
    unit: string
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
      { name: 'Extragel', plan: 50, fact: 33, percent: 66, unit: 'визитов/задач', doctorsVisits: 18, pharmacyVisits: 15 },
      { name: 'Masculan', plan: 50, fact: 20, percent: 40, unit: 'визитов/задач', doctorsVisits: 8, pharmacyVisits: 12 },
      { name: 'Энтеросгель', plan: 60, fact: 48, percent: 80, unit: 'визитов/задач', doctorsVisits: 28, pharmacyVisits: 20 },
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
      { name: 'Instagram', reach: '275K', share: 72, color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700', cpm: '$3.20' },
      { name: 'TikTok', reach: '60K', share: 16, color: 'bg-neutral-800', bgColor: 'bg-neutral-100', textColor: 'text-neutral-800', cpm: '$3.00' },
      { name: 'Telegram', reach: '45K', share: 12, color: 'bg-sky-500', bgColor: 'bg-sky-50', textColor: 'text-sky-700', cpm: '$4.40' },
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
        itemsSummary: 'Диспенсеры в SPA (6 шт.), 400 саше Extragel, полотенца, тейбл-тенты',
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
        itemsSummary: 'Брендированные салфетницы Masculan (30 шт.), светящиеся костеры',
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
        itemsSummary: 'Фирменный стенд Extragel, 250 пробников, плакаты А1 (4 шт.)',
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
        itemsSummary: 'Диспенсеры в номерах Люкс (12 шт.), 600 саше-пробников, стойка',
        status: 'Активно',
        contactPerson: 'Дильноза (PR-отдел)',
        date: '18.09.2026'
      }
    ],
    weeklyTrend: [
      { period: '1-я неделя', planVisits: 12, factVisits: 10, reachK: 85, planReachK: 90, budgetSpent: 320, budgetPlan: 350 },
      { period: '2-я неделя', planVisits: 14, factVisits: 13, reachK: 120, planReachK: 120, budgetSpent: 410, budgetPlan: 420 },
      { period: '3-я неделя', planVisits: 12, factVisits: 11, reachK: 95, planReachK: 110, budgetSpent: 330, budgetPlan: 360 },
      { period: '4-я неделя', planVisits: 12, factVisits: 14, reachK: 80, planReachK: 130, budgetSpent: 270, budgetPlan: 370 },
    ],
    sparklines: {
      plan: [62, 68, 74, 78],
      reach: [85, 205, 300, 380],
      venues: [8, 10, 12, 14],
      tasks: [12, 25, 36, 48],
    },
    materialsInventory: [
      { name: 'Саше Extragel (пробники)', allocated: 1250, total: 1500, unit: 'шт.' },
      { name: 'Диспенсеры брендированные', allocated: 42, total: 50, unit: 'шт.' },
      { name: 'Тейбл-тенты для ресепшн', allocated: 150, total: 200, unit: 'шт.' },
      { name: 'Промо-стойки и баннеры А1', allocated: 18, total: 20, unit: 'шт.' },
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
      { name: 'Extragel', plan: 50, fact: 48, percent: 96, unit: 'визитов/задач', doctorsVisits: 26, pharmacyVisits: 22 },
      { name: 'Masculan', plan: 50, fact: 44, percent: 88, unit: 'визитов/задач', doctorsVisits: 16, pharmacyVisits: 28 },
      { name: 'Энтеросгель', plan: 60, fact: 56, percent: 93, unit: 'визитов/задач', doctorsVisits: 32, pharmacyVisits: 24 },
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
      { name: 'Instagram', reach: '330K', share: 75, color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700', cpm: '$3.40' },
      { name: 'Telegram', reach: '80K', share: 18, color: 'bg-sky-500', bgColor: 'bg-sky-50', textColor: 'text-sky-700', cpm: '$4.20' },
      { name: 'TikTok', reach: '30K', share: 7, color: 'bg-neutral-800', bgColor: 'bg-neutral-100', textColor: 'text-neutral-800', cpm: '$3.10' },
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
        project: 'Extragel',
        projectColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        name: 'Фарход Алимов',
        handle: '@farhod_alimov_live',
        platform: 'Instagram',
        avatarChar: 'Ф',
        avatarColor: 'bg-pink-500',
        reach: '80K',
        price: '$350',
        format: 'Stories серия',
        status: 'Вышел пост',
        postUrl: 'https://instagram.com/p/example_aug2',
        date: '18.08.2026'
      },
      {
        id: 'ba3',
        project: 'Masculan',
        projectColor: 'bg-blue-50 text-blue-700 border-blue-200',
        name: 'Азиз Мухамедов',
        handle: '@aziz_mens_talk',
        platform: 'Telegram',
        avatarChar: 'А',
        avatarColor: 'bg-sky-500',
        reach: '110K',
        price: '$500',
        format: 'Интеграция в канал',
        status: 'Вышел пост',
        postUrl: 'https://t.me/example_aug3',
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
        itemsSummary: 'Брендированные салфетницы Masculan (30 шт.), светящиеся костеры',
        status: 'Активно',
        contactPerson: 'Рустам (Арт-директор)',
        date: '20.08.2026'
      }
    ],
    weeklyTrend: [
      { period: '1-я неделя', planVisits: 14, factVisits: 13, reachK: 110, planReachK: 100, budgetSpent: 420, budgetPlan: 450 },
      { period: '2-я неделя', planVisits: 14, factVisits: 15, reachK: 130, planReachK: 120, budgetSpent: 510, budgetPlan: 500 },
      { period: '3-я неделя', planVisits: 12, factVisits: 13, reachK: 100, planReachK: 110, budgetSpent: 380, budgetPlan: 400 },
      { period: '4-я неделя', planVisits: 12, factVisits: 13, reachK: 95, planReachK: 105, budgetSpent: 340, budgetPlan: 380 },
    ],
    sparklines: {
      plan: [70, 75, 80, 83],
      reach: [110, 240, 340, 435],
      venues: [10, 11, 12, 12],
      tasks: [14, 27, 39, 52],
    },
    materialsInventory: [
      { name: 'Саше Extragel (пробники)', allocated: 1100, total: 1400, unit: 'шт.' },
      { name: 'Диспенсеры брендированные', allocated: 38, total: 45, unit: 'шт.' },
      { name: 'Тейбл-тенты для ресепшн', allocated: 120, total: 160, unit: 'шт.' },
      { name: 'Промо-стойки и баннеры А1', allocated: 16, total: 18, unit: 'шт.' },
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
      { name: 'Extragel', plan: 50, fact: 42, percent: 84, unit: 'визитов/задач', doctorsVisits: 22, pharmacyVisits: 20 },
      { name: 'Masculan', plan: 50, fact: 40, percent: 80, unit: 'визитов/задач', doctorsVisits: 14, pharmacyVisits: 26 },
      { name: 'Энтеросгель', plan: 60, fact: 54, percent: 90, unit: 'визитов/задач', doctorsVisits: 30, pharmacyVisits: 24 },
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
      { name: 'Instagram', reach: '310K', share: 83, color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700', cpm: '$2.90' },
      { name: 'Telegram', reach: '65K', share: 17, color: 'bg-sky-500', bgColor: 'bg-sky-50', textColor: 'text-sky-700', cpm: '$3.85' },
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
    ],
    weeklyTrend: [
      { period: '1-я неделя', planVisits: 10, factVisits: 11, reachK: 90, planReachK: 85, budgetSpent: 300, budgetPlan: 300 },
      { period: '2-я неделя', planVisits: 10, factVisits: 10, reachK: 110, planReachK: 95, budgetSpent: 350, budgetPlan: 320 },
      { period: '3-я неделя', planVisits: 10, factVisits: 9, reachK: 85, planReachK: 85, budgetSpent: 250, budgetPlan: 280 },
      { period: '4-я неделя', planVisits: 10, factVisits: 10, reachK: 90, planReachK: 85, budgetSpent: 250, budgetPlan: 250 },
    ],
    sparklines: {
      plan: [72, 78, 82, 85],
      reach: [90, 200, 285, 375],
      venues: [7, 8, 9, 10],
      tasks: [10, 20, 30, 40],
    },
    materialsInventory: [
      { name: 'Саше Extragel (пробники)', allocated: 900, total: 1200, unit: 'шт.' },
      { name: 'Диспенсеры брендированные', allocated: 28, total: 35, unit: 'шт.' },
      { name: 'Тейбл-тенты для ресепшн', allocated: 100, total: 140, unit: 'шт.' },
      { name: 'Промо-стойки и баннеры А1', allocated: 12, total: 15, unit: 'шт.' },
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
      { name: 'Extragel', plan: 150, fact: 123, percent: 82, unit: 'визитов/задач', doctorsVisits: 66, pharmacyVisits: 57 },
      { name: 'Masculan', plan: 150, fact: 104, percent: 69, unit: 'визитов/задач', doctorsVisits: 38, pharmacyVisits: 66 },
      { name: 'Энтеросгель', plan: 180, fact: 158, percent: 87, unit: 'визитов/задач', doctorsVisits: 90, pharmacyVisits: 68 },
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
      { name: 'Instagram', reach: '835K', share: 70, color: 'bg-pink-500', bgColor: 'bg-pink-50', textColor: 'text-pink-700', cpm: '$3.25' },
      { name: 'Telegram', reach: '190K', share: 16, color: 'bg-sky-500', bgColor: 'bg-sky-50', textColor: 'text-sky-700', cpm: '$4.15' },
      { name: 'YouTube', reach: '110K', share: 9, color: 'bg-red-500', bgColor: 'bg-red-50', textColor: 'text-red-700', cpm: '$4.55' },
      { name: 'TikTok', reach: '60K', share: 5, color: 'bg-neutral-800', bgColor: 'bg-neutral-100', textColor: 'text-neutral-800', cpm: '$3.00' },
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
        itemsSummary: 'Диспенсеры в SPA (12 шт.), 800 саше Extragel, брендинг в фитнес-центре',
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
        itemsSummary: 'Брендированные салфетницы Masculan (60 шт.), светящиеся костеры',
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
    ],
    weeklyTrend: [
      { period: 'Июль 2026', planVisits: 40, factVisits: 40, reachK: 375, planReachK: 350, budgetSpent: 1150, budgetPlan: 1200 },
      { period: 'Август 2026', planVisits: 52, factVisits: 54, reachK: 435, planReachK: 435, budgetSpent: 1650, budgetPlan: 1730 },
      { period: 'Сентябрь 2026', planVisits: 50, factVisits: 48, reachK: 380, planReachK: 450, budgetSpent: 1330, budgetPlan: 1500 },
    ],
    sparklines: {
      plan: [85, 83, 78, 82],
      reach: [375, 810, 1190, 1190],
      venues: [10, 12, 14, 22],
      tasks: [40, 92, 132, 132],
    },
    materialsInventory: [
      { name: 'Саше Extragel (пробники)', allocated: 3250, total: 4100, unit: 'шт.' },
      { name: 'Диспенсеры брендированные', allocated: 108, total: 130, unit: 'шт.' },
      { name: 'Тейбл-тенты для ресепшн', allocated: 370, total: 500, unit: 'шт.' },
      { name: 'Промо-стойки и баннеры А1', allocated: 46, total: 53, unit: 'шт.' },
    ]
  },
}

// =========================================================================
// PERFORMANCE & ANALYTICS BREAKDOWN COMPONENTS (CLEAN CSS & TABULAR NUMS)
// =========================================================================

function WeeklyPerformanceSummary({
  data,
  mode,
  onModeChange
}: {
  data: WeeklyPoint[]
  mode: 'visits' | 'reach' | 'budget'
  onModeChange: (m: 'visits' | 'reach' | 'budget') => void
}) {
  return (
    <div className="space-y-4">
      {/* Header with Switcher Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Недельная динамика выполнения (План vs Факт)</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {mode === 'visits' && 'Контроль закрытия визитов и спринтовых задач по неделям'}
            {mode === 'reach' && 'Фактический охват публикаций блогеров в сравнении с планом'}
            {mode === 'budget' && 'Освоение маркетингового бюджета по неделям месяца'}
          </p>
        </div>

        <div className="bg-slate-100 p-0.5 rounded-lg flex items-center gap-1 border border-slate-200/70 text-xs">
          <button
            type="button"
            onClick={() => onModeChange('visits')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${
              mode === 'visits' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Визиты & Задачи
          </button>
          <button
            type="button"
            onClick={() => onModeChange('reach')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${
              mode === 'reach' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Охват (K)
          </button>
          <button
            type="button"
            onClick={() => onModeChange('budget')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer font-medium ${
              mode === 'budget' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Бюджет ($)
          </button>
        </div>
      </div>

      {/* Structured Weekly Rows with Clean Progress Bars */}
      <div className="space-y-2.5">
        {data.map((item, idx) => {
          let plan = 0
          let fact = 0
          let unit = ''
          if (mode === 'visits') {
            plan = item.planVisits
            fact = item.factVisits
            unit = ' визитов'
          } else if (mode === 'reach') {
            plan = item.planReachK
            fact = item.reachK
            unit = 'K охвата'
          } else {
            plan = item.budgetPlan
            fact = item.budgetSpent
            unit = ' $'
          }
          const percent = plan > 0 ? Math.round((fact / plan) * 100) : 0
          const delta = fact - plan
          const isSuccess = percent >= 100

          return (
            <div key={idx} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100/90 hover:bg-slate-50 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">{item.period}</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[11px] tabular-nums border ${
                    isSuccess 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                      : percent >= 70
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
                      : 'bg-amber-50 text-amber-700 border-amber-200/60'
                  }`}>
                    {percent}%
                  </span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 tabular-nums text-xs">
                  <span>
                    План: <strong className="text-slate-700">{plan.toLocaleString()}{unit}</strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>
                    Факт: <strong className={isSuccess ? 'text-emerald-700' : 'text-slate-900'}>{fact.toLocaleString()}{unit}</strong>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className={`text-[11px] font-semibold ${delta >= 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {delta >= 0 ? `+${delta}` : delta}
                  </span>
                </div>
              </div>

              {/* Clean Minimalist Progress Bar */}
              <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isSuccess 
                      ? 'bg-emerald-600' 
                      : percent >= 70 
                      ? 'bg-indigo-600' 
                      : 'bg-amber-500'
                  }`}
                  style={{ width: `${Math.min(percent, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-3 gap-3 pt-3 mt-1 border-t border-slate-100 text-center text-xs">
        <div className="p-2 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-medium block">Средний темп</span>
          <span className="font-bold text-slate-900 mt-0.5 block tabular-nums">12.5 визитов/нед.</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-medium block">Пик периода</span>
          <span className="font-bold text-indigo-600 mt-0.5 block tabular-nums">2-я неделя (120K)</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-50/70 border border-slate-100">
          <span className="text-[10px] text-slate-400 font-medium block">Освоение бюджета</span>
          <span className="font-bold text-emerald-600 mt-0.5 block tabular-nums">88% (в плане)</span>
        </div>
      </div>
    </div>
  )
}

function ChannelsBreakdown({
  platforms,
  totalReach
}: {
  platforms: Array<{ name: string; reach: string; share: number; color: string; cpm?: string }>
  totalReach: string
}) {
  const hexColors: Record<string, string> = {
    'bg-pink-500': '#ec4899',
    'bg-neutral-800': '#1e293b',
    'bg-sky-500': '#0ea5e9',
    'bg-red-500': '#ef4444',
    'bg-purple-500': '#8b5cf6',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Каналы инфлюенс-маркетинга</h3>
          <p className="text-xs text-slate-400 mt-0.5">Суммарный охват: <strong className="text-slate-800 font-bold tabular-nums">{totalReach}</strong></p>
        </div>
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
          {platforms.length} площадки
        </span>
      </div>

      {/* Segmented Proportion Bar */}
      <div>
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-slate-100 gap-0.5 mb-1.5">
          {platforms.map((p, idx) => (
            <div
              key={idx}
              style={{ width: `${p.share}%`, backgroundColor: hexColors[p.color] || '#4f46e5' }}
              title={`${p.name}: ${p.share}% (${p.reach})`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>0%</span>
          <span>Доли каналов в общем охвате</span>
          <span>100%</span>
        </div>
      </div>

      {/* Channel Cards */}
      <div className="space-y-2 pt-1">
        {platforms.map((p, idx) => {
          const hex = hexColors[p.color] || '#4f46e5'
          return (
            <div key={idx} className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: hex }} />
                <div>
                  <span className="font-bold text-slate-800 block leading-tight">{p.name}</span>
                  <span className="text-[11px] text-slate-400 font-medium">Доля {p.share}%</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-slate-900 tabular-nums block leading-tight">{p.reach}</span>
                {p.cpm && (
                  <span className="text-[10px] text-slate-500 font-medium">CPM {p.cpm}</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
        <span>Лидер: <strong className="text-slate-800">Instagram (72%)</strong></span>
        <span className="text-indigo-600 font-semibold tabular-nums">ER ~4.8%</span>
      </div>
    </div>
  )
}

function MaterialsInventoryMeter({
  materials
}: {
  materials: Array<{ name: string; allocated: number; total: number; unit: string }>;
}) {
  return (
    <div className="space-y-3">
      {materials.map((m, idx) => {
        const percent = Math.min(Math.round((m.allocated / m.total) * 100), 100)
        return (
          <div key={idx}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-slate-700">{m.name}</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-slate-900">{m.allocated.toLocaleString()}</span>
                <span className="text-slate-400">/ {m.total.toLocaleString()} {m.unit}</span>
                <span className="text-[11px] font-semibold text-slate-500">({percent}%)</span>
              </div>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-slate-800 transition-all"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SprintBurndownBar() {
  const done = 28
  const inProgress = 15
  const pending = 5
  const total = done + inProgress + pending
  const donePct = Math.round((done / total) * 100)
  const inProgPct = Math.round((inProgress / total) * 100)
  const pendingPct = 100 - donePct - inProgPct

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-semibold text-slate-700">Прогресс спринта</span>
        <span className="font-mono text-slate-900 font-bold">{done} из {total} задач закрыто ({donePct}%)</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-100 gap-0.5">
        <div className="bg-emerald-500 h-full rounded-l-full" style={{ width: `${donePct}%` }} title={`Готово: ${done}`} />
        <div className="bg-blue-500 h-full" style={{ width: `${inProgPct}%` }} title={`В работе: ${inProgress}`} />
        <div className="bg-slate-300 h-full rounded-r-full" style={{ width: `${pendingPct}%` }} title={`К выполнению: ${pending}`} />
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Готово ({done})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>В работе ({inProgress})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-300" />
          <span>Очередь ({pending})</span>
        </div>
      </div>
    </div>
  )
}

// =========================================================================
// MAIN DASHBOARD COMPONENT
// =========================================================================

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('Сентябрь 2026')
  const [chartMode, setChartMode] = useState<'visits' | 'reach' | 'budget'>('visits')
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

  // Merge live bloggers from localStorage if available
  const bloggersList = useMemo(() => {
    let list = currentData.bloggers || []
    try {
      const stored = localStorage.getItem('pms_bloggers_p1')
      if (stored && selectedPeriod === 'Сентябрь 2026') {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed.map((item: any) => ({
            id: item.id || String(Math.random()),
            project: item.project || 'Extragel',
            projectColor: 'bg-slate-100 text-slate-700',
            name: item.name || 'Блогер',
            handle: item.handle || '@blogger',
            platform: item.platform || 'Instagram',
            avatarChar: (item.name || 'Б')[0].toUpperCase(),
            avatarColor: 'bg-slate-700',
            reach: item.reach || '150K',
            price: item.price || item.cost || '$300',
            format: item.format || 'Интеграция',
            status: item.status || 'Согласовано',
            postUrl: item.postUrl || undefined,
            date: item.publishDate || item.date || '01.09.2026'
          }))
        }
      }
    } catch (e) {
      console.warn('Failed reading bloggers from localStorage', e)
    }
    return list
  }, [selectedPeriod, currentData])

  const filteredBloggers = bloggersList.filter(
    b => bloggerProjectFilter === 'ALL' || b.project === bloggerProjectFilter
  )

  // Dynamic companies: merge localStorage if user added new partner companies in ProjectView
  const companiesList = useMemo(() => {
    let list = currentData.companies || []
    try {
      const stored = localStorage.getItem('pms_companies_p1') || localStorage.getItem('project_companies_1')
      if (stored && selectedPeriod === 'Сентябрь 2026') {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          list = parsed.map((item: any) => ({
            id: item.id || String(Math.random()),
            project: item.project || 'Extragel',
            projectColor: 'bg-slate-100 text-slate-700',
            name: item.name || 'Партнерская площадка',
            category: item.category || 'Площадка',
            categoryBadge: 'bg-slate-100 text-slate-700',
            location: item.location || 'г. Ташкент',
            spent: item.spent || '$500',
            itemsSummary: item.itemsProvided || item.itemsSummary || 'Рекламные материалы и пробники',
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
    <div className="max-w-[1440px] mx-auto font-sans pb-16 space-y-6 text-slate-800">
      {/* 1. Header: Title & Minimalist Period Segmented Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Обзор системы
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
              Актуальные данные
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Дашборд</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Сводная аналитика выполнения планов, спринтов, блогеров и партнерских площадок
          </p>
        </div>

        {/* Minimalist Segmented Period Switcher */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 shadow-xs">
          {['Сентябрь 2026', 'Август 2026', 'Июль 2026', 'Q3 2026'].map((period) => (
            <button
              key={period}
              type="button"
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                selectedPeriod === period
                  ? 'bg-slate-900 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Top 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Plan Completion */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Выполнение плана
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                +9% к плану
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-3xl font-bold font-sans tabular-nums text-slate-900 tracking-tight">
                {currentData.stats[1]?.value || '78%'}
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">Средний факт / план по направлениям</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-slate-900 h-full rounded-full" style={{ width: '78%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Цель: 100%</span>
              <span className="font-semibold text-slate-800">3 активных проекта</span>
            </div>
          </div>
        </div>

        {/* Card 2: Blogger Reach */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Охват блогеров
              </span>
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {currentData.bloggerMetrics.reachPercent}% плана
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-3xl font-bold font-sans tabular-nums text-slate-900 tracking-tight">
                {currentData.bloggerMetrics.factReach}
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">из {currentData.bloggerMetrics.planReach} планового охвата</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-indigo-600 h-full rounded-full" 
                style={{ width: `${Math.min(currentData.bloggerMetrics.reachPercent, 100)}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{currentData.bloggerMetrics.publishedCount} из {currentData.bloggerMetrics.totalCount} постов</span>
              <span className="font-semibold text-indigo-600">CPM {currentData.bloggerMetrics.cpm}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Partner Venues */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Партнерские площадки
              </span>
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {currentData.companyMetrics.locationsPercent}% цели
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-3xl font-bold font-sans tabular-nums text-slate-900 tracking-tight">
                {currentData.companyMetrics.locationsCount}
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">из {currentData.companyMetrics.planLocations} целевых локаций</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div 
                className="bg-slate-800 h-full rounded-full" 
                style={{ width: `${Math.min(currentData.companyMetrics.locationsPercent, 100)}%` }} 
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>{currentData.companyMetrics.activePartnerships} активных</span>
              <span className="font-semibold text-slate-800">{currentData.companyMetrics.totalSpent} бюджет</span>
            </div>
          </div>
        </div>

        {/* Card 4: Sprints & Tasks */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Задачи спринтов
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                {currentData.stats[0]?.change || '+12%'}
              </span>
            </div>
            <div className="mt-2.5">
              <span className="text-3xl font-bold font-sans tabular-nums text-slate-900 tracking-tight">
                {currentData.stats[0]?.value || '48'}
              </span>
              <span className="text-xs text-slate-500 font-medium block mt-0.5">всего спринтовых задач</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '65%' }} />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>28 выполнено • 15 в работе</span>
              <span className="font-semibold text-emerald-600">5 в очереди</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2.5 RNP Overview Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Target size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Регулярный план-факт (РНП) — Июнь 2026</h3>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  Синхронизировано
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">30 ключевых показателей команды медпредов, визитов, рецептов и FMCG продаж</p>
            </div>
          </div>

          <Link
            to="/reports"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <span>Открыть полный отчет РНП</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium block">Полевые визиты (врачи & аптеки)</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900 tabular-nums">1,544</span>
              <span className="text-xs text-slate-400">/ 1,796</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 mt-0.5 block">86% выполнения</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium block">Рецепты Энтеросгель</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-indigo-600 tabular-nums">4,627</span>
              <span className="text-xs text-slate-400">/ 17,000</span>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600 mt-0.5 block">Прогноз: 11,568 (68%)</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium block">Выручка E-Commerce</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900 tabular-nums">286.1M</span>
              <span className="text-xs text-slate-400">сум</span>
            </div>
            <span className="text-[11px] font-semibold text-purple-600 mt-0.5 block">71% плана (401M)</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50/70 border border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium block">FMCG Мерчендайзинг</span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900 tabular-nums">783</span>
              <span className="text-xs text-slate-400">/ 858</span>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 mt-0.5 block">91% охвата (3 района)</span>
          </div>
        </div>
      </div>

      {/* 3. SECTION: Analytics & Breakdown (7 cols + 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Performance Summary (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <WeeklyPerformanceSummary
            data={currentData.weeklyTrend}
            mode={chartMode}
            onModeChange={setChartMode}
          />
        </div>

        {/* Social Channel Structure Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <ChannelsBreakdown
            platforms={currentData.platforms}
            totalReach={currentData.bloggerMetrics.factReach}
          />
        </div>
      </div>

      {/* 4. Projects Execution (7 cols) + Current Sprints Burndown & Tasks (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Projects Progress Matrix */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Матрица выполнения планов проектов</h3>
                <p className="text-xs text-slate-400 mt-0.5">Разбивка по врачебным визитам и аптечным мероприятиям ({selectedPeriod})</p>
              </div>
              <Link
                to="/projects"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                Все проекты <ArrowRight size={13} />
              </Link>
            </div>

            <div className="space-y-3.5 pt-1">
              {currentData.projectProgress.map((project, idx) => {
                const isHigh = project.percent >= 75
                const isMid = project.percent >= 50 && project.percent < 75
                return (
                  <div key={project.name} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/project/${idx + 1}`}
                          className="font-bold text-xs text-slate-900 hover:text-indigo-600 transition-colors"
                        >
                          {project.name}
                        </Link>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {project.fact} из {project.plan} {project.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-slate-900">{project.percent}%</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isHigh ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' :
                          isMid ? 'bg-slate-100 text-slate-700 border border-slate-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200/60'
                        }`}>
                          {isHigh ? 'В графике' : isMid ? 'В процессе' : 'Внимание'}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden mb-2">
                      <div 
                        className={`h-full rounded-full transition-all ${
                          isHigh ? 'bg-emerald-600' : isMid ? 'bg-slate-800' : 'bg-amber-500'
                        }`}
                        style={{ width: `${project.percent}%` }}
                      />
                    </div>
                    {/* Micro breakdown: Doctors vs Pharmacies */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Врачи: <strong className="text-slate-800 font-mono">{project.doctorsVisits}</strong> визитов</span>
                      <span>Аптечные кружки: <strong className="text-slate-800 font-mono">{project.pharmacyVisits}</strong> точек</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Общая цель: 160 визитов/задач</span>
            <span className="font-medium text-slate-600">Синхронизировано со спринтами</span>
          </div>
        </div>

        {/* Right: Sprint Burndown & Tasks */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Задачи и активность спринта</h3>
                <p className="text-xs text-slate-400 mt-0.5">Текущая очередь операционных поручений</p>
              </div>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                5 в очереди
              </span>
            </div>

            {/* Burndown Bar */}
            <div className="p-3 mb-3 bg-slate-50/80 rounded-xl border border-slate-100">
              <SprintBurndownBar />
            </div>

            {/* Task list */}
            <div className="space-y-2">
              {recentTasks.map(task => (
                <div key={task.id} className="p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 truncate">{task.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span className="font-medium text-slate-600">{task.project}</span>
                      <span>•</span>
                      <span>{task.sprint}</span>
                      <span>•</span>
                      <span>{task.creator}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                    task.status === 'Done' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                    task.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {task.status === 'Done' ? 'Готово' : task.status === 'In Progress' ? 'В работе' : 'Ожидание'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 text-right">
            <Link 
              to="/projects/1"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              Открыть доску спринта <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Marketing Channels (6 cols) + Partner Venues & Materials Inventory (6 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card A: Influencers */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Инфлюенс-кампании</h3>
                <p className="text-xs text-slate-400 mt-0.5">Охват, бюджет и статус публикаций ({selectedPeriod})</p>
              </div>

              <select
                value={bloggerProjectFilter}
                onChange={(e) => setBloggerProjectFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-slate-400"
              >
                <option value="ALL">Все бренды</option>
                <option value="Extragel">Extragel</option>
                <option value="Masculan">Masculan</option>
                <option value="Энтеросгель">Энтеросгель</option>
              </select>
            </div>

            {/* Quick Strip */}
            <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg bg-slate-50 border border-slate-100 text-center">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Охват факт / план</span>
                <span className="text-xs font-bold font-mono text-slate-900">
                  {currentData.bloggerMetrics.factReach} / {currentData.bloggerMetrics.planReach}
                </span>
              </div>
              <div className="border-x border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Бюджет факт / план</span>
                <span className="text-xs font-bold font-mono text-slate-900">
                  {currentData.bloggerMetrics.factBudget} / {currentData.bloggerMetrics.planBudget}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Вышло постов</span>
                <span className="text-xs font-bold font-mono text-slate-900">
                  {currentData.bloggerMetrics.publishedCount} из {currentData.bloggerMetrics.totalCount}
                </span>
              </div>
            </div>

            {/* Bloggers Table */}
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex justify-between text-[11px] font-semibold text-slate-500">
                <span>Блогер & Формат</span>
                <span>Охват / Статус</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-[220px] overflow-y-auto">
                {filteredBloggers.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">Нет блогеров по выбранному фильтру</div>
                ) : (
                  filteredBloggers.map(b => (
                    <div key={b.id} className="p-2.5 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 truncate">{b.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({b.platform})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{b.format}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right font-mono">
                          <span className="font-bold text-slate-800">{b.reach}</span>
                          <span className="text-[10px] text-slate-400 block">{b.price}</span>
                        </div>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          b.status === 'Вышел пост' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          b.status === 'Оплачено' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {b.status}
                        </span>

                        {b.postUrl && (
                          <a
                            href={b.postUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                            title="Открыть пост"
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
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 text-right">
            <Link 
              to="/projects/1"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              Перейти к базе блогеров ({filteredBloggers.length}) <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Card B: Partner Venues & Materials Inventory */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">B2B Площадки & Инвентарь материалов</h3>
                <p className="text-xs text-slate-400 mt-0.5">Отели, клубы, бары, переданные материалы ({selectedPeriod})</p>
              </div>

              <div className="flex items-center gap-1.5">
                <select
                  value={companyProjectFilter}
                  onChange={(e) => setCompanyProjectFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-slate-400"
                >
                  <option value="ALL">Все бренды</option>
                  <option value="Extragel">Extragel</option>
                  <option value="Masculan">Masculan</option>
                  <option value="Энтеросгель">Энтеросгель</option>
                </select>
                <select
                  value={companyCategoryFilter}
                  onChange={(e) => setCompanyCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 outline-none cursor-pointer focus:bg-white focus:border-slate-400"
                >
                  <option value="ALL">Все категории</option>
                  <option value="Отель">Отели</option>
                  <option value="Фитнес">Фитнес</option>
                  <option value="Бар">Бары</option>
                  <option value="Клиника">Клиники</option>
                </select>
              </div>
            </div>

            {/* Materials Inventory Meter */}
            <div className="p-3.5 mb-4 rounded-xl bg-slate-50/80 border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                  Распределение рекламных материалов:
                </span>
                <span className="text-[11px] font-mono text-emerald-600 font-bold">1,850 ед. выдано</span>
              </div>
              <MaterialsInventoryMeter materials={currentData.materialsInventory} />
            </div>

            {/* Companies Table */}
            <div className="border border-slate-100 rounded-lg overflow-hidden">
              <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex justify-between text-[11px] font-semibold text-slate-500">
                <span>Площадка & Материалы</span>
                <span>Бюджет / Статус</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-[170px] overflow-y-auto">
                {filteredCompanies.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">Нет компаний по выбранному фильтру</div>
                ) : (
                  filteredCompanies.map(c => (
                    <div key={c.id} className="p-2.5 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 truncate">{c.name}</span>
                          <span className="text-[10px] text-slate-400">({c.category.split('/')[0].trim()})</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5" title={c.itemsSummary}>
                          {c.itemsSummary}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right font-mono">
                          <span className="font-bold text-slate-800">{c.spent}</span>
                          <span className="text-[10px] text-slate-400 block truncate max-w-[80px]">{c.contactPerson}</span>
                        </div>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          c.status === 'Активно' || c.status === 'Материалы переданы'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-slate-100 text-right">
            <Link 
              to="/projects/1"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              Перейти к базе площадок ({filteredCompanies.length}) <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Clean RNP Report Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-950/60 px-2 py-0.5 rounded">
              Детализированная отчетность
            </span>
          </div>
          <h3 className="text-base font-bold text-white">
            РНП Маркетинг & Медпреды (Июнь 2026)
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Оперативные данные по врачам, аптекам, назначениям препаратов (Энтеросгель, Фитосепт, Сафекс), мерчендайзингу FMCG и каналам E-Commerce (Uzum, Лавка, Корзинка GO).
          </p>
        </div>

        <Link
          to="/reports"
          className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs rounded-lg transition-colors flex items-center gap-2 shrink-0"
        >
          Открыть полный отчет РНП <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  )
}
