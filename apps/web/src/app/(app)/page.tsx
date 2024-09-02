import { Calendar } from '@/components/calendar'
import { ProjectCard } from '@/components/project-card'
import { Sidebar } from '@/components/sidebar'

export default async function Home() {
  return (
    <>
      <Sidebar />

      <main className="m-4 flex flex-col">
        <h2 className="text-xl font-medium">Projects</h2>
        <div className="mt-4 flex gap-2">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </div>
        <h2 className="mt-4 text-xl font-medium">Calendar</h2>
        <Calendar />
      </main>
    </>
  )
}
