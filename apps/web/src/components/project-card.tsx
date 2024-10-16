import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

interface ProjectCardProps {
  title: string
  lastUpdated: string
}

export function ProjectCard({ title, lastUpdated }: ProjectCardProps) {
  return (
    <Link href="/project">
      <div className="flex items-center gap-3 rounded-md border p-3 transition-colors hover:bg-muted">
        <div>
          <Avatar>
            <AvatarImage />
            <AvatarFallback />
          </Avatar>
        </div>

        <div className="flex flex-col">
          <span className="">{title}</span>
          <span className="text-sm text-muted-foreground">{lastUpdated}</span>
        </div>
      </div>
    </Link>
  )
}
