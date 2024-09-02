import { ChevronUp, LogOut } from 'lucide-react'

import { auth } from '@/auth/auth'
import { getNameInitials } from '@/utils/get-name-initials'

import { ThemeSwitcher } from './theme/theme-switcher'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export async function UserSettings() {
  const { user } = await auth()

  return (
    <DropdownMenu>
      <div className="rounded-md bg-background">
        <DropdownMenuTrigger className="flex w-[238px] items-center gap-2 rounded p-2 text-sm font-medium outline-none transition-colors hover:bg-accent">
          <Avatar className="size-9">
            {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
            {user.name && (
              <AvatarFallback>{getNameInitials(user.name)}</AvatarFallback>
            )}
          </Avatar>

          <div className="flex flex-col items-start gap-0.5">
            <span className="text-sm font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>

          <ChevronUp className="ml-auto size-4 text-muted-foreground" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          alignOffset={-4}
          sideOffset={12}
          className="w-[200px]"
        >
          <DropdownMenuGroup className="flex justify-start">
            {/* TODO: enable again after making theme switch work */}
            <DropdownMenuItem asChild disabled={true}>
              <div className="w-full">
                <ThemeSwitcher />
                Switch theme
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/api/auth/sign-out">
              <LogOut className="mr-2 size-4" />
              Logout
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  )
}
