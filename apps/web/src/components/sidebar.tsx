import {
  BotMessageSquare,
  Calendar,
  File,
  Folders,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'
// import { headers } from 'next/headers'
import Link from 'next/link'

import { ability } from '@/auth/auth'

import { TeamSwitcher } from './team-switcher'
import { Button } from './ui/button'
import { UserSettings } from './user-settings'

export async function Sidebar() {
  const permissions = await ability()

  // const pathname = headers().get('x-pathname')
  // console.log(pathname)

  return (
    <div className="flex min-w-[280px] max-w-[260px] flex-col p-4">
      <TeamSwitcher />

      {/* Main menu */}
      <div className="mt-4">
        <span className="text-xs font-medium tracking-wider text-muted-foreground">
          メニュー
        </span>

        <div className="mt-4 flex flex-col gap-1 px-3">
          <Button
            size="sm"
            variant="ghost"
            className="flex justify-start gap-4 text-muted-foreground"
            asChild
          >
            <Link href="/">
              <LayoutDashboard className="size-5" />
              ダッシュボード
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex justify-start gap-4 text-muted-foreground"
            asChild
          >
            <Link href="/calendar">
              <Calendar className="size-5" />
              カレンダー
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex justify-start gap-4 text-muted-foreground"
            asChild
          >
            <Link href="/projects">
              <Folders className="size-5" />
              プロジェクト
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex justify-start gap-4 text-muted-foreground"
            asChild
          >
            <Link href="/members">
              <Users className="size-5" />
              メンバー
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex justify-start gap-4 text-muted-foreground"
            asChild
          >
            <Link href="/chat">
              <BotMessageSquare className="size-5" />
              チャット
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex justify-start gap-4 text-muted-foreground"
            asChild
          >
            <Link href="/settings">
              <Settings className="size-5" />
              設定
            </Link>
          </Button>
        </div>
      </div>

      {/* Projects */}
      <div className="mt-4">
        <span className="text-xs font-medium tracking-wider text-muted-foreground">
          プロジェクト
        </span>

        <div className="mt-4 flex flex-col gap-1 px-3">
          {permissions?.can('get', 'Project') && ' Allowed to list projects.'}
          <Button
            size="sm"
            variant="ghost"
            className="flex justify-start gap-4 text-muted-foreground"
            asChild
          >
            <Link href="/projects">
              <File className="size-5" />
              冷凍機
            </Link>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex justify-start gap-4 text-muted-foreground"
            asChild
          >
            <Link href="/projects">
              <File className="size-5" />
              そば切り機
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-auto flex justify-between">
        <UserSettings />
        {/* <ThemeSwitcher /> */}
      </div>
    </div>
  )
}
