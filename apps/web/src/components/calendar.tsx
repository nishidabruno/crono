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
          <span className="text-xl">September 2024</span>
        </div>
        <div className="flex gap-2">
          <div className="flex h-9 items-center gap-2 rounded-md bg-muted p-2 text-sm">
            <div>
              <span className="rounded-md p-1 px-3">Day</span>
            </div>
            <div>
              <span className="rounded-md bg-muted-foreground p-1 px-3 font-medium text-muted">
                Week
              </span>
            </div>
            <div>
              <span className="rounded-md p-1 px-3">Month</span>
            </div>
          </div>
          <Button size="sm" variant="secondary">
            <Filter className="mr-2 size-4" />
            Filter
          </Button>
          <Button size="sm">
            <CirclePlus className="mr-2 size-4" />
            New
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

            <CalendarHeaderCell day="Mon 24" />
            <CalendarHeaderCell day="Tue 25" />
            <CalendarHeaderCell day="Wed 26" />
            <CalendarHeaderCell day="Thu 27" />
            <CalendarHeaderCell day="Fri 28" />
            <CalendarHeaderCell day="Sat 29" />
            <CalendarHeaderCell day="Sun 30" />
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="border p-2 text-center">8AM</td>
            <CalendarDataCell>
              <CalendarNote color="indigo" time="8AM" title="Sprint Planning" />
              <CalendarNote
                color="emerald"
                time="8AM"
                title="API Integration Review"
              />
            </CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote
                color="indigo"
                time="8AM"
                title="UI/UX Design Sync"
              />
            </CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote
                time="8AM"
                title="Performance Optimization Discussion "
              />
            </CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote color="emerald" time="8AM" title="Team Standup" />
              <CalendarNote time="8AM" title="Cross-Team Collaboration" />
            </CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
          </tr>
          <tr>
            <td className="border border-t-0 p-2 text-center">9AM</td>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote time="9AM" title="QA Testing Session" />
            </CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote time="9AM" title="Time Zone Handling Deep Dive" />
            </CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell></CalendarDataCell>
            <CalendarDataCell>
              <CalendarNote
                color="emerald"
                time="9AM"
                title="Release Planning"
              />
            </CalendarDataCell>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
