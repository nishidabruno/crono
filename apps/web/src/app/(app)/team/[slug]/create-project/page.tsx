import Link from 'next/link'

import { Sidebar } from '@/components/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { CreateProjectForm } from './create-project-form'

export default async function CreateProject() {
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
            <BreadcrumbItem>Create project</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="mt-4 w-full">
          <h1 className="text-3xl font-medium">Create Project</h1>
          <p className="text-muted-foreground">Create a new project</p>

          <CreateProjectForm />
        </div>
      </main>
    </>
  )
}
