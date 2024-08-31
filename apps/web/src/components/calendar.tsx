import { ChevronLeft, ChevronRight, CirclePlus, Filter } from 'lucide-react'

import { CalendarDataCell } from './calendar/calendar-data-cell'
import { CalendarHeaderCell } from './calendar/calendar-header-cell'
import { CalendarNote } from './calendar/calendar-note'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

export function Calendar() {
  return (
    <div className="">
      <header className="flex items-center justify-between">
        <div className="p-4">
          <span className="text-xl">2024年8月</span>
        </div>
        <div className="flex gap-2">
          <div className="flex h-9 items-center gap-2 rounded-md bg-muted p-2 text-sm">
            <div>
              <span className="rounded-md p-1 px-3">日</span>
            </div>
            <div>
              <span className="rounded-md bg-muted-foreground p-1 px-3 font-medium text-muted">
                週
              </span>
            </div>
            <div>
              <span className="rounded-md p-1 px-3">月</span>
            </div>
          </div>
          <Button size="sm" variant="secondary">
            <Filter className="mr-2 size-4" />
            フィルター
          </Button>
          <Button size="sm">
            <CirclePlus className="mr-2 size-4" />
            新規追加
          </Button>
        </div>
      </header>

      <table>
        <thead>
          <tr>
            <th className="border p-4 text-sm font-normal">
              <div className="flex">
                <div className="flex-1">
                  <Button variant="ghost">
                    <ChevronLeft className="size-6" />
                  </Button>
                </div>
                <div>
                  <Separator orientation="vertical" />
                </div>
                <div className="flex-1">
                  <Button variant="ghost">
                    <ChevronRight className="size-6" />
                  </Button>
                </div>
              </div>
            </th>

            <CalendarHeaderCell day="月 24" />
            <CalendarHeaderCell day="火 25" />
            <CalendarHeaderCell day="水 26" />
            <CalendarHeaderCell day="木 27" />
            <CalendarHeaderCell day="金 28" />
            <CalendarHeaderCell day="土 29" />
            <CalendarHeaderCell day="日 30" />
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="border p-2 text-center">8時</td>
            <CalendarDataCell>
              <CalendarNote color="indigo" />
              <CalendarNote color="emerald" />
            </CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote color="indigo" />
            </CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote />
            </CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote color="emerald" />
              <CalendarNote />
            </CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
          </tr>
          <tr>
            <td className="border border-t-0 p-2 text-center">9時</td>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote />
            </CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote />
            </CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote color="emerald" />
            </CalendarDataCell>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
