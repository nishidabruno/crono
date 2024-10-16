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
          <ProjectCard
            title="ChronoSync"
            lastUpdated="Last updated: Today, 11:43"
          />
          <ProjectCard
            title="Eventrix"
            lastUpdated="Last updated: Today, 10:20"
          />
          <ProjectCard
            title="TimeWave"
            lastUpdated="Last updated: Today, 9:49"
          />
          <ProjectCard
            title="TaskFlow"
            lastUpdated="Last updated: Today, 8:26"
          />
          <ProjectCard
            title="OrbitPlanner"
            lastUpdated="Last updated: Today, 8:19"
          />
        </div>
        <h2 className="mt-4 text-xl font-medium">Calendar</h2>
        <Calendar />
      </main>
    </>
  )
}
