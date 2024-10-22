import { PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { ability } from '@/auth/auth'
import { ProjectsList } from '@/components/projects-list'
import { Sidebar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'

export default async function ProjectsPage() {
  const permissions = await ability()
  return (
    <>
      <Sidebar />

      <main className="flex flex-col p-4">
        <div className="flex justify-between">
          <h2 className="text-2xl font-medium">Projects</h2>
          <Link href="create-project">
            <Button className="gap-2">
              <PlusCircle className="size-5" />
              New Project
            </Button>
          </Link>
        </div>
        {permissions?.can('get', 'Project') ? (
          <ProjectsList />
        ) : (
          <div>
            <p>Please select a team.</p>
          </div>
        )}
      </main>
    </>
  )
}
