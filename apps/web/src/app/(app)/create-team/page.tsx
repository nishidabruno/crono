import Link from 'next/link'

import { Sidebar } from '@/components/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { CreateTeamForm } from './create-team-form'

export default async function CreateTeam() {
  return (
    <>
      <Sidebar />

      <main className="flex w-full flex-col p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Create team</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-4 w-full">
          <h1 className="text-3xl font-medium">Create Team</h1>
          <p className="text-muted-foreground">Create a new team</p>

          <CreateTeamForm />
        </div>
      </main>
    </>
  )
}
