import type { ReactNode } from 'react'

interface CalendarDataCellProps {
  children?: ReactNode
}

export function CalendarDataCell({ children }: CalendarDataCellProps) {
  return (
    <td className="space-y-2 border border-t-0 p-2">{children}</td>
    // <td className="">
    //   <div className="aspect-square w-full border">{children}</div>
    // </td>
  )
}
