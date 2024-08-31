interface CalendarHeaderCellProps {
  day: string
}

export function CalendarHeaderCell({ day }: CalendarHeaderCellProps) {
  return <th className="min-w-32 border p-4 px-9 text-sm font-normal">{day}</th>
}
