import React, { useState, useRef, useMemo, useEffect } from 'react'
import { 
  BarChart3, TrendingUp, Target, CheckCircle2, 
  Download, Upload, Filter, Calendar, 
  Layers, Sparkles, Activity, 
  Award, Search, Stethoscope, ShoppingBag, Briefcase, Loader2,
  DollarSign, Users, Eye, X, ExternalLink,
  Table, Kanban, AlertTriangle, Printer, Send,
  Share2, Smartphone, Globe
} from 'lucide-react'
import { initialRnpData, RnpItem } from '../data/rnpData'
import { api } from '../lib/api'

// Operational Sprints & Task Plan / Fact Dataset
export interface SprintTask {
  id: string
  name: string
  plan: number
  fact: number
  unit: string
  percent: number
  assignee: string
}

export interface ProjectSprint {
  sprintId: number
  name: string
  dates: string
  isCurrent?: boolean
  plan: number
  fact: number
  unit: string
  percent: number
  tasks: SprintTask[]
}

export interface ProjectOperationalPlan {
  id: number
  project: string
  category: string
  manager: string
  month: string
  overallPlan: number
  overallFact: number
  overallProgress: number
  unit: string
  sprints: ProjectSprint[]
}

const operationalReportData: ProjectOperationalPlan[] = [
  {
    id: 1,
    project: 'Extragel',
    category: 'Фармацевтика / Мази',
    manager: 'Азамат Ю.',
    month: 'Сентябрь 2026',
    overallPlan: 220,
    overallFact: 189,
    overallProgress: 86,
    unit: 'визитов',
    sprints: [
      {
        sprintId: 1,
        name: 'Спринт 1',
        dates: '01.09 — 07.09',
        plan: 55,
        fact: 55,
        percent: 100,
        unit: 'визитов',
        tasks: [
          { id: 't1_1', name: 'Аптечные визиты Ташкент (Центр)', plan: 30, fact: 30, unit: 'визитов', percent: 100, assignee: 'Азамат Ю.' },
          { id: 't1_2', name: 'Визиты к травматологам и хирургам', plan: 20, fact: 20, unit: 'визитов', percent: 100, assignee: 'Наргиза К.' },
          { id: 't1_3', name: 'Размещение POSM в сетях 36.6', plan: 5, fact: 5, unit: 'точек', percent: 100, assignee: 'Тимур М.' }
        ]
      },
      {
        sprintId: 2,
        name: 'Спринт 2',
        dates: '08.09 — 14.09',
        plan: 55,
        fact: 52,
        percent: 95,
        unit: 'визитов',
        tasks: [
          { id: 't2_1', name: 'Аптечные визиты Чиланзар & Юнусабад', plan: 30, fact: 28, unit: 'визитов', percent: 93, assignee: 'Азамат Ю.' },
          { id: 't2_2', name: 'Визиты к спортивным врачам', plan: 20, fact: 20, unit: 'визитов', percent: 100, assignee: 'Наргиза К.' },
          { id: 't2_3', name: 'Проверка первой линии выкладки', plan: 5, fact: 4, unit: 'точек', percent: 80, assignee: 'Тимур М.' }
        ]
      },
      {
        sprintId: 3,
        name: 'Спринт 3',
        dates: '15.09 — 21.09',
        isCurrent: true,
        plan: 55,
        fact: 44,
        percent: 80,
        unit: 'визитов',
        tasks: [
          { id: 't3_1', name: 'Аптечные визиты Самарканд', plan: 30, fact: 24, unit: 'визитов', percent: 80, assignee: 'Азамат Ю.' },
          { id: 't3_2', name: 'Визиты к ортопедам и реабилитологам', plan: 20, fact: 16, unit: 'визитов', percent: 80, assignee: 'Наргиза К.' },
          { id: 't3_3', name: 'Фармаконадзор и мониторинг наличия', plan: 5, fact: 4, unit: 'отчетов', percent: 80, assignee: 'Лола Т.' }
        ]
      },
      {
        sprintId: 4,
        name: 'Спринт 4',
        dates: '22.09 — 30.09',
        plan: 55,
        fact: 38,
        percent: 69,
        unit: 'визитов',
        tasks: [
          { id: 't4_1', name: 'Повторный аудит аптек и дозаказ', plan: 35, fact: 25, unit: 'визитов', percent: 71, assignee: 'Азамат Ю.' },
          { id: 't4_2', name: 'Клинические презентации в клиниках', plan: 20, fact: 13, unit: 'визитов', percent: 65, assignee: 'Наргиза К.' }
        ]
      }
    ]
  },
  {
    id: 2,
    project: 'Masculan',
    category: 'Контрацепция & Wellness',
    manager: 'Тимур М.',
    month: 'Сентябрь 2026',
    overallPlan: 145,
    overallFact: 110,
    overallProgress: 76,
    unit: 'задач',
    sprints: [
      {
        sprintId: 1,
        name: 'Спринт 1',
        dates: '01.09 — 07.09',
        plan: 35,
        fact: 35,
        percent: 100,
        unit: 'визитов',
        tasks: [
          { id: 'm1_1', name: 'Аптечные визиты Ташкент (Сеть Olam)', plan: 25, fact: 25, unit: 'визитов', percent: 100, assignee: 'Тимур М.' },
          { id: 'm1_2', name: 'Мерчендайзинг кассовой зоны', plan: 10, fact: 10, unit: 'точек', percent: 100, assignee: 'Сардор Р.' }
        ]
      },
      {
        sprintId: 2,
        name: 'Спринт 2',
        dates: '08.09 — 14.09',
        plan: 35,
        fact: 30,
        percent: 86,
        unit: 'визитов',
        tasks: [
          { id: 'm2_1', name: 'Визиты в ключевые аптеки Самарканда', plan: 25, fact: 22, unit: 'визитов', percent: 88, assignee: 'Тимур М.' },
          { id: 'm2_2', name: 'Установка брендированных диспенсеров', plan: 10, fact: 8, unit: 'штук', percent: 80, assignee: 'Сардор Р.' }
        ]
      },
      {
        sprintId: 3,
        name: 'Спринт 3',
        dates: '15.09 — 21.09',
        isCurrent: true,
        plan: 40,
        fact: 16,
        percent: 40,
        unit: 'задач',
        tasks: [
          { id: 'm3_1', name: 'Аптечные визиты Фергана & Андижан', plan: 25, fact: 12, unit: 'визитов', percent: 48, assignee: 'Тимур М.' },
          { id: 'm3_2', name: 'Установка фирменных промостоек B2B', plan: 15, fact: 4, unit: 'штук', percent: 27, assignee: 'Сардор Р.' }
        ]
      },
      {
        sprintId: 4,
        name: 'Спринт 4',
        dates: '22.09 — 30.09',
        plan: 35,
        fact: 29,
        percent: 83,
        unit: 'визитов',
        tasks: [
          { id: 'm4_1', name: 'Контрольный аудит выкладки и мерч', plan: 25, fact: 21, unit: 'точек', percent: 84, assignee: 'Тимур М.' },
          { id: 'm4_2', name: 'Итоговые сверки с дистрибьюторами', plan: 10, fact: 8, unit: 'отчетов', percent: 80, assignee: 'Лола Т.' }
        ]
      }
    ]
  },
  {
    id: 3,
    project: 'Энтеросгель',
    category: 'Энтеросорбенты & Детокс',
    manager: 'Наргиза К.',
    month: 'Сентябрь 2026',
    overallPlan: 160,
    overallFact: 148,
    overallProgress: 92,
    unit: 'визитов',
    sprints: [
      {
        sprintId: 1,
        name: 'Спринт 1',
        dates: '01.09 — 07.09',
        plan: 40,
        fact: 40,
        percent: 100,
        unit: 'визитов',
        tasks: [
          { id: 'e1_1', name: 'Фармкружки по сетям Ташкента', plan: 20, fact: 20, unit: 'кружков', percent: 100, assignee: 'Наргиза К.' },
          { id: 'e1_2', name: 'Визиты к гастроэнтерологам и педиатрам', plan: 20, fact: 20, unit: 'визитов', percent: 100, assignee: 'Азиз Т.' }
        ]
      },
      {
        sprintId: 2,
        name: 'Спринт 2',
        dates: '08.09 — 14.09',
        plan: 40,
        fact: 38,
        percent: 95,
        unit: 'визитов',
        tasks: [
          { id: 'e2_1', name: 'Фармкружки региональные сети', plan: 20, fact: 19, unit: 'кружков', percent: 95, assignee: 'Наргиза К.' },
          { id: 'e2_2', name: 'Визиты к инфекционистам клиник', plan: 20, fact: 19, unit: 'визитов', percent: 95, assignee: 'Азиз Т.' }
        ]
      },
      {
        sprintId: 3,
        name: 'Спринт 3',
        dates: '15.09 — 21.09',
        isCurrent: true,
        plan: 40,
        fact: 36,
        percent: 90,
        unit: 'визитов',
        tasks: [
          { id: 'e3_1', name: 'Обучение провизоров первой линии', plan: 20, fact: 18, unit: 'аптек', percent: 90, assignee: 'Наргиза К.' },
          { id: 'e3_2', name: 'Аудит товарных остатков в рознице', plan: 20, fact: 18, unit: 'точек', percent: 90, assignee: 'Азиз Т.' }
        ]
      },
      {
        sprintId: 4,
        name: 'Спринт 4',
        dates: '22.09 — 30.09',
        plan: 40,
        fact: 34,
        percent: 85,
        unit: 'визитов',
        tasks: [
          { id: 'e4_1', name: 'Сезонный мониторинг спроса', plan: 20, fact: 18, unit: 'отчетов', percent: 90, assignee: 'Наргиза К.' },
          { id: 'e4_2', name: 'Контроль наличия в дежурных аптеках', plan: 20, fact: 16, unit: 'визитов', percent: 80, assignee: 'Азиз Т.' }
        ]
      }
    ]
  },
  {
    id: 4,
    project: 'Фитосепт',
    category: 'Антисептики & ЛОР',
    manager: 'Сардор Р.',
    month: 'Сентябрь 2026',
    overallPlan: 110,
    overallFact: 94,
    overallProgress: 85,
    unit: 'визитов',
    sprints: [
      {
        sprintId: 1,
        name: 'Спринт 1',
        dates: '01.09 — 07.09',
        plan: 28,
        fact: 28,
        percent: 100,
        unit: 'визитов',
        tasks: [
          { id: 'f1_1', name: 'Визиты к ЛОР-врачам Ташкент', plan: 18, fact: 18, unit: 'визитов', percent: 100, assignee: 'Сардор Р.' },
          { id: 'f1_2', name: 'Мерчендайзинг первой полки', plan: 10, fact: 10, unit: 'точек', percent: 100, assignee: 'Азамат Ю.' }
        ]
      },
      {
        sprintId: 2,
        name: 'Спринт 2',
        dates: '08.09 — 14.09',
        plan: 28,
        fact: 25,
        percent: 89,
        unit: 'визитов',
        tasks: [
          { id: 'f2_1', name: 'Визиты к терапевтам поликлиник', plan: 18, fact: 16, unit: 'визитов', percent: 89, assignee: 'Сардор Р.' },
          { id: 'f2_2', name: 'Распространение методических материалов', plan: 10, fact: 9, unit: 'комплектов', percent: 90, assignee: 'Азамат Ю.' }
        ]
      },
      {
        sprintId: 3,
        name: 'Спринт 3',
        dates: '15.09 — 21.09',
        isCurrent: true,
        plan: 28,
        fact: 23,
        percent: 82,
        unit: 'визитов',
        tasks: [
          { id: 'f3_1', name: 'Аптечные кружки по противопростудным', plan: 18, fact: 15, unit: 'кружков', percent: 83, assignee: 'Сардор Р.' },
          { id: 'f3_2', name: 'Контроль цен и промо-акций в сетях', plan: 10, fact: 8, unit: 'точек', percent: 80, assignee: 'Азамат Ю.' }
        ]
      },
      {
        sprintId: 4,
        name: 'Спринт 4',
        dates: '22.09 — 30.09',
        plan: 26,
        fact: 18,
        percent: 69,
        unit: 'визитов',
        tasks: [
          { id: 'f4_1', name: 'Итоговые визиты к ключевым врачам', plan: 16, fact: 11, unit: 'визитов', percent: 69, assignee: 'Сардор Р.' },
          { id: 'f4_2', name: 'Сверка планов с зав. аптеками', plan: 10, fact: 7, unit: 'визитов', percent: 70, assignee: 'Азамат Ю.' }
        ]
      }
    ]
  }
]

