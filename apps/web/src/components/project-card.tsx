import Link from 'next/link'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function ProjectCard() {
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
          <span className="">デザイン ショット</span>
          <span className="text-sm text-muted-foreground">
            最終更新: 今日、11:43
          </span>
        </div>
      </div>
    </Link>
  )
}
