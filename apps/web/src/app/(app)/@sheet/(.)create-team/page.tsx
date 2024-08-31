import { ParallelSheet } from '@/components/parallel-sheet'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { CreateTeamForm } from '../../create-team/create-team-form'

export default function CreateTeam() {
  return (
    <Sheet defaultOpen>
      <ParallelSheet>
        <SheetHeader>
          <SheetTitle>Create team</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <CreateTeamForm />
        </div>
      </ParallelSheet>
    </Sheet>
  )
}