// Strict 3-color status helper for Plan vs Fact (<35% Red, 35-74% Yellow, >=75% Green)
const getPlanFactProgressConfig = (percent: number) => {
  if (percent < 35) {
    return {
      text: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-500',
      lightBg: 'bg-rose-50 dark:bg-rose-500/15',
      border: 'border-rose-200 dark:border-rose-500/25',
      label: 'Отставание'
    }
  }
  if (percent < 75) {
    return {
      text: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-500',
      lightBg: 'bg-amber-50 dark:bg-amber-500/15',
      border: 'border-amber-200 dark:border-amber-500/25',
      label: 'В процессе'
    }
  }
  return {
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    border: 'border-emerald-200 dark:border-emerald-500/25',
    label: 'Выполнено'
  }
}

// Influencer Marketing & Bloggers Dataset
const bloggersReportData = [
  {
    id: 'b1',
    project: 'Extragel',
    blogger: 'Шахзода Мухаммедова',
    handle: '@shakhzoda__mukhammedova',
    platform: 'Instagram',
    category: 'Beauty & Lifestyle',
    profileUrl: 'https://www.instagram.com/shakhzoda__mukhammedova/',
    postUrl: 'https://www.instagram.com/reel/C-shakhzoda-extragel/',
    publishDate: '12 сентября 2026',
    followers: '4.2M',
    reach: '180K',
    views: '148,200',
    format: 'Reels + 2 Stories',
    price: '$650',
    priceNum: 650,
    profileVisits: 3950,
    promoSales: 318,
    revenue: '$3,816',
    roi: '+487%',
    er: '9.4%',
    geo: 'Ташкент (74%), Самарканд (14%), Регионы (12%)',
    demographics: 'Женщины 82%, Мужчины 18% (20–35 лет)',
    manager: 'Азиз Т. (+998 90 123-45-67)',
    notes: 'Интеграция с фокусом на натуральность состава и быстрое снятие симптомов. Живой формат распаковки, личный опыт блогера и активный промокод на скидку 15% в аптечных сетях.'
  },
  {
    id: 'b2',
    project: 'Extragel',
    blogger: 'Доктор Алимов (Health & Life)',
    handle: '@dr_alimov_health',
    platform: 'Telegram',
    category: 'Медицина & Здоровье',
    profileUrl: 'https://t.me/dr_alimov_health',
    postUrl: 'https://t.me/dr_alimov_health/1420',
    publishDate: '08 сентября 2026',
    followers: '120K',
    reach: '45K',
    views: '42,000',
    format: 'Экспертный пост с опросом',
    price: '$200',
    priceNum: 200,
    profileVisits: 1120,
    promoSales: 94,
    revenue: '$1,128',
    roi: '+464%',
    er: '7.8%',
    geo: 'Ташкент (65%), Андижан (18%), Бухара (17%)',
    demographics: 'Женщины 54%, Мужчины 46% (25–45 лет)',
    manager: 'Азиз Т. (+998 90 123-45-67)',
    notes: 'Экспертный разбор механизма действия препарата с клиническими акцентами и интерактивным опросом целевой аудитории.'
  },
  {
    id: 'b3',
    project: 'Extragel',
    blogger: 'Мадина Мамасидикова',
    handle: '@madina_lifestyle',
    platform: 'Instagram',
    category: 'Lifestyle & Семья',
    profileUrl: 'https://www.instagram.com/madina_lifestyle/',
    postUrl: 'https://www.instagram.com/stories/highlights/madina_family/',
    publishDate: '15 сентября 2026',
    followers: '850K',
    reach: '95K',
    views: '88,500',
    format: 'Stories распаковка аптечки',
    price: '$300',
    priceNum: 300,
    profileVisits: 1840,
    promoSales: 142,
    revenue: '$1,704',
    roi: '+468%',
    er: '8.2%',
    geo: 'Ташкент (80%), Фергана (12%), Наманган (8%)',
    demographics: 'Женщины 89%, Мужчины 11% (22–40 лет)',
    manager: 'Наргиза К. (+998 93 555-44-33)',
    notes: 'Семейный контент: аптечка в поездку с детьми. Интеграция в формате серии Stories-распаковки с демонстрацией применения.'
  },
  {
    id: 'b4',
    project: 'Extragel',
    blogger: 'Фитнес Ташкент (Артём)',
    handle: '@tashkent_fit_artem',
    platform: 'TikTok',
    category: 'Фитнес & ЗОЖ Ташкент',
    profileUrl: 'https://www.tiktok.com/@tashkent_fit_artem',
    postUrl: 'https://www.tiktok.com/@tashkent_fit_artem/video/739120',
    publishDate: '20 сентября 2026',
    followers: '320K',
    reach: '60K',
    views: '65,000',
    format: 'Динамичный ролик с тренировки',
    price: '$180',
    priceNum: 180,
    profileVisits: 980,
    promoSales: 65,
    revenue: '$780',
    roi: '+333%',
    er: '11.1%',
    geo: 'Ташкент (85%), Чирчик (10%), Другие (5%)',
    demographics: 'Мужчины 58%, Женщины 42% (18–30 лет)',
    manager: 'Наргиза К. (+998 93 555-44-33)',
    notes: 'Динамичный ролик после интенсивной силовой тренировки. Акцент на быстрое восстановление связок и суставов.'
  },
  {
    id: 'b5',
    project: 'Masculan',
    blogger: 'Улугбек Men Style',
    handle: '@ulugbek_style',
    platform: 'Instagram',
    category: 'Мужской стиль & Тренды',
    profileUrl: 'https://www.instagram.com/ulugbek_style/',
    postUrl: 'https://www.instagram.com/reel/C-ulugbek_masculan/',
    publishDate: '10 сентября 2026',
    followers: '450K',
    reach: '75K',
    views: '71,200',
    format: 'Reels обзор трендов',
    price: '$350',
    priceNum: 350,
    profileVisits: 2450,
    promoSales: 180,
    revenue: '$2,160',
    roi: '+517%',
    er: '8.9%',
    geo: 'Ташкент (78%), Самарканд (12%), Навои (10%)',
    demographics: 'Мужчины 76%, Женщины 24% (21–38 лет)',
    manager: 'Азиз Т. (+998 90 123-45-67)',
    notes: 'Стильный Reels в эстетике премиум-сегмента Masculan. Высокий интерес мужской аудитории и отличная конверсия в аптечные покупки.'
  }
]

// Partner Venues & B2B Places
const companiesReportData = [
  {
    id: 'c1',
    project: 'Extragel',
    name: 'Hilton Tashkent City',
    category: 'Гостиница / Отель',
    location: 'ул. Ислама Каримова, 2',
    spent: '$850',
    itemsProvided: 'Диспенсеры в SPA и спортзал (6 шт.), 400 саше, полотенца (50 шт.)',
    contactPerson: 'Улугбек (Wellness Manager)',
    phone: '+998 71 210 88 88',
    status: 'Материалы переданы'
  },
  {
    id: 'c2',
    project: 'Extragel',
    name: 'Steam Bar & Lounge',
    category: 'Бар / Ресторан',
    location: 'ул. Тараса Шевченко, 28',
    spent: '$450',
    itemsProvided: 'Брендированные салфетницы (30 шт.), тейбл-тенты, промо-наборы',
    contactPerson: 'Рустам (Арт-директор)',
    phone: '+998 90 999 11 22',
    status: 'Активно'
  },
  {
    id: 'c3',
    project: 'Extragel',
    name: 'B-Fit Wellness Complex',
    category: 'Фитнес-клуб',
    location: 'ул. Кичик Бешагач, 104',
    spent: '$600',
    itemsProvided: 'Стенд у ринга, 250 пробников, плакаты А1 (4 шт.)',
    contactPerson: 'Сардор (Главный тренер)',
    phone: '+998 97 123 45 67',
    status: 'Согласовано'
  },
  {
    id: 'c4',
    project: 'Extragel',
    name: 'Hyatt Regency Tashkent',
    category: 'Гостиница / Отель',
    location: 'ул. Навои, 1',
    spent: '$1,100',
    itemsProvided: 'Welcome-наборы VIP (200 шт.), саше в ванные комнаты',
    contactPerson: 'Нодира (Guest Relations)',
    phone: '+998 71 207 12 34',
    status: 'Переговоры'
  }
]

// Weekly Plan vs Fact Dynamics Data for SVG Spline Charts
const weeklyDynamicsData = [
  { week: 'W1 (1-7)', plan: 22, fact: 24, label: '1-я Неделя', visitsPlan: 85, visitsFact: 92 },
  { week: 'W2 (8-14)', plan: 45, fact: 49, label: '2-я Неделя', visitsPlan: 175, visitsFact: 190 },
  { week: 'W3 (15-21)', plan: 68, fact: 71, label: '3-я Неделя', visitsPlan: 270, visitsFact: 285 },
  { week: 'W4 (22-28)', plan: 90, fact: 88, label: '4-я Неделя', visitsPlan: 360, visitsFact: 350 },
  { week: 'W5 (29-31)', plan: 100, fact: 94, label: '5-я Неделя', visitsPlan: 410, visitsFact: 385 }
]

// Team Leaderboard Dataset
const teamLeaderboard = [
  { id: 1, name: 'Наргиза Каримова', role: 'Ведущий медпредставитель', plan: 120, fact: 116, percent: 97, avatar: 'НК', badge: 'Лидер месяца' },
  { id: 2, name: 'Азамат Юсупов', role: 'Менеджер проектов & B2B', plan: 95, fact: 89, percent: 94, avatar: 'АЮ', badge: 'Отличный темп' },
  { id: 3, name: 'Тимур Исмаилов', role: 'Фармацевтический представитель', plan: 110, fact: 97, percent: 88, avatar: 'ТИ', badge: 'Стабильно' },
  { id: 4, name: 'Дилшод Алиев', role: 'Мерчендайзинг & Промо', plan: 85, fact: 68, percent: 80, avatar: 'ДА', badge: 'Требует внимания' }
]

