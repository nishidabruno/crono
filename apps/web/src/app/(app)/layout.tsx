import { redirect } from 'next/navigation'

import { isAuthenticated } from '@/auth/auth'
// import { Sidebar } from '@/components/sidebar'

export default function AppLayout({
  children,
  sheet,
}: Readonly<{
  children: React.ReactNode
  sheet: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="flex min-h-screen">
      {/* <Sidebar /> */}
      {children}
      {sheet}
    </div>
  )
}
