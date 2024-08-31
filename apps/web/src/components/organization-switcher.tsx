import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { getTeams } from '@/http/get-teams'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export async function TeamSwitcher() {
  const { teams } = await getTeams()

  return (
    <DropdownMenu>
      <div className="rounded-md bg-accent p-[1px] shadow-sm">
        <div className="rounded-md bg-background p-1">
          <DropdownMenuTrigger className="flex w-[168px] items-center gap-2 rounded p-1 text-sm font-medium outline-none transition-colors hover:bg-accent">
            <span className="text-muted-foreground">チームを選択</span>
            <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            alignOffset={-16}
            sideOffset={12}
            className="w-[200px]"
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>チームリスト</DropdownMenuLabel>

              {teams.map((team) => (
                <DropdownMenuItem key={team.id} asChild>
                  <Link href={`/team/${team.slug}`}>
                    <Avatar className="mr-2 size-4">
                      {team.avatarUrl && <AvatarImage src={team.avatarUrl} />}
                      <AvatarFallback />
                    </Avatar>
                    <span className="line-clamp-1">{team.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/create-team">
                <PlusCircle className="mr-2 size-4" />
                新しいチーム
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </div>
    </DropdownMenu>
  )
}
