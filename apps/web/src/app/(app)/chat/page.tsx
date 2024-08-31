import Link from 'next/link'

import { Chat } from '@/components/chat'
import { Sidebar } from '@/components/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default async function ChatPage() {
  return (
    <>
      <Sidebar />

      <main className="flex flex-col p-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Chat</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div>
          <Chat />
        </div>
      </main>
    </>
  )
}
