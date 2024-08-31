import { ChevronDown, LogOut, Settings } from 'lucide-react'
import Link from 'next/link'

import { auth } from '@/auth/auth'
import { getNameInitials } from '@/utils/get-name-initials'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export async function ProfileButton() {
  const { user } = await auth()

  return (
    <DropdownMenu>
      {/* <div className="rounded-md p-[1px] shadow-sm hover:bg-accent"> */}
      <div className="rounded-md shadow-sm hover:bg-accent">
        <div className="rounded-md bg-background p-1">
          <DropdownMenuTrigger className="flex items-center gap-3 rounded-md bg-background px-2.5 py-2 outline-none transition-colors hover:bg-accent">
            <Avatar className="size-9">
              {user.avatarUrl && <AvatarImage src={user.avatarUrl} />}
              {user.name && (
                <AvatarFallback>{getNameInitials(user.name)}</AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>

            <ChevronDown className="size-4 text-muted-foreground" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={12}>
            <DropdownMenuItem asChild>
              <Link href="/">
                <Settings className="mr-2 size-4" />
                設定
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {/* Needs to be '<a>' instead of '<Link />' to avoid pre-fetch of the logout */}
              <a href="/api/auth/sign-out">
                <LogOut className="mr-2 size-4" />
                ログアウト
              </a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </div>
    </DropdownMenu>
  )
}
