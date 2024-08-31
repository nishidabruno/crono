import { ChevronsUpDown, PlusCircle } from 'lucide-react'
import Link from 'next/link'

import { getCurrentTeamSlug } from '@/auth/auth'
import { getTeams } from '@/http/get-teams'
import { getNameInitials } from '@/utils/get-name-initials'

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

  const currentTeamSlug = getCurrentTeamSlug()
  const currentTeam = teams.find((team) => team.slug === currentTeamSlug)

  return (
    <DropdownMenu>
      <div className="rounded-md bg-accent p-[1px] shadow-sm">
        <div className="rounded-md bg-background p-1">
          <DropdownMenuTrigger className="flex w-[238px] items-center gap-2 rounded p-1 text-sm font-medium outline-none transition-colors hover:bg-accent">
            {currentTeam ? (
              <>
                <Avatar className="mr-2 size-4">
                  {currentTeam.avatarUrl && (
                    <AvatarImage src={currentTeam.avatarUrl} />
                  )}
                  {currentTeam.name && (
                    <AvatarFallback>
                      {getNameInitials(currentTeam.name)}
                    </AvatarFallback>
                  )}
                </Avatar>

                <span className="trucate">{currentTeam.name}</span>
              </>
            ) : (
              <span className="text-muted-foreground">チームを選択</span>
            )}
            <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            alignOffset={-4}
            sideOffset={12}
            className="w-[200px]"
          >
            {currentTeam && (
              <DropdownMenuGroup>
                <DropdownMenuLabel>現在のチーム</DropdownMenuLabel>

                <DropdownMenuItem asChild>
                  <Link href={`/team/${currentTeam.slug}`}>
                    <Avatar className="mr-2 size-4">
                      {currentTeam.avatarUrl && (
                        <AvatarImage src={currentTeam.avatarUrl} />
                      )}
                      <AvatarFallback />
                    </Avatar>
                    <span className="line-clamp-1">{currentTeam.name}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            )}
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                {currentTeam ? '他のチーム' : 'チームリスト'}
              </DropdownMenuLabel>

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
