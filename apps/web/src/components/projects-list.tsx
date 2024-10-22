'use client'

import { ProjectCard } from './project-card'

export function ProjectsList() {
  return (
    <>
      <div className="mt-4 flex gap-2">
        <ProjectCard
          title="ChronoSync"
          lastUpdated="Last updated: Today, 11:43"
        />
        <ProjectCard
          title="Eventrix"
          lastUpdated="Last updated: Today, 10:20"
        />
        <ProjectCard title="TimeWave" lastUpdated="Last updated: Today, 9:49" />
        <ProjectCard title="TaskFlow" lastUpdated="Last updated: Today, 8:26" />
        <ProjectCard
          title="OrbitPlanner"
          lastUpdated="Last updated: Today, 8:19"
        />
      </div>
    </>
  )
}