export default function Reports() {
  const [activeReportTab, setActiveReportTab] = useState<'analytics' | 'plans' | 'bloggers' | 'companies' | 'rnp_table'>('bloggers')
  const [selectedBloggerModal, setSelectedBloggerModal] = useState<any | null>(null)
  const [selectedMonth, setSelectedMonth] = useState('Сентябрь 2026')
  const [selectedProject, setSelectedProject] = useState('ALL')
  const [rnpData, setRnpData] = useState<RnpItem[]>(initialRnpData)
  const [rnpSectionFilter, setRnpSectionFilter] = useState<string>('ALL')
  const [rnpSearch, setRnpSearch] = useState<string>('')
  const [selectedChartWeek, setSelectedChartWeek] = useState<number>(2) // Default to W3
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null)
  const [isLoadingRnp, setIsLoadingRnp] = useState<boolean>(false)
  const [sprintViewMode, setSprintViewMode] = useState<'matrix' | 'timeline'>('matrix')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Meta (Facebook & Instagram) ecosystem state
  const [metaOverview, setMetaOverview] = useState<any>(null)
  const [metaSubTab, setMetaSubTab] = useState<'ads' | 'influencers' | 'lookup'>('ads')
  const [igLookupHandle, setIgLookupHandle] = useState<string>('shaxzoda__muxammedova')
  const [igLookupResult, setIgLookupResult] = useState<any>(null)
  const [isLookingUpIg, setIsLookingUpIg] = useState<boolean>(false)
  const [lookupError, setLookupError] = useState<string | null>(null)

  // Meta live connection modal state
  const [metaModalOpen, setMetaModalOpen] = useState<boolean>(false)
  const [metaTokenInput, setMetaTokenInput] = useState<string>('')
  const [metaAdAccountInput, setMetaAdAccountInput] = useState<string>('act_extragel_uz')
  const [metaIgAccountInput, setMetaIgAccountInput] = useState<string>('17841405928190')
  const [metaConfigStatus, setMetaConfigStatus] = useState<any>(null)
  const [metaSaving, setMetaSaving] = useState<boolean>(false)
  const [metaFeedback, setMetaFeedback] = useState<string | null>(null)

  // Fetch RNP items from backend PostgreSQL database
  useEffect(() => {
    let isMounted = true
    const fetchRnp = async () => {
      setIsLoadingRnp(true)
      try {
        const res = await api.get('/rnp/', { params: { month_name: selectedMonth } })
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: RnpItem[] = res.data.map((item: any) => ({
            id: String(item.id),
            section: item.section,
            sectionName: item.section_name,
            role: item.role,
            person: item.person,
            indicator: item.indicator,
            prevFact: item.prev_fact,
            prevPercent: item.prev_percent,
            planMonth: item.plan_month,
            factMonth: item.fact_month,
            percentMonth: item.percent_month,
            forecast: item.forecast,
            w1: { plan: item.w1_plan, fact: item.w1_fact },
            w2: { plan: item.w2_plan, fact: item.w2_fact },
            w3: { plan: item.w3_plan, fact: item.w3_fact },
            w4: { plan: item.w4_plan, fact: item.w4_fact },
            w5: { plan: item.w5_plan, fact: item.w5_fact }
          }))
          setRnpData(mapped)
        }
      } catch (err) {
        console.warn('Using initial RNP dataset (backend offline or loading):', err)
      } finally {
        if (isMounted) setIsLoadingRnp(false)
      }
    }
    fetchRnp()
    return () => { isMounted = false }
  }, [selectedMonth])

  // Fetch live Bloggers and Companies from PostgreSQL
  const [liveBloggers, setLiveBloggers] = useState<any[]>([])
  const [liveCompanies, setLiveCompanies] = useState<any[]>([])

  useEffect(() => {
    let isMounted = true
    api.get('/bloggers/').then(res => {
      if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
        const projectNames: Record<number, string> = { 1: 'Extragel', 2: 'Masculan', 3: 'Энтеросгель', 4: 'Фитосепт' }
        const mapped = res.data.map((b: any) => {
          const cleanHandle = (b.handle || '').replace(/^@/, '')
          const profileUrl = b.profile_url || (
            b.platform?.toLowerCase() === 'telegram' ? `https://t.me/${cleanHandle}` :
            b.platform?.toLowerCase() === 'tiktok' ? `https://www.tiktok.com/@${cleanHandle}` :
            b.platform?.toLowerCase() === 'youtube' ? `https://www.youtube.com/@${cleanHandle}` :
            `https://www.instagram.com/${cleanHandle}/`
          )
          const promoSales = b.link_clicks || 85
          const priceNum = parseInt((b.price || '0').replace(/[^\d]/g, ''), 10) || 250
          return {
            id: b.id,
            project: projectNames[b.project_id] || (b.project_id ? `Проект #${b.project_id}` : 'Extragel'),
            blogger: b.name,
            handle: b.handle,
            platform: b.platform || 'Instagram',
            category: b.category || 'Beauty & Lifestyle',
            profileUrl,
            postUrl: b.post_url || profileUrl,
            publishDate: b.publish_date || 'Сентябрь 2026',
            followers: b.followers || '250K',
            reach: b.reach || '65K',
            views: (b.views || 0).toLocaleString(),
            format: b.format || 'Reels + Stories',
            price: b.price || `$${priceNum}`,
            priceNum,
            profileVisits: b.profile_visits || 1200,
            promoSales,
            revenue: `$${(promoSales * 12).toLocaleString()}`,
            roi: `+${Math.round(((promoSales * 12) / (priceNum || 1)) * 100)}%`,
            er: b.er || '8.4%',
            geo: b.geo || 'Ташкент (72%), Самарканд (16%), Регионы (12%)',
            demographics: b.demographics || 'Женщины 75%, Мужчины 25% (20–35 лет)',
            manager: b.manager || 'Азиз Т. (+998 90 123-45-67)',
            notes: b.notes || 'Интеграция с акцентом на преимущества продукта, живую распаковку и промокод со скидкой 15% в аптечных сетях.'
          }
        })
        setLiveBloggers(mapped)
      }
    }).catch(() => {})

    api.get('/companies/').then(res => {
      if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
        const projectNames: Record<number, string> = { 1: 'Extragel', 2: 'Masculan', 3: 'Энтеросгель', 4: 'Фитосепт' }
        const mapped = res.data.map((c: any) => ({
          id: c.id,
          project: projectNames[c.project_id] || (c.project_id ? `Проект #${c.project_id}` : 'Extragel'),
          name: c.name,
          category: c.category,
          location: c.location || 'Адрес не указан',
          spent: c.spent,
          itemsProvided: c.items_provided || 'Материалы не указаны',
          contactPerson: c.contact_person || '—',
          phone: c.phone || '—',
          status: c.status
        }))
        setLiveCompanies(mapped)
      }
    }).catch(() => {})

    return () => { isMounted = false }
  }, [])

  // Fetch live Sprints Overview from PostgreSQL
  const [livePlans, setLivePlans] = useState<ProjectOperationalPlan[]>([])

  useEffect(() => {
    let isMounted = true
    api.get('/reports/sprints-overview')
      .then(res => {
        if (isMounted && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: ProjectOperationalPlan[] = res.data.map((item: any) => ({
            id: Number(item.id) || 1,
            project: item.project,
            category: 'Проект компании',
            manager: item.owner || 'Азамат К.',
            month: 'Сентябрь 2026',
            overallPlan: 100,
            overallFact: item.overallProgress,
            overallProgress: item.overallProgress,
            unit: '%',
            sprints: (item.sprints || []).map((s: any) => ({
              sprintId: s.id,
              name: s.name,
              dates: s.dates,
              plan: s.tasksTotal || 20,
              fact: s.tasksDone || Math.round((s.tasksTotal || 20) * (s.percent / 100)),
              percent: s.percent,
              unit: 'задач',
              tasks: []
            }))
          }))
          setLivePlans(mapped)
        }
      })
      .catch(() => {})
    return () => { isMounted = false }
  }, [])

  // Fetch Meta (Facebook & Instagram) ecosystem analytics
  useEffect(() => {
    let isMounted = true
    api.get('/meta/overview')
      .then(res => {
        if (isMounted && res.data) {
          setMetaOverview(res.data)
        }
      })
      .catch(err => {
        console.warn('Meta overview loading error:', err)
      })
    return () => { isMounted = false }
  }, [])

  // Handle Instagram handle lookup & estimation
  const handleLookupInstagram = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const handleToQuery = igLookupHandle.trim().replace(/^@/, '')
    if (!handleToQuery) return
    setIsLookingUpIg(true)
    setLookupError(null)
    try {
      const res = await api.get('/instagram/lookup', { params: { handle: handleToQuery } })
      if (res.data) {
        setIgLookupResult(res.data)
      }
    } catch (err: any) {
      setLookupError('Не удалось подтянуть данные профиля Instagram. Проверьте правильность логина.')
    } finally {
      setIsLookingUpIg(false)
    }
  }

  // Load Meta status & config
  useEffect(() => {
    let isMounted = true
    api.get('/meta/status')
      .then(res => {
        if (isMounted && res.data) {
          setMetaConfigStatus(res.data)
          if (res.data.ad_account_id) setMetaAdAccountInput(res.data.ad_account_id)
          if (res.data.instagram_account_id) setMetaIgAccountInput(res.data.instagram_account_id)
        }
      })
      .catch(() => {})
    return () => { isMounted = false }
  }, [])

  const handleSaveMetaConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    setMetaSaving(true)
    setMetaFeedback(null)
    try {
      const res = await api.post('/meta/configure', {
        access_token: metaTokenInput || undefined,
        ad_account_id: metaAdAccountInput,
        instagram_account_id: metaIgAccountInput
      })
      if (res.data?.status === 'success') {
        setMetaFeedback('Параметры Meta Ads & Instagram успешно сохранены и активированы!')
        setMetaConfigStatus({
          enabled: true,
          status: 'active',
          configured: true,
          mode: 'live',
          ad_account_id: metaAdAccountInput,
          instagram_account_id: metaIgAccountInput
        })
        setTimeout(() => setMetaModalOpen(false), 1400)
      }
    } catch (err: any) {
      setMetaFeedback('Ошибка сохранения параметров Meta')
    } finally {
      setMetaSaving(false)
    }
  }

  const effectiveBloggers = liveBloggers.length > 0 ? liveBloggers : bloggersReportData
  const effectiveCompanies = liveCompanies.length > 0 ? liveCompanies : companiesReportData
  const effectivePlans = livePlans.length > 0 ? livePlans : operationalReportData

  // Filtered datasets based on selectedProject
  const filteredBloggers = useMemo(() => {
    if (selectedProject === 'ALL') return effectiveBloggers
    return effectiveBloggers.filter(b => b.project.toLowerCase() === selectedProject.toLowerCase())
  }, [effectiveBloggers, selectedProject])

  const filteredCompanies = useMemo(() => {
    if (selectedProject === 'ALL') return effectiveCompanies
    return effectiveCompanies.filter(c => c.project.toLowerCase() === selectedProject.toLowerCase())
  }, [effectiveCompanies, selectedProject])

  const filteredPlans = useMemo(() => {
    if (selectedProject === 'ALL') return effectivePlans
    return effectivePlans.filter(p => p.project.toLowerCase() === selectedProject.toLowerCase())
  }, [effectivePlans, selectedProject])

  // Operational Sprints Aggregates - pure percentage closure
  const operationalStats = useMemo(() => {
    const totalPlan = filteredPlans.reduce((acc, p) => acc + p.overallPlan, 0)
    const totalFact = filteredPlans.reduce((acc, p) => acc + p.overallFact, 0)
    const totalPercent = Math.round((totalFact / (totalPlan || 1)) * 100)

    // Current Sprint (Sprint 3)
    const sprint3Plan = filteredPlans.reduce((acc, p) => acc + (p.sprints.find(s => s.sprintId === 3)?.plan || 0), 0)
    const sprint3Fact = filteredPlans.reduce((acc, p) => acc + (p.sprints.find(s => s.sprintId === 3)?.fact || 0), 0)
    const sprint3Percent = Math.round((sprint3Fact / (sprint3Plan || 1)) * 100)

    // Project Health distribution
    const greenCount = filteredPlans.filter(p => p.overallProgress >= 75).length
    const yellowCount = filteredPlans.filter(p => p.overallProgress >= 35 && p.overallProgress < 75).length
    const redCount = filteredPlans.filter(p => p.overallProgress < 35).length

    // Attention sprints (<75% in any sprint)
    const attentionSprints: { project: string; sprintName: string; percent: number }[] = []
    filteredPlans.forEach(p => {
      p.sprints.forEach(s => {
        if (s.percent < 75) {
          attentionSprints.push({ project: p.project, sprintName: s.name, percent: s.percent })
        }
      })
    })

    return {
      totalPercent,
      sprint3Percent,
      greenCount,
      yellowCount,
      redCount,
      attentionSprints
    }
  }, [filteredPlans])

  const filteredRnp = useMemo(() => {
    return rnpData.filter(item => {
      const matchSection = rnpSectionFilter === 'ALL' || item.section === rnpSectionFilter
      const indicatorText = (item.indicator || '').toLowerCase()
      const personText = (item.person || '').toLowerCase()
      const sectionText = (item.sectionName || '').toLowerCase()
      const searchTarget = rnpSearch.toLowerCase().trim()
      const matchSearch = !searchTarget || 
        indicatorText.includes(searchTarget) ||
        personText.includes(searchTarget) ||
        sectionText.includes(searchTarget)
      return matchSection && matchSearch
    })
  }, [rnpData, rnpSectionFilter, rnpSearch])

  // Aggregate high-level metrics
  const totalBloggerReach = useMemo(() => {
    return filteredBloggers.reduce((acc, b) => acc + (parseInt(b.views?.replace(/,/g, '') || '0', 10) || 50000), 0)
  }, [filteredBloggers])

  const totalBloggerSpend = useMemo(() => {
    return filteredBloggers.reduce((acc, b) => acc + (b.priceNum || 0), 0)
  }, [filteredBloggers])

  const totalPromoOrders = useMemo(() => {
    return filteredBloggers.reduce((acc, b) => acc + (b.promoSales || 0), 0)
  }, [filteredBloggers])

  // Export to CSV / Excel based on current active tab
  const handleExportCSV = () => {
    let headers: string[] = []
    let rows: (string | number)[][] = []
    let filename = `Отчет_${selectedMonth.replace(/\s/g, '_')}.csv`

    if (activeReportTab === 'plans') {
      filename = `Спринты_проектов_${selectedMonth.replace(/\s/g, '_')}.csv`
      headers = ['Проект', 'Менеджер', 'Спринт 1 (%)', 'Спринт 2 (%)', 'Спринт 3 (%)', 'Спринт 4 (%)', 'Итог месяца (%)']
      rows = filteredPlans.map(p => [
        `"${p.project}"`,
        `"${p.manager}"`,
        p.sprints.find(s => s.sprintId === 1)?.percent || 0,
        p.sprints.find(s => s.sprintId === 2)?.percent || 0,
        p.sprints.find(s => s.sprintId === 3)?.percent || 0,
        p.sprints.find(s => s.sprintId === 4)?.percent || 0,
        p.overallProgress
      ])
    } else if (activeReportTab === 'bloggers') {
      filename = `Маркетинг_Блогеры_${selectedMonth.replace(/\s/g, '_')}.csv`
      headers = ['Блогер', 'Никнейм', 'Проект', 'Платформа', 'Категория', 'Формат', 'Подписчики', 'Охват', 'Просмотры', 'Стоимость', 'Промо-заказы', 'Выручка', 'ROI']
      rows = filteredBloggers.map(b => [
        `"${b.blogger}"`,
        `"${b.handle}"`,
        `"${b.project}"`,
        `"${b.platform}"`,
        `"${b.category}"`,
        `"${b.format}"`,
        `"${b.followers}"`,
        `"${b.reach}"`,
        b.views,
        `"${b.price}"`,
        b.promoSales,
        `"${b.revenue}"`,
        `"${b.roi}"`
      ])
    } else {
      headers = ['Секция', 'Роль', 'Ответственный', 'Показатель', 'План Месяц', 'Факт Месяц', '% Выполнения', 'Прогноз']
      rows = filteredRnp.map(item => [
        `"${item.sectionName || ''}"`,
        `"${item.role || ''}"`,
        `"${item.person || ''}"`,
        `"${item.indicator || ''}"`,
        item.planMonth,
        item.factMonth,
        `${item.percentMonth}%`,
        item.forecast
      ])
    }

    const csvContent = 'data:text/csv;charset=utf-8,﻿' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Send Live Summary to Telegram
  const [telegramSending, setTelegramSending] = useState(false)
  const [telegramFeedback, setTelegramFeedback] = useState<string | null>(null)

  const handleSendTelegram = async () => {
    setTelegramSending(true)
    try {
      const res = await api.post('/telegram/send-summary')
      if (res.data?.status === 'success') {
        setTelegramFeedback('Отчет успешно отправлен в Telegram канал!')
      } else if (res.data?.status === 'simulation') {
        setTelegramFeedback('Сводка сформирована! (Для боевой отправки укажите TELEGRAM_BOT_TOKEN в .env)')
      } else {
        setTelegramFeedback(res.data?.message || 'Сводка сформирована')
      }
    } catch (err: any) {
      setTelegramFeedback('Не удалось отправить сводку в Telegram')
    } finally {
      setTelegramSending(false)
      setTimeout(() => setTelegramFeedback(null), 6000)
    }
  }

  // Handle CSV Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const text = evt.target?.result as string
        const lines = text.split('\n').filter(l => l.trim().length > 0)
        if (lines.length <= 1) {
          setUploadFeedback('Файл пуст или содержит только заголовок')
          return
        }
        setUploadFeedback(`Успешно загружен файл "${file.name}": обработано ${lines.length - 1} строк`)
        setTimeout(() => setUploadFeedback(null), 5000)
      } catch (err) {
        setUploadFeedback('Ошибка парсинга CSV файла')
      }
    }
    reader.readAsText(file)
  }

  // Helper for generating SVG Spline Path (Cubic Bezier curve)
  const getSplinePath = (data: typeof weeklyDynamicsData, key: 'plan' | 'fact', width: number, height: number, padding: number) => {
    const usableWidth = width - padding * 2
    const usableHeight = height - padding * 2
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * usableWidth
      const y = height - padding - (d[key] / 105) * usableHeight
      return { x, y }
    })

    if (points.length < 2) return { path: '', points }
    let path = `M ${points[0].x} ${points[0].y}`
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i]
      const p1 = points[i + 1]
      const cpX1 = p0.x + (p1.x - p0.x) / 2
      const cpY1 = p0.y
      const cpX2 = p0.x + (p1.x - p0.x) / 2
      const cpY2 = p1.y
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`
    }
    return { path, points }
  }

  const svgWidth = 1000
  const svgHeight = 260
  const padding = 40
  const planSpline = useMemo(() => getSplinePath(weeklyDynamicsData, 'plan', svgWidth, svgHeight, padding), [])
  const factSpline = useMemo(() => getSplinePath(weeklyDynamicsData, 'fact', svgWidth, svgHeight, padding), [])

  // Area under fact curve for solid tint fill
  const factAreaPath = useMemo(() => {
    if (!factSpline || !factSpline.points || factSpline.points.length === 0) return ''
    const pts = factSpline.points
    const first = pts[0]
    const last = pts[pts.length - 1]
    const bottomY = svgHeight - padding
    return `${factSpline.path} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`
  }, [factSpline])

  const activeWeekInfo = weeklyDynamicsData[selectedChartWeek] || weeklyDynamicsData[2]

  return (
    <div className="w-full space-y-7">
      {/* Hidden file input for CSV */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".csv" 
        className="hidden" 
      />

      {/* Header with Title & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white dark:bg-[#181b20] p-6 lg:p-7 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#0052cc] text-white rounded-2xl shadow-md flex items-center justify-center shrink-0">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                Отчёты и Аналитика
              </h1>
              {isLoadingRnp && (
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              )}
            </div>
            <p className="text-sm sm:text-base font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Наглядная динамика выполнения планов, спринтов, визитов и блогосферы
            </p>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center bg-slate-100/90 dark:bg-[#121418] rounded-xl px-2 py-1 border border-slate-200 dark:border-[#2b303c]">
            <Calendar className="w-4 h-4 ml-1.5 text-indigo-500 shrink-0" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
            >
              <option value="Сентябрь 2026" className="dark:bg-[#181b20]">Сентябрь 2026</option>
              <option value="Август 2026" className="dark:bg-[#181b20]">Август 2026</option>
              <option value="Июнь 2026" className="dark:bg-[#181b20]">Июнь 2026</option>
            </select>
          </div>

          {/* Project Selector */}
          <div className="flex items-center bg-slate-100/90 dark:bg-[#121418] rounded-xl px-2 py-1 border border-slate-200 dark:border-[#2b303c]">
            <Filter className="w-4 h-4 ml-1.5 text-indigo-500 shrink-0" />
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 dark:text-slate-100 px-2.5 py-1.5 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL" className="dark:bg-[#181b20]">Все проекты</option>
              <option value="Extragel" className="dark:bg-[#181b20]">Extragel</option>
              <option value="Masculan" className="dark:bg-[#181b20]">Masculan</option>
              <option value="Энтеросгель" className="dark:bg-[#181b20]">Энтеросгель</option>
            </select>
          </div>

          {/* Excel Export Button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0052cc] hover:bg-[#0747a6] text-white rounded-xl text-sm font-bold transition shadow-sm hover:shadow-md cursor-pointer"
            title="Экспорт в Excel / CSV"
          >
            <Download className="w-4 h-4" />
            <span>Экспорт .CSV</span>
          </button>

          {/* Print / PDF Button */}
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#252a36] dark:hover:bg-[#2e3444] text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition cursor-pointer"
            title="Печать или экспорт в PDF"
          >
            <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">PDF / Печать</span>
          </button>

          {/* Telegram Send Button (Enabled) */}
          <button
            onClick={handleSendTelegram}
            disabled={telegramSending}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-[#0088cc] hover:bg-[#0077b5] text-white rounded-xl text-sm font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
            title="Отправить сводку спринтов в Telegram канал"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{telegramSending ? 'Отправка...' : 'Telegram'}</span>
          </button>

          {/* Import CSV Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#252a36] dark:hover:bg-[#2e3444] text-slate-800 dark:text-slate-200 rounded-xl text-sm font-bold transition cursor-pointer"
            title="Импорт отчёта"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            <span>Загрузить</span>
          </button>
        </div>
      </div>

      {/* Telegram Feedback Toast */}
      {telegramFeedback && (
        <div className="p-4 bg-sky-50 dark:bg-sky-950/60 border border-sky-300 dark:border-sky-800 text-sky-900 dark:text-sky-200 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
          <Send className="w-5 h-5 text-sky-500 shrink-0" />
          <span>{telegramFeedback}</span>
        </div>
      )}

      {/* Upload Feedback Toast */}
      {uploadFeedback && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <span>{uploadFeedback}</span>
        </div>
      )}

      {/* Primary Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#2b303c] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveReportTab('analytics')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition shrink-0 cursor-pointer ${
            activeReportTab === 'analytics'
              ? 'bg-[#0052cc] text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222632]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span>Сводная аналитика (Графики)</span>
        </button>

        <button
          onClick={() => setActiveReportTab('plans')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition shrink-0 cursor-pointer ${
            activeReportTab === 'plans'
              ? 'bg-[#0052cc] text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222632]'
          }`}
        >
          <Target className="w-5 h-5" />
          <span>Спринты проектов</span>
        </button>

        <button
          onClick={() => setActiveReportTab('bloggers')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition shrink-0 cursor-pointer ${
            activeReportTab === 'bloggers'
              ? 'bg-[#0052cc] text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222632]'
          }`}
        >
          <Share2 className="w-5 h-5 text-pink-400" />
          <span>Meta: Instagram & Facebook ({filteredBloggers.length})</span>
        </button>

        <button
          onClick={() => setActiveReportTab('companies')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition shrink-0 cursor-pointer ${
            activeReportTab === 'companies'
              ? 'bg-[#0052cc] text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222632]'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span>Партнёры и B2B ({filteredCompanies.length})</span>
        </button>

        <button
          onClick={() => setActiveReportTab('rnp_table')}
          className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm sm:text-base font-bold transition shrink-0 cursor-pointer ${
            activeReportTab === 'rnp_table'
              ? 'bg-[#0052cc] text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#222632]'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Сводная таблица РНП</span>
        </button>
      </div>

      {/* TAB 1: VISUAL ANALYTICS & INTERACTIVE CHARTS */}
      {activeReportTab === 'analytics' && (
        <div className="space-y-7 animate-fade-in">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* KPI 1: Overall Plan Completion */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Общий план месяца</span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                  <TrendingUp className="w-3.5 h-3.5" /> +12.4%
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">88.4%</span>
                <span className="text-sm text-slate-400 font-semibold">из 100% цели</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden mb-2.5">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '88.4%' }} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Опережение целевого графика на 3 дня
              </p>
            </div>

            {/* KPI 2: Field Visits (Doctors & Pharmacies) */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Визиты (Врачи & Аптеки)</span>
                <span className="p-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50">
                  <Stethoscope className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">385</span>
                <span className="text-sm text-slate-400 font-semibold">/ 410 план</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden mb-2.5">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '93.9%' }} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                93.9% выполнения полевого плана визитов
              </p>
            </div>

            {/* KPI 3: Marketing & Influencer Reach */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-purple-600" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Охват блогосферы</span>
                <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 font-extrabold text-xs border border-purple-200 dark:border-purple-800">
                  {filteredBloggers.length} блогеров
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {(totalBloggerReach / 1000).toFixed(0)}K
                </span>
                <span className="text-sm text-slate-400 font-semibold">просмотров</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden mb-2.5">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-500" style={{ width: '91%' }} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {totalPromoOrders} прямых заказов по промокодам
              </p>
            </div>

            {/* KPI 4: Sprints & Task Completion */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Спринты и Задачи</span>
                <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                  <Activity className="w-4 h-4" />
                </span>
              </div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">42</span>
                <span className="text-sm text-slate-400 font-semibold">/ 48 задач</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden mb-2.5">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '87.5%' }} />
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                87.5% задач закрыто вовремя
              </p>
            </div>
          </div>

          {/* MAIN CHART: Performance Dynamics (Plan vs Fact Spline) */}
          <div className="bg-white dark:bg-[#181b20] p-6 lg:p-8 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <span>Динамика выполнения плана по неделям</span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
                    Интерактивный график
                  </span>
                </h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
                  Сравнение запланированного темпа и фактического результата по 5 неделям месяца
                </p>
              </div>

              {/* Chart Legend */}
              <div className="flex items-center gap-5 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-800 dark:text-slate-200 font-bold">Факт (Выполнено)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-0.5 border-t-2 border-dashed border-indigo-400" />
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">План (Цель)</span>
                </div>
              </div>
            </div>

            {/* SVG Spline Chart */}
            <div className="relative w-full overflow-x-auto">
              <svg 
                viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
                className="w-full h-60 sm:h-72 lg:h-80 select-none"
              >
                {/* Horizontal Grid lines */}
                {[0, 25, 50, 75, 100].map((val) => {
                  const y = svgHeight - padding - (val / 105) * (svgHeight - padding * 2)
                  return (
                    <g key={val}>
                      <line 
                        x1={padding} 
                        y1={y} 
                        x2={svgWidth - padding} 
                        y2={y} 
                        stroke="#e2e8f0" 
                        className="dark:stroke-[#2b303c]" 
                        strokeDasharray="4 4" 
                      />
                      <text 
                        x={padding - 10} 
                        y={y + 4} 
                        textAnchor="end" 
                        className="text-xs fill-slate-400 dark:fill-slate-500 font-mono font-semibold"
                      >
                        {val}%
                      </text>
                    </g>
                  )
                })}

                {/* Shaded Area under Fact */}
                {factAreaPath && (
                  <path d={factAreaPath} fill="#10b981" fillOpacity="0.12" />
                )}

                {/* Plan Curve (Dashed line) */}
                {planSpline && planSpline.path && (
                  <path 
                    d={planSpline.path} 
                    fill="none" 
                    stroke="#0052cc" 
                    strokeWidth="3" 
                    strokeDasharray="6 6" 
                  />
                )}

                {/* Fact Curve (Crisp solid line) */}
                {factSpline && factSpline.path && (
                  <path 
                    d={factSpline.path} 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="3.5" 
                    strokeLinecap="round"
                  />
                )}

                {/* Data Points on Fact Curve */}
                {factSpline && factSpline.points && factSpline.points.map((pt, idx) => {
                  const isSelected = selectedChartWeek === idx
                  const d = weeklyDynamicsData[idx]
                  return (
                    <g 
                      key={idx} 
                      className="cursor-pointer transition transform"
                      onClick={() => setSelectedChartWeek(idx)}
                    >
                      {/* Active indicator circle ring */}
                      {isSelected && (
                        <circle 
                          cx={pt.x} 
                          cy={pt.y} 
                          r="10" 
                          fill="none" 
                          stroke="#10b981" 
                          strokeWidth="2.5" 
                          strokeOpacity="0.5"
                        />
                      )}
                      {/* Background circle */}
                      <circle 
                        cx={pt.x} 
                        cy={pt.y} 
                        r={isSelected ? 7 : 5} 
                        className="fill-white dark:fill-[#181b20]" 
                        stroke="#10b981" 
                        strokeWidth={isSelected ? 3.5 : 2.5} 
                      />

                      {/* X-axis labels */}
                      <text 
                        x={pt.x} 
                        y={svgHeight - 12} 
                        textAnchor="middle" 
                        className={`text-xs ${
                          isSelected 
                            ? 'font-black fill-[#4f46e5] dark:fill-indigo-400' 
                            : 'font-semibold fill-slate-500 dark:fill-slate-400'
                        }`}
                      >
                        {d.week}
                      </text>

                      {/* Point value badge */}
                      <text 
                        x={pt.x} 
                        y={pt.y - 12} 
                        textAnchor="middle" 
                        className={`text-xs font-black ${
                          isSelected 
                            ? 'fill-emerald-600 dark:fill-emerald-400' 
                            : 'fill-slate-700 dark:fill-slate-300'
                        }`}
                      >
                        {d.fact}%
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Interactive Selected Week Detail Strip */}
            <div className="mt-5 p-4 bg-slate-50 dark:bg-[#121418] rounded-2xl border border-slate-200 dark:border-[#2b303c] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-black text-sm border border-emerald-200 dark:border-emerald-800">
                  W{selectedChartWeek + 1}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Детализация: {activeWeekInfo.label} ({activeWeekInfo.week})
                  </h4>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Нажмите на любую точку графика для просмотра данных недели
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="bg-white dark:bg-[#181b20] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2b303c]">
                  <span className="text-slate-400 text-xs block font-medium">План недели:</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">{activeWeekInfo.plan}%</span>
                </div>

                <div className="bg-white dark:bg-[#181b20] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2b303c]">
                  <span className="text-slate-400 text-xs block font-medium">Факт недели:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">{activeWeekInfo.fact}%</span>
                </div>

                <div className="bg-white dark:bg-[#181b20] px-3.5 py-2 rounded-xl border border-slate-200 dark:border-[#2b303c]">
                  <span className="text-slate-400 text-xs block font-medium">Полевые визиты:</span>
                  <span className="font-black text-slate-900 dark:text-white">
                    {activeWeekInfo.visitsFact} / {activeWeekInfo.visitsPlan}
                  </span>
                </div>

                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                  activeWeekInfo.fact >= activeWeekInfo.plan
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                }`}>
                  {activeWeekInfo.fact >= activeWeekInfo.plan ? 'План перевыполнен' : 'Небольшое отставание'}
                </div>
              </div>
            </div>
          </div>

          {/* TWO COLUMN GRID: Categories Breakdown & Team Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Category Breakdown */}
            <div className="bg-white dark:bg-[#181b20] p-6 lg:p-7 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Target className="w-5 h-5 text-indigo-500" />
                  <span>Выполнение по направлениям бизнеса</span>
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Цель: 100%</span>
              </div>

              <div className="space-y-5">
                {/* Item 1 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-blue-500" />
                      Визиты к врачам и рецептурный охват
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-base">92%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>План: 100 визитов</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Факт: 92 визита</span>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-500" />
                      Аптечные сети (Ташкент + Регионы)
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-base">88%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>План: 210 аптек</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Факт: 185 аптек</span>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500" />
                      Инфлюенс-маркетинг & Соцсети
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-base">95%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '95%' }} />
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>План: 400K просмотров</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Факт: 415K просмотров</span>
                  </div>
                </div>

                {/* Item 4 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-500" />
                      Партнерские отели, SPA и заведения (B2B)
                    </span>
                    <span className="font-black text-slate-900 dark:text-white text-base">78%</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#262932] h-3 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '78%' }} />
                  </div>
                  <div className="flex justify-between text-xs font-semibold text-slate-400">
                    <span>План: 10 локаций</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">Факт: 8 локаций</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Team Leaderboard */}
            <div className="bg-white dark:bg-[#181b20] p-6 lg:p-7 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>Рейтинг эффективности команды</span>
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">KPI рейтинг</span>
              </div>

              <div className="space-y-3.5">
                {teamLeaderboard.map((member, index) => (
                  <div 
                    key={member.id}
                    className="p-4 bg-slate-50 dark:bg-[#121418] rounded-2xl border border-slate-200/80 dark:border-[#2b303c] flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5">
                      {/* Rank badge */}
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                        index === 0 
                          ? 'bg-amber-400 text-slate-950' 
                          : index === 1 
                          ? 'bg-slate-300 dark:bg-slate-700 text-slate-900 dark:text-white' 
                          : 'bg-slate-200 dark:bg-[#222632] text-slate-600 dark:text-slate-400'
                      }`}>
                        {index + 1}
                      </span>

                      {/* Avatar initials */}
                      <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 font-black text-sm flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                        {member.avatar}
                      </div>

                      <div>
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{member.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                            member.percent >= 95 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : member.percent >= 85
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                          }`}>
                            {member.badge}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{member.role}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                        {member.percent}%
                      </div>
                      <p className="text-xs font-semibold text-slate-400">
                        {member.fact}/{member.plan} план
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Executive Insights / Quick Takeaways */}
          <div className="p-6 bg-slate-50 dark:bg-[#181b20] rounded-3xl border border-slate-200 dark:border-[#2b303c]">
            <h4 className="text-sm font-extrabold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Ключевые выводы аналитики за {selectedMonth}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-800 dark:text-slate-200">
              <div className="flex items-start gap-3 bg-white dark:bg-[#121418] p-4 rounded-2xl border border-slate-200 dark:border-[#2b303c]">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="font-bold text-slate-900 dark:text-white">Визиты к врачам:</strong> Ташкент закрывает цель на 100%, ортопеды и травматологи обеспечили стабильный поток назначений.
                </span>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-[#121418] p-4 rounded-2xl border border-slate-200 dark:border-[#2b303c]">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="font-bold text-slate-900 dark:text-white">Инфлюенсеры:</strong> Пост Шахзоды Мухаммедовой дал максимальную отдачу: 318 прямых заказов при бюджете $650.
                </span>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-[#121418] p-4 rounded-2xl border border-slate-200 dark:border-[#2b303c]">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <span>
                  <strong className="font-bold text-slate-900 dark:text-white">Фокус внимания:</strong> По проекту Masculan необходимо ускорить установку промостоек в регионах (сейчас 40% плана).
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SPRINTS & OPERATIONAL PROGRESS - CLEAN & MINIMAL 1-PAGE VIEW */}
      {activeReportTab === 'plans' && (
        <div className="space-y-5 animate-fade-in">
          {/* TOP EXECUTIVE BAR & VIEW SWITCHER */}
          <div className="bg-white dark:bg-[#181b20] p-5 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Закрытие спринтов и планов по проектам
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-[#222734] text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-[#313849]">
                  {selectedMonth}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
                Оперативный мониторинг процента выполнения всех 4 спринтов и общего плана месяца
              </p>
            </div>

            {/* View Mode Toggle: Matrix vs Timeline */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#121418] rounded-2xl border border-slate-200/80 dark:border-[#262b36] self-start md:self-center">
              <button
                type="button"
                onClick={() => setSprintViewMode('matrix')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  sprintViewMode === 'matrix'
                    ? 'bg-white dark:bg-[#1f242e] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Матрица спринтов</span>
              </button>
              <button
                type="button"
                onClick={() => setSprintViewMode('timeline')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  sprintViewMode === 'timeline'
                    ? 'bg-white dark:bg-[#1f242e] text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Таймлайн спринтов</span>
              </button>
            </div>
          </div>

          {/* LEVEL 1: TOP 4 KPI CHIPS - PURE PERCENTAGES & HEALTH */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Overall Month Plan Closure */}
            {(() => {
              const monthCfg = getPlanFactProgressConfig(operationalStats.totalPercent)
              return (
                <div className="bg-white dark:bg-[#181b20] p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-[#272b36] shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Общий план месяца
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${monthCfg.lightBg} ${monthCfg.text} ${monthCfg.border}`}>
                      {monthCfg.label}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      {operationalStats.totalPercent}%
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      закрыто
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#202530] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${monthCfg.bg}`}
                      style={{ width: `${Math.min(operationalStats.totalPercent, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })()}

            {/* KPI 2: Current Sprint 3 Closure */}
            {(() => {
              const sprintCfg = getPlanFactProgressConfig(operationalStats.sprint3Percent)
              return (
                <div className="bg-white dark:bg-[#181b20] p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-[#272b36] shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Спринт 3 (15–21 сен)
                    </span>
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#222734] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#303646]">
                      В работе
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                      {operationalStats.sprint3Percent}%
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      закрыто
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-[#202530] h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${sprintCfg.bg}`}
                      style={{ width: `${Math.min(operationalStats.sprint3Percent, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })()}

            {/* KPI 3: Health Breakdown */}
            <div className="bg-white dark:bg-[#181b20] p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-[#272b36] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Здоровье проектов
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {filteredPlans.length} бр.
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1">
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {operationalStats.greenCount}
                  </span>
                  <span className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400/80">
                    &ge;75%
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-base font-bold text-amber-600 dark:text-amber-400">
                    {operationalStats.yellowCount}
                  </span>
                  <span className="text-[10px] font-medium text-amber-700 dark:text-amber-400/80">
                    35–74%
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-base font-bold text-rose-600 dark:text-rose-400">
                    {operationalStats.redCount}
                  </span>
                  <span className="text-[10px] font-medium text-rose-700 dark:text-rose-400/80">
                    &lt;35%
                  </span>
                </div>
              </div>
              <div className="text-[11px] font-medium text-slate-400 text-center mt-1">
                Зеленый / Желтый / Красный
              </div>
            </div>

            {/* KPI 4: Attention Zone / Sprint Status */}
            <div className="bg-white dark:bg-[#181b20] p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-[#272b36] shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Зона внимания
                </span>
                <AlertTriangle className={`w-4 h-4 ${operationalStats.attentionSprints.length > 0 ? 'text-amber-500' : 'text-emerald-500'}`} />
              </div>
              {operationalStats.attentionSprints.length > 0 ? (
                <div>
                  <div className="flex items-baseline gap-1.5 mb-1">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {operationalStats.attentionSprints.length}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      спринта в процессе (&lt;75%)
                    </span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2">
                    {operationalStats.attentionSprints[0].project}: {operationalStats.attentionSprints[0].sprintName} закрыт на {operationalStats.attentionSprints[0].percent}%
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Все спринты закрыты
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Все показатели выше целевых 75%</p>
                </div>
              )}
              <div className="text-[11px] font-medium text-slate-400 mt-2">
                Оперативный статус контроля
              </div>
            </div>
          </div>

          {/* MAIN SPRINT BOARD: PURE CLOSURE PERCENTAGES */}
          {sprintViewMode === 'matrix' ? (
            /* SPRINT MATRIX TABLE */
            <div className="bg-white dark:bg-[#181b20] rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-[#272b36] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/70 dark:bg-[#14171d]">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Сводная матрица закрытия спринтов и планов
                  </h3>
                  <p className="text-xs font-medium text-slate-400">
                    На сколько закрыт каждый спринт (1–4) и общий план месяца по проектам
                  </p>
                </div>
                <div className="text-xs font-medium text-slate-400 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> &ge;75% Выполнен
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> 35–74% В процессе
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> &lt;35% Отставание
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[850px]">
                  <thead>
                    <tr className="border-b border-slate-200/80 dark:border-[#242934] bg-slate-100/60 dark:bg-[#121419] text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3.5 px-5 w-[22%]">Проект и куратор</th>
                      <th className="py-3.5 px-4 w-[16%]">
                        Спринт 1 <span className="font-medium text-slate-400 block text-[10px] normal-case">01–07 сен</span>
                      </th>
                      <th className="py-3.5 px-4 w-[16%]">
                        Спринт 2 <span className="font-medium text-slate-400 block text-[10px] normal-case">08–14 сен</span>
                      </th>
                      <th className="py-3.5 px-4 w-[18%] bg-slate-100/70 dark:bg-[#181d27] text-slate-800 dark:text-slate-200 border-x border-slate-200 dark:border-[#2b3140]">
                        <div className="flex items-center justify-between">
                          <span>Спринт 3</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-200 dark:bg-[#252b39] text-slate-700 dark:text-slate-300 uppercase tracking-normal">Текущий</span>
                        </div>
                        <span className="font-medium text-slate-400 block text-[10px] normal-case">15–21 сен</span>
                      </th>
                      <th className="py-3.5 px-4 w-[16%]">
                        Спринт 4 <span className="font-medium text-slate-400 block text-[10px] normal-case">22–30 сен</span>
                      </th>
                      <th className="py-3.5 px-5 w-[16%] text-right">Общий план месяца</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#202530]">
                    {filteredPlans.map(proj => {
                      const projMonthCfg = getPlanFactProgressConfig(proj.overallProgress)

                      return (
                        <tr 
                          key={proj.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-[#161a22] transition-colors"
                        >
                          {/* Project Name Cell */}
                          <td className="py-4 px-5">
                            <div className="flex items-start gap-2.5">
                              <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${projMonthCfg.bg}`} />
                              <div>
                                <div className="text-sm font-bold text-slate-900 dark:text-white">
                                  {proj.project}
                                </div>
                                <div className="text-xs text-slate-400 font-medium">
                                  {proj.category}
                                </div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                                  Отв: {proj.manager}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Sprints 1 to 4 */}
                          {proj.sprints.map(s => {
                            const sCfg = getPlanFactProgressConfig(s.percent)
                            const isCurrentCol = s.sprintId === 3

                            return (
                              <td 
                                key={s.sprintId}
                                className={`py-3 px-3.5 ${
                                  isCurrentCol ? 'bg-slate-50/40 dark:bg-[#161a22]/50 border-x border-slate-200/60 dark:border-[#222734]' : ''
                                }`}
                              >
                                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#15181f]/80 border border-slate-200/80 dark:border-[#272c38]">
                                  {/* Percentage & Status Badge */}
                                  <div className="flex items-center justify-between gap-1 mb-2">
                                    <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                                      {s.percent}%
                                    </span>
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${sCfg.lightBg} ${sCfg.text} ${sCfg.border}`}>
                                      {sCfg.label}
                                    </span>
                                  </div>

                                  {/* Progress bar */}
                                  <div className="w-full bg-slate-100 dark:bg-[#202530] h-1.5 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full transition-all duration-300 ${sCfg.bg}`}
                                      style={{ width: `${Math.min(s.percent, 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </td>
                            )
                          })}

                          {/* Month Total Column */}
                          <td className="py-4 px-5 text-right">
                            <div className="inline-block text-right">
                              <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                                {proj.overallProgress}%
                              </span>
                              <div className="w-28 bg-slate-100 dark:bg-[#202530] h-1.5 rounded-full overflow-hidden my-1.5 ml-auto">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${projMonthCfg.bg}`}
                                  style={{ width: `${Math.min(proj.overallProgress, 100)}%` }}
                                />
                              </div>
                              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md border ${projMonthCfg.lightBg} ${projMonthCfg.text} ${projMonthCfg.border}`}>
                                {projMonthCfg.label}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* TIMELINE VIEW (4 SPRINT COLUMNS) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(sId => {
                const isCurrent = sId === 3
                const sName = `Спринт ${sId}`
                const sDates = sId === 1 ? '01–07 сен' : sId === 2 ? '08–14 сен' : sId === 3 ? '15–21 сен' : '22–30 сен'
                const sStatus = sId < 3 ? 'Завершен' : sId === 3 ? 'В работе' : 'План'

                return (
                  <div 
                    key={sId}
                    className={`bg-white dark:bg-[#181b20] rounded-3xl border p-4 sm:p-5 flex flex-col justify-between ${
                      isCurrent 
                        ? 'border-slate-300 dark:border-[#384052] shadow-xs' 
                        : 'border-slate-200/90 dark:border-[#2b303c]'
                    }`}
                  >
                    <div>
                      {/* Sprint Header */}
                      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 dark:border-[#222732]">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            {sName}
                          </h4>
                          <span className="text-xs text-slate-400 font-medium">{sDates}</span>
                        </div>
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md border ${
                          isCurrent 
                            ? 'bg-slate-100 dark:bg-[#20242e] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#2a303e]'
                            : sId < 3
                            ? 'bg-slate-100 dark:bg-[#20242e] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-[#2a303e]'
                            : 'bg-slate-50 dark:bg-[#15171e] text-slate-400 border-slate-200 dark:border-[#222530]'
                        }`}>
                          {sStatus}
                        </span>
                      </div>

                      {/* Project Cards in this sprint */}
                      <div className="space-y-3">
                        {filteredPlans.map(p => {
                          const sprintObj = p.sprints.find(s => s.sprintId === sId)
                          if (!sprintObj) return null
                          const sCfg = getPlanFactProgressConfig(sprintObj.percent)

                          return (
                            <div
                              key={p.id}
                              className="p-3.5 rounded-2xl border bg-slate-50/60 dark:bg-[#14161c] border-slate-200/70 dark:border-[#242834]"
                            >
                              <div className="flex items-center justify-between gap-1 mb-2">
                                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                                  {p.project}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {sprintObj.percent}%
                                  </span>
                                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${sCfg.lightBg} ${sCfg.text} ${sCfg.border}`}>
                                    {sCfg.label}
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-slate-200/70 dark:bg-[#202530] h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${sCfg.bg}`}
                                  style={{ width: `${Math.min(sprintObj.percent, 100)}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: META: INSTAGRAM & FACEBOOK ECOSYSTEM */}
      {activeReportTab === 'bloggers' && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary KPIs for Meta & Influencers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Budget */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Бюджет Meta (Ads + Блогеры)</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                ${((metaOverview?.summary?.total_spend || 3280) + totalBloggerSpend).toLocaleString()}
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-2">
                Meta Ads: ${(metaOverview?.summary?.total_spend || 3280).toLocaleString()} • Блогеры: ${totalBloggerSpend.toLocaleString()}
              </p>
            </div>

            {/* Card 2: Reach */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Суммарный охват Meta</span>
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                1.37M чел
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-2">
                {((metaOverview?.summary?.total_reach || 920000) / 1000).toFixed(0)}K Ads • 455K Инфлюенсеры
              </p>
            </div>

            {/* Card 3: Views & Clicks */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-teal-500" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Клики и просмотры</span>
                <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-950/70 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-black text-teal-600 dark:text-teal-400 tracking-tight">
                {((metaOverview?.summary?.total_clicks || 38400) / 1000).toFixed(1)}K кликов
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-2">
                CTR: {metaOverview?.summary?.avg_ctr || '2.09'}% • {(totalBloggerReach / 1000).toFixed(0)}K просмотров
              </p>
            </div>

            {/* Card 4: Blended ROAS */}
            <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-purple-600" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Окупаемость (ROAS)</span>
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl lg:text-4xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
                {metaOverview?.summary?.blended_roas || '3.65'}x
              </div>
              <p className="text-xs font-semibold text-slate-400 mt-2">
                {totalPromoOrders} прямых заказов в аптеках
              </p>
            </div>
          </div>

          {/* Sub-Navigation for Meta Ecosystem */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-slate-100 dark:bg-[#121418] rounded-2xl border border-slate-200 dark:border-[#282d38]">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setMetaSubTab('ads')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  metaSubTab === 'ads'
                    ? 'bg-[#0052cc] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>Таргетированная реклама Meta Ads (FB & IG)</span>
              </button>

              <button
                type="button"
                onClick={() => setMetaSubTab('influencers')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  metaSubTab === 'influencers'
                    ? 'bg-[#0052cc] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Инфлюенсеры Instagram ({filteredBloggers.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setMetaSubTab('lookup')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                  metaSubTab === 'lookup'
                    ? 'bg-[#0052cc] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Live Анализ профиля Instagram</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMetaModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white dark:bg-[#181b20] hover:bg-slate-50 dark:hover:bg-[#202532] rounded-xl border border-slate-200/80 dark:border-[#2c3240] text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer shadow-xs"
              title="Настройки подключения Meta (Facebook & Instagram)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Meta Ads API: Активен</span>
              <span className="text-[11px] text-[#0052cc] dark:text-blue-400 font-extrabold ml-1">Настроить токен →</span>
            </button>
          </div>

          {/* META CONNECTION CONFIGURATION MODAL */}
          {metaModalOpen && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
              onClick={() => setMetaModalOpen(false)}
            >
              <div 
                className="bg-white dark:bg-[#16181f] w-full max-w-lg rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-[#2b303c] shadow-2xl space-y-5 text-slate-900 dark:text-white relative"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#242833]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Подключение Meta Business Suite</h3>
                      <p className="text-xs text-slate-400">Facebook Ads & Instagram Graph API</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setMetaModalOpen(false)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">Статус: Интеграция включена и активна</span>
                    <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                      {metaConfigStatus?.configured ? 'Боевой токен активен' : 'Калибровка UZ'}
                    </span>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300">
                    Система транслирует данные Meta Ads по кампаниям в Узбекистане. Вы можете вставить боевой системный токен доступа (System User Token) для прямой синхронизации с вашим рекламным кабинетом.
                  </p>
                </div>

                <form onSubmit={handleSaveMetaConfig} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Meta Access Token (Долгосрочный токен)
                    </label>
                    <input
                      type="password"
                      value={metaTokenInput}
                      onChange={e => setMetaTokenInput(e.target.value)}
                      placeholder="EAAxxxxxxx... (оставьте пустым для сохранения текущего)"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#111317] border border-slate-200 dark:border-[#2b303c] rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#0052cc]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Meta Ad Account ID
                    </label>
                    <input
                      type="text"
                      value={metaAdAccountInput}
                      onChange={e => setMetaAdAccountInput(e.target.value)}
                      placeholder="act_1234567890"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#111317] border border-slate-200 dark:border-[#2b303c] rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#0052cc]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Instagram Business Account ID
                    </label>
                    <input
                      type="text"
                      value={metaIgAccountInput}
                      onChange={e => setMetaIgAccountInput(e.target.value)}
                      placeholder="1784140xxxxxx"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#111317] border border-slate-200 dark:border-[#2b303c] rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#0052cc]"
                    />
                  </div>

                  {metaFeedback && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-bold">
                      {metaFeedback}
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#242833]">
                    <button
                      type="button"
                      onClick={() => setMetaModalOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#202532] rounded-xl transition cursor-pointer"
                    >
                      Отмена
                    </button>
                    <button
                      type="submit"
                      disabled={metaSaving}
                      className="px-5 py-2 text-xs font-bold text-white bg-[#0052cc] hover:bg-[#0747a6] rounded-xl transition shadow-sm cursor-pointer disabled:opacity-50"
                    >
                      {metaSaving ? 'Сохранение...' : 'Сохранить и активировать'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* SUBTAB 1: TARGET ADS (META ADS MANAGER: FB + IG) */}
          {metaSubTab === 'ads' && (
            <div className="space-y-6 animate-fade-in">
              {/* Platform Split Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Instagram Ads Card */}
                <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border-l-4 border-l-pink-500 border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center font-bold">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Instagram Ads (Meta)</h3>
                        <p className="text-xs text-slate-400">Reels, Stories, Explore Feed</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-extrabold">
                      {metaOverview?.platforms?.instagram?.share_percent || 65.5}% бюджета
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121418] border border-slate-200/70 dark:border-[#252a36] mb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">Расход</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        ${(metaOverview?.platforms?.instagram?.spend || 2150).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">Охват UZ</span>
                      <span className="text-lg font-black text-pink-600 dark:text-pink-400">
                        {((metaOverview?.platforms?.instagram?.reach || 610000) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">ROAS</span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">3.9x</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Основной драйвер для молодой аудитории 18–32 лет. Лучшие результаты в вертикальных Reels с демонстрацией распаковки.
                  </p>
                </div>

                {/* Facebook Ads Card */}
                <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border-l-4 border-l-blue-600 border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Facebook Ads (Meta)</h3>
                        <p className="text-xs text-slate-400">Feed Video, Groups & B2B Community</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-extrabold">
                      {metaOverview?.platforms?.facebook?.share_percent || 34.5}% бюджета
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-[#121418] border border-slate-200/70 dark:border-[#252a36] mb-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">Расход</span>
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        ${(metaOverview?.platforms?.facebook?.spend || 1130).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">Охват UZ</span>
                      <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                        {((metaOverview?.platforms?.facebook?.reach || 310000) / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">ROAS</span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">3.2x</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Высокая конверсия среди платежеспособной взрослой ЦА (30–55 лет), врачей и фармацевтов в тематических сообществах.
                  </p>
                </div>
              </div>

              {/* Active Campaigns Table */}
              <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Активные рекламные кампании в Meta Ads Manager
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Реальные метрики трансляций в лентах и Reels за {selectedMonth}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-[#222632] px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    4 активные кампании
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#272c38] text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">
                        <th className="py-3 px-3">Кампания & Продукт</th>
                        <th className="py-3 px-3">Канал</th>
                        <th className="py-3 px-3">Расход</th>
                        <th className="py-3 px-3">Показы / Охват</th>
                        <th className="py-3 px-3">Клики (CTR)</th>
                        <th className="py-3 px-3">CPM</th>
                        <th className="py-3 px-3">ROAS</th>
                        <th className="py-3 px-3">Статус</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#242936] text-sm">
                      {(metaOverview?.campaigns || [
                        {
                          id: 'meta-c-1',
                          project: 'Extragel',
                          name: 'Extragel — Instagram Reels & Stories',
                          channel: 'Instagram',
                          format: 'Reels Video',
                          spend: 1200,
                          impressions: 450000,
                          reach: 240000,
                          clicks: 12400,
                          cpm: 2.67,
                          ctr: 2.76,
                          roas: 4.10,
                          status: 'ACTIVE'
                        },
                        {
                          id: 'meta-c-2',
                          project: 'Extragel',
                          name: 'Extragel — Facebook Feed & Medical Groups',
                          channel: 'Facebook',
                          format: 'Feed Video',
                          spend: 680,
                          impressions: 280000,
                          reach: 150000,
                          clicks: 5100,
                          cpm: 2.43,
                          ctr: 1.82,
                          roas: 3.20,
                          status: 'ACTIVE'
                        },
                        {
                          id: 'meta-c-3',
                          project: 'Masculan',
                          name: 'Masculan — Youth Brand Awareness',
                          channel: 'Instagram',
                          format: 'Stories & Reels',
                          spend: 950,
                          impressions: 710000,
                          reach: 370000,
                          clicks: 14200,
                          cpm: 1.34,
                          ctr: 2.00,
                          roas: 3.50,
                          status: 'ACTIVE'
                        },
                        {
                          id: 'meta-c-4',
                          project: 'Энтеросгель',
                          name: 'Энтеросгель — Family Health FB & IG Mix',
                          channel: 'Meta Mix',
                          format: 'Carousel & Feed',
                          spend: 450,
                          impressions: 400000,
                          reach: 160000,
                          clicks: 6700,
                          cpm: 1.13,
                          ctr: 1.68,
                          roas: 3.80,
                          status: 'ACTIVE'
                        }
                      ]).map((c: any) => (
                        <tr key={c.id} className="hover:bg-slate-50/70 dark:hover:bg-[#1a1d24] transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900 dark:text-white">{c.name}</div>
                            <span className="text-xs text-slate-400 font-semibold">{c.project} • {c.format}</span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                              c.channel === 'Instagram'
                                ? 'bg-pink-100 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300'
                                : c.channel === 'Facebook'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300'
                            }`}>
                              {c.channel}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                            ${c.spend.toLocaleString()}
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">{(c.impressions / 1000).toFixed(0)}K показов</div>
                            <div className="text-xs text-slate-400">{(c.reach / 1000).toFixed(0)}K охват</div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold text-blue-600 dark:text-blue-400">{c.clicks.toLocaleString()}</div>
                            <div className="text-xs text-slate-400">CTR {c.ctr}%</div>
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300">
                            ${c.cpm}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 font-bold text-xs">
                              {c.roas}x
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Активна
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Benchmarks and Creative Formats Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Uzbekistan Market Benchmarks */}
                <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    Бенчмарки Meta по рынку Узбекистана (2026)
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#121418] border border-slate-200/70 dark:border-[#252a36]">
                      <span className="text-slate-500 dark:text-slate-400">Активная аудитория Instagram (UZ)</span>
                      <span className="font-bold text-slate-900 dark:text-white">8.2 млн пользователей</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#121418] border border-slate-200/70 dark:border-[#252a36]">
                      <span className="text-slate-500 dark:text-slate-400">Активная аудитория Facebook (UZ)</span>
                      <span className="font-bold text-slate-900 dark:text-white">2.4 млн пользователей</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#121418] border border-slate-200/70 dark:border-[#252a36]">
                      <span className="text-slate-500 dark:text-slate-400">Рыночный диапазон CPM</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">$1.20 - $2.40 за 1 000 показов</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#121418] border border-slate-200/70 dark:border-[#252a36]">
                      <span className="text-slate-500 dark:text-slate-400">Средний CTR в фарм-сегменте</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">1.8% - 3.2%</span>
                    </div>
                    <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-[#121418] border border-slate-200/70 dark:border-[#252a36]">
                      <span className="text-slate-500 dark:text-slate-400">Ключевая демография</span>
                      <span className="font-bold text-slate-900 dark:text-white">21–38 лет (Ташкент 64%, Самарканд 14%)</span>
                    </div>
                  </div>
                </div>

                {/* Creative Formats Breakdown */}
                <div className="bg-white dark:bg-[#181b20] p-6 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Эффективность форматов Meta Ads
                  </h4>
                  <div className="space-y-3.5">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        <span>Instagram Reels Video (42% бюджета)</span>
                        <span className="text-emerald-600 dark:text-emerald-400">ROAS 4.1x — Макс. результат</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#252a36] h-2.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '42%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        <span>Instagram Feed & Carousel (23.5% бюджета)</span>
                        <span className="text-blue-600 dark:text-blue-400">ROAS 3.4x</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#252a36] h-2.5 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full rounded-full" style={{ width: '23.5%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        <span>Facebook Feed Video & Posts (22.5% бюджета)</span>
                        <span className="text-indigo-600 dark:text-indigo-400">ROAS 3.2x (Врачи & B2B)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#252a36] h-2.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: '22.5%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        <span>Facebook Community & Groups (12% бюджета)</span>
                        <span className="text-purple-600 dark:text-purple-400">ROAS 2.9x</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-[#252a36] h-2.5 rounded-full overflow-hidden">
                        <div className="bg-purple-600 h-full rounded-full" style={{ width: '12%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB 2: INSTAGRAM INFLUENCERS */}
          {metaSubTab === 'influencers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBloggers.map(b => (
                  <div 
                    key={b.id} 
                    onClick={() => setSelectedBloggerModal(b)}
                    className="bg-white dark:bg-[#15181e] p-5 sm:p-6 rounded-2xl border border-slate-200/90 dark:border-[#272b36] shadow-xs hover:shadow-md hover:border-blue-500/80 dark:hover:border-blue-500/50 transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="mb-4">
                        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                          {b.project} • {b.platform}
                        </span>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {b.blogger}
                        </h4>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 p-3 rounded-xl bg-slate-50/80 dark:bg-[#101216] border border-slate-100 dark:border-[#20242f]">
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-0.5">Стоимость</span>
                          <span className="text-base font-bold text-slate-900 dark:text-white">{b.price}</span>
                        </div>
                        <div className="border-x border-slate-200/60 dark:border-[#20242f] px-2">
                          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-0.5">Просмотры</span>
                          <span className="text-base font-bold text-slate-900 dark:text-white">{b.views}</span>
                        </div>
                        <div className="pl-1">
                          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block mb-0.5">Переходы</span>
                          <span className="text-base font-bold text-slate-900 dark:text-white">{(b.profileVisits || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#20242f] flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      <span>Детали интеграции</span>
                      <span>Подробнее →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUBTAB 3: LIVE INSTAGRAM PROFILE LOOKUP & ESTIMATION */}
          {metaSubTab === 'lookup' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white dark:bg-[#181b20] p-6 lg:p-8 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
                <div className="max-w-2xl mb-6">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
                    Live Анализ и Калькулятор профиля Instagram
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Укажите никнейм инфлюенсера для автоматической оценки аудитории, расчетной стоимости интеграции в Узбекистане и прогноза окупаемости для ваших брендов.
                  </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleLookupInstagram} className="flex flex-col sm:flex-row gap-3 mb-4">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                    <input
                      type="text"
                      value={igLookupHandle}
                      onChange={(e) => setIgLookupHandle(e.target.value)}
                      placeholder="shaxzoda__muxammedova"
                      className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-[#121418] border border-slate-200 dark:border-[#2b303c] rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-[#0052cc]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLookingUpIg}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0052cc] hover:bg-[#0747a6] text-white rounded-2xl text-sm font-bold transition shadow-sm cursor-pointer disabled:opacity-60"
                  >
                    {isLookingUpIg ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Анализ...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Проанализировать</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Selection Chips */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
                  <span className="text-slate-400 font-semibold">Быстрый выбор:</span>
                  {[
                    'shaxzoda__muxammedova',
                    'munisarizaeva',
                    'azizamirzaeva',
                    'feruza_normatova',
                    'zarinanizomiddinova'
                  ].map(handle => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => {
                        setIgLookupHandle(handle)
                        api.get('/instagram/lookup', { params: { handle } })
                          .then(res => setIgLookupResult(res.data))
                          .catch(() => {})
                      }}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#222632] dark:hover:bg-[#2a3040] text-slate-700 dark:text-slate-300 rounded-lg font-semibold transition cursor-pointer"
                    >
                      @{handle}
                    </button>
                  ))}
                </div>

                {/* Error Banner */}
                {lookupError && (
                  <div className="p-4 bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-2xl text-sm font-semibold mb-6">
                    {lookupError}
                  </div>
                )}

                {/* Analysis Result Card */}
                {igLookupResult && (
                  <div className="p-6 bg-slate-50 dark:bg-[#121418] rounded-2xl border border-slate-200 dark:border-[#252a36] space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#252a36]">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-[#0052cc] text-white flex items-center justify-center font-black text-lg shadow-sm">
                          {igLookupResult.handle?.slice(0, 2).toUpperCase() || 'IG'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-black text-slate-900 dark:text-white">
                              {igLookupResult.name}
                            </h4>
                            {igLookupResult.is_verified && (
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 text-[10px] font-extrabold">
                                Verified
                              </span>
                            )}
                          </div>
                          <span className="text-xs font-semibold text-slate-400">
                            @{igLookupResult.handle} • {igLookupResult.category}
                          </span>
                        </div>
                      </div>

                      <a
                        href={`https://www.instagram.com/${igLookupResult.handle}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-[#1c202a] hover:bg-slate-100 dark:hover:bg-[#252b3a] border border-slate-200 dark:border-[#2f3545] rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 transition cursor-pointer self-start sm:self-auto"
                      >
                        <span>Открыть в Instagram</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    {/* 4 Core Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-white dark:bg-[#181b20] border border-slate-200/80 dark:border-[#2b303c]">
                        <span className="text-xs text-slate-400 font-semibold block mb-1">Подписчики</span>
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                          {igLookupResult.followers}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5 uppercase">
                          {igLookupResult.tier}
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-white dark:bg-[#181b20] border border-slate-200/80 dark:border-[#2b303c]">
                        <span className="text-xs text-slate-400 font-semibold block mb-1">Вовлечение (ER)</span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                          {igLookupResult.engagement_rate}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
                          Высокий интерес
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-white dark:bg-[#181b20] border border-slate-200/80 dark:border-[#2b303c]">
                        <span className="text-xs text-slate-400 font-semibold block mb-1">Просмотры Reels</span>
                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                          {igLookupResult.avg_views_reels}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                          В среднем на ролик
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-white dark:bg-[#181b20] border border-slate-200/80 dark:border-[#2b303c]">
                        <span className="text-xs text-slate-400 font-semibold block mb-1">Точность модели</span>
                        <span className="text-2xl font-black text-purple-600 dark:text-purple-400">
                          {Math.round((igLookupResult.confidence || 0.95) * 100)}%
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                          Meta Graph Benchmark
                        </span>
                      </div>
                    </div>

                    {/* Pricing Estimates */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-white dark:bg-[#181b20] border border-slate-200/80 dark:border-[#2b303c]">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block mb-0.5">Расчетная цена за Reels</span>
                        <span className="text-xl font-black text-slate-900 dark:text-white">
                          ${igLookupResult.estimated_cost_per_reel}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">1 ролик с закреплением</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block mb-0.5">Расчетная цена за Stories</span>
                        <span className="text-xl font-black text-slate-900 dark:text-white">
                          ${igLookupResult.estimated_cost_per_story}
                        </span>
                        <span className="text-[11px] text-slate-400 block mt-0.5">Серия из 3 историй + стикер</span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-400 font-semibold block mb-0.5">Рекомендуемый фокус</span>
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 block mt-1">
                          Reels + промокод со скидкой
                        </span>
                      </div>
                    </div>

                    {/* Audience Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-white dark:bg-[#181b20] rounded-xl border border-slate-200/70 dark:border-[#252a36]">
                        <span className="text-slate-400 font-semibold block mb-1">География аудитории</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{igLookupResult.top_geo}</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#181b20] rounded-xl border border-slate-200/70 dark:border-[#252a36]">
                        <span className="text-slate-400 font-semibold block mb-1">Возрастная структура</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{igLookupResult.audience_age}</span>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#181b20] rounded-xl border border-slate-200/70 dark:border-[#252a36]">
                        <span className="text-slate-400 font-semibold block mb-1">Гендерное соотношение</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{igLookupResult.audience_gender}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BLOGGER DETAILS MODAL (PROFESSIONAL SAAS STANDARD) */}
          {selectedBloggerModal && (
            <div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-fade-in"
              onClick={() => setSelectedBloggerModal(null)}
            >
              <div 
                className="bg-white dark:bg-[#16181f] w-full max-w-2xl lg:max-w-3xl rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-[#2b303c] shadow-2xl relative max-h-[90vh] overflow-y-auto space-y-6 text-slate-900 dark:text-white"
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-[#242833]">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold border border-blue-200/60 dark:border-blue-800/40 flex items-center justify-center text-lg shrink-0">
                      {selectedBloggerModal.blogger?.slice(0, 2).toUpperCase() || 'BL'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {selectedBloggerModal.project} • {selectedBloggerModal.platform} • {selectedBloggerModal.category}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                        {selectedBloggerModal.blogger}
                      </h3>
                      <a
                        href={selectedBloggerModal.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline mt-0.5"
                      >
                        <span>{selectedBloggerModal.handle}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-start">
                    <a
                      href={selectedBloggerModal.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0052cc] text-white hover:bg-[#0747a6] text-xs font-semibold transition-all shadow-sm cursor-pointer"
                      title="Открыть страницу блогера в новой вкладке"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Открыть профиль</span>
                    </a>

                    <button 
                      type="button"
                      onClick={() => setSelectedBloggerModal(null)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#20242e] rounded-lg transition-colors cursor-pointer"
                      title="Закрыть"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Section 1: 3 Core Primary KPIs */}
                <div className="grid grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111317] border border-slate-200/80 dark:border-[#222632]">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Стоимость
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedBloggerModal.price}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      Бюджет интеграции
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111317] border border-slate-200/80 dark:border-[#222632]">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Просмотры видео
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {selectedBloggerModal.views}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      С наших роликов
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#111317] border border-slate-200/80 dark:border-[#222632]">
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                      Переходы
                    </span>
                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                      {(selectedBloggerModal.profileVisits || 0).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block mt-0.5">
                      Трафик / клики в профиль
                    </span>
                  </div>
                </div>

                {/* Section 2: Secondary Performance & Audience Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-50/70 dark:bg-[#111317]/70 border border-slate-200/70 dark:border-[#222632]">
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">Аудитория канала</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">{selectedBloggerModal.followers}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">Охват публикации</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">{selectedBloggerModal.reach}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">ER (Вовлечение)</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">{selectedBloggerModal.er}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">Заказы (Продажи)</span>
                    <span className="text-base font-bold text-slate-800 dark:text-slate-200">{selectedBloggerModal.promoSales}</span>
                  </div>
                </div>

                {/* Section 3: Financial ROI & Unit Economics */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-[#111317] border border-slate-200/80 dark:border-[#222632]">
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Выручка по промокоду</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{selectedBloggerModal.revenue}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Окупаемость (ROI)</span>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selectedBloggerModal.roi}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Цена перехода (CPC)</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      ${selectedBloggerModal.profileVisits ? (selectedBloggerModal.priceNum / selectedBloggerModal.profileVisits).toFixed(2) : '0.16'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 block mb-0.5">Цена за просмотр (CPV)</span>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">$0.004</span>
                  </div>
                </div>

                {/* Section 4: Campaign Details Spec Table */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#20242e]">
                    <span className="text-slate-500 dark:text-slate-400">Формат интеграции</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedBloggerModal.format}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#20242e]">
                    <span className="text-slate-500 dark:text-slate-400">География аудитории</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedBloggerModal.geo}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#20242e]">
                    <span className="text-slate-500 dark:text-slate-400">Демография аудитории</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedBloggerModal.demographics}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#20242e]">
                    <span className="text-slate-500 dark:text-slate-400">Дата публикации</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedBloggerModal.publishDate}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100 dark:border-[#20242e]">
                    <span className="text-slate-500 dark:text-slate-400">Ответственный менеджер</span>
                    <span className="font-semibold text-slate-900 dark:text-white">{selectedBloggerModal.manager}</span>
                  </div>
                </div>

                {/* Section 5: Campaign Notes */}
                {selectedBloggerModal.notes && (
                  <div className="p-3.5 rounded-xl bg-slate-50/60 dark:bg-[#111317]/60 border border-slate-200/70 dark:border-[#222632] text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                      Заметка по интеграции:
                    </span>
                    {selectedBloggerModal.notes}
                  </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#242833]">
                  <a
                    href={selectedBloggerModal.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                  >
                    <span>Открыть аккаунт блогера</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-2.5">
                    {selectedBloggerModal.postUrl && (
                      <a
                        href={selectedBloggerModal.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-[#20242e] text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-[#282d3a] transition-colors"
                      >
                        Смотреть пост ↗
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setSelectedBloggerModal(null)}
                      className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Закрыть
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PARTNERS & VENUES */}
      {activeReportTab === 'companies' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white dark:bg-[#181b20] p-6 lg:p-7 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-1">
              Партнёрские заведения, Отели и B2B локации
            </h2>
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6">
              Спецпроекты, дистрибуция брендированных материалов и тейбл-тентов
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredCompanies.map(c => (
                <div 
                  key={c.id} 
                  className="bg-slate-50 dark:bg-[#121418] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-[#2b303c] flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-300 uppercase tracking-wider border border-indigo-200/60 dark:border-indigo-800/50">
                          {c.project} • {c.category}
                        </span>
                        <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-2">
                          {c.name}
                        </h4>
                        <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{c.location}</p>
                      </div>
                      <span className="text-xs font-black px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 shrink-0 border border-indigo-200 dark:border-indigo-800">
                        {c.status}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#181b20] p-4 rounded-2xl border border-slate-200/80 dark:border-[#2b303c] my-3 leading-relaxed">
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Предоставленные материалы:</span>
                      {c.itemsProvided}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-[#262a35] flex flex-wrap items-center justify-between text-sm font-semibold text-slate-500 dark:text-slate-400 gap-2">
                    <span>Контакт: <strong className="text-slate-900 dark:text-white font-bold">{c.contactPerson}</strong> ({c.phone})</span>
                    <span>Бюджет: <strong className="text-slate-900 dark:text-white font-black text-base">{c.spent}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: COMPACT RNP TABLE */}
      {activeReportTab === 'rnp_table' && (
        <div className="space-y-6 animate-fade-in">
          {/* RNP Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#181b20] p-5 rounded-3xl border border-slate-200/90 dark:border-[#2b303c] shadow-sm">
            <div className="flex items-center gap-2.5 flex-1 max-w-lg">
              <Search className="w-5 h-5 text-slate-400 shrink-0 ml-1" />
              <input
                type="text"
                placeholder="Поиск по показателю, роли или имени..."
                value={rnpSearch}
                onChange={(e) => setRnpSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#121418] border border-slate-200 dark:border-[#2b303c] rounded-xl px-4 py-2 text-sm font-semibold text-slate-900 dark:text-white focus:outline-hidden focus:border-indigo-500 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={rnpSectionFilter}
                onChange={(e) => setRnpSectionFilter(e.target.value)}
                className="bg-slate-50 dark:bg-[#121418] border border-slate-200 dark:border-[#2b303c] rounded-xl px-3.5 py-2 text-sm font-bold text-slate-800 dark:text-slate-100 focus:outline-hidden cursor-pointer"
              >
                <option value="ALL">Все категории РНП</option>
                <option value="visits">Визиты и Активности</option>
                <option value="prescriptions">Рецептурный надзор</option>
                <option value="reps">Медицинские представители</option>
                <option value="merch">Мерчендайзинг</option>
                <option value="ecommerce">E-Commerce & Аптеки</option>
                <option value="smm">SMM и Блогеры</option>
                <option value="promo">Спецпроекты / Промо</option>
              </select>

              <span className="text-sm font-bold text-slate-400 shrink-0">
                Найдено: {filteredRnp.length}
              </span>
            </div>
          </div>

          {/* Compact Clean Table */}
          <div className="bg-white dark:bg-[#181b20] rounded-3xl border border-slate-200/90 dark:border-[#2b303c] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#121418] border-b border-slate-200 dark:border-[#2b303c] text-slate-500 dark:text-slate-400">
                    <th className="py-4 px-5 font-bold">Показатель / Задача</th>
                    <th className="py-4 px-4 font-bold">Ответственный</th>
                    <th className="py-4 px-4 font-bold text-center">План</th>
                    <th className="py-4 px-4 font-bold text-center">Факт</th>
                    <th className="py-4 px-5 font-bold text-center">% Выполнения</th>
                    <th className="py-4 px-4 font-bold text-center">Прогноз</th>
                    <th className="py-4 px-5 font-bold text-center">W1 - W5</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#262a35]">
                  {filteredRnp.slice(0, 35).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-[#20242e]/60 transition">
                      <td className="py-4 px-5 font-bold text-slate-900 dark:text-white">
                        <div>
                          <span className="text-sm sm:text-base font-bold">{item.indicator}</span>
                          <span className="text-xs text-slate-400 block font-medium mt-0.5">{item.sectionName}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-700 dark:text-slate-200 font-semibold">
                        <div>
                          <span>{item.person || '—'}</span>
                          <span className="text-xs text-slate-400 block font-normal">{item.role || '—'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-800 dark:text-slate-200">
                        {item.planMonth}
                      </td>
                      <td className="py-4 px-4 text-center font-black text-slate-900 dark:text-white">
                        {item.factMonth}
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center justify-center gap-2.5">
                          <div className="w-20 bg-slate-100 dark:bg-[#2b303c] h-2.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                item.percentMonth >= 80
                                  ? 'bg-emerald-500'
                                  : item.percentMonth >= 35
                                  ? 'bg-amber-400'
                                  : 'bg-red-500'
                              }`} 
                              style={{ width: `${Math.min(item.percentMonth, 100)}%` }} 
                            />
                          </div>
                          <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white w-9">
                            {item.percentMonth}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                        {item.forecast}
                      </td>
                      <td className="py-4 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-400">
                          <span className={item.w1 && Number(item.w1.fact) >= Number(item.w1.plan) ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>W1</span>•
                          <span className={item.w2 && Number(item.w2.fact) >= Number(item.w2.plan) ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>W2</span>•
                          <span className={item.w3 && Number(item.w3.fact) >= Number(item.w3.plan) ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>W3</span>•
                          <span className={item.w4 && Number(item.w4.fact) >= Number(item.w4.plan) ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>W4</span>•
                          <span className={item.w5 && Number(item.w5.fact) >= Number(item.w5.plan) ? 'text-emerald-600 dark:text-emerald-400 font-black' : ''}>W5</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
