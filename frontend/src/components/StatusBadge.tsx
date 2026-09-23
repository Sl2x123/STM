import React from 'react'

export interface StatusBadgeProps {
  status: string
  onClick?: (e: React.MouseEvent) => void
  size?: 'sm' | 'md'
  className?: string
  title?: string
}

interface StatusStyle {
  label: string
  dotClass: string
  badgeClass: string
}

export function getStatusStyle(rawStatus: string): StatusStyle {
  const s = (rawStatus || '').trim().toLowerCase()

  // 1. DONE / ВЫПОЛНЕНО / ВЫШЕЛ ПОСТ / ЗАВЕРШЕНО
  if (s === 'done' || s === 'выполнено' || s === 'завершено' || s === 'вышел пост' || s === 'ready') {
    return {
      label: rawStatus || 'Done',
      dotClass: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
    }
  }

  // 2. IN PROCESS / IN PROGRESS / В ПРОЦЕССЕ / В РАБОТЕ / В ГРАФИКЕ
  if (
    s === 'in process' || 
    s === 'in progress' || 
    s === 'в процессе' || 
    s === 'в работе' || 
    s === 'в графике'
  ) {
    return {
      label: rawStatus === 'In Progress' ? 'In Process' : (rawStatus || 'In Process'),
      dotClass: 'bg-blue-600',
      badgeClass: 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400',
    }
  }

  // 3. REJECTED / ОТКЛОНЕНО / ОТМЕНЕНО
  if (s === 'rejected' || s === 'отклонено' || s === 'отменено' || s === 'failed') {
    return {
      label: rawStatus || 'Rejected',
      dotClass: 'bg-rose-500',
      badgeClass: 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400',
    }
  }

  // 4. NOT DONE / НЕ НАЧАТО / ЧЕРНОВИК / НОВЫЙ
  if (s === 'not done' || s === 'не начато' || s === 'черновик' || s === 'новый') {
    return {
      label: rawStatus || 'Not Done',
      dotClass: 'bg-slate-500',
      badgeClass: 'bg-slate-100 dark:bg-[#202530] text-slate-700 dark:text-slate-300',
    }
  }

  // 5. ПЕРЕДАНО / ПРЕДОСТАВЛЕНО / МАТЕРИАЛЫ ПЕРЕДАНЫ (Indigo)
  if (s === 'передано' || s === 'предоставлено' || s === 'материалы переданы') {
    return {
      label: rawStatus,
      dotClass: 'bg-indigo-600',
      badgeClass: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400',
    }
  }

  // 6. СОГЛАСОВАНО / ДОГОВОРИЛИСЬ (Amber)
  if (s === 'согласовано' || s === 'договорились') {
    return {
      label: rawStatus,
      dotClass: 'bg-amber-500',
      badgeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400',
    }
  }

  // 6.1. АКТИВНО / ACTIVE (Emerald)
  if (s === 'активно' || s === 'active') {
    return {
      label: rawStatus,
      dotClass: 'bg-emerald-500',
      badgeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400',
    }
  }

  // 7. ОПЛАЧЕНО (Teal)
  if (s === 'оплачено') {
    return {
      label: rawStatus,
      dotClass: 'bg-teal-600',
      badgeClass: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400',
    }
  }

  // 8. ПЕРЕГОВОРЫ (Purple)
  if (s === 'переговоры') {
    return {
      label: rawStatus,
      dotClass: 'bg-purple-600',
      badgeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400',
    }
  }

  // Default fallback (Slate)
  return {
    label: rawStatus || 'Not Done',
    dotClass: 'bg-slate-400',
    badgeClass: 'bg-slate-100 dark:bg-[#202530] text-slate-700 dark:text-slate-300',
  }
}

export default function StatusBadge({
  status,
  onClick,
  size = 'md',
  className = '',
  title,
}: StatusBadgeProps) {
  const { label, dotClass, badgeClass } = getStatusStyle(status)
  const isInteractive = Boolean(onClick)

  const sizeClasses = size === 'sm' 
    ? 'px-2.5 py-0.5 text-[11px] gap-1.5' 
    : 'px-3.5 py-1 text-xs gap-2'

  return (
    <span
      onClick={onClick}
      title={title || (isInteractive ? 'Нажмите, чтобы переключить статус' : undefined)}
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap transition-all ${sizeClasses} ${badgeClass} ${
        isInteractive ? 'cursor-pointer hover:opacity-85 select-none active:scale-95' : ''
      } ${className}`}
    >
      <span className={`w-2 h-2 rounded-full shrink-0 ${dotClass}`} />
      <span>{label}</span>
    </span>
  )
}
