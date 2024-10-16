interface CalendarNoteProps {
  color?: 'violet' | 'indigo' | 'emerald'
  time: string
  title: string
}

export function CalendarNote({
  color = 'violet',
  time,
  title,
}: CalendarNoteProps) {
  const colorVariantsTop = {
    violet:
      'border-b-violet-800 bg-violet-400 text-violet-800 shadow-violet-200',
    indigo:
      'border-b-indigo-800 bg-indigo-400 text-indigo-800 shadow-indigo-200',
    emerald:
      'border-b-emerald-800 bg-emerald-400 text-emerald-800 shadow-emerald-200',
  }
  const colorVariantsBottom = {
    violet: 'bg-violet-200 text-violet-800',
    indigo: 'bg-indigo-200 text-indigo-800',
    emerald: 'bg-emerald-200 text-emerald-800',
  }

  return (
    <div>
      <div
        className={`${colorVariantsTop[color]} rounded-t border-dashed px-3 py-1 text-sm shadow-inner`}
      >
        <span>{time}</span>
      </div>
      <div
        className={`${colorVariantsBottom[color]} min-h-10 max-w-40 rounded-b p-2`}
      >
        <span>{title}</span>
      </div>
    </div>
  )
}
