'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import googleIcon from '@/assets/google-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useFormState } from '@/hooks/user-form-state'

import { signInWithGoogle } from '../actions'
import { signInWithEmailAndPassword } from './actions'

export function SignInForm() {
  const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    () => {
      router.push('/')
    },
  )

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {success === false && message && (
          <Alert variant="destructive">
            <AlertTriangle className="size-4" />
            <AlertTitle>ログインできませんでした。</AlertTitle>
            <AlertDescription>
              <p>{message}</p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label>メールアドレス</Label>
          <Input name="email" type="text" id="email" />

          {errors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.email[0]}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label>パスワード</Label>
          <Input name="password" type="password" id="password" />

          {errors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {errors.password[0]}
            </p>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground hover:underline"
          >
            パスワードをお忘れ場合
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : 'ログイン'}
        </Button>

        <Button variant="link" className="w-full" size="sm">
          <Link href="/auth/sign-up">アカウント作成</Link>
        </Button>
      </form>
      <Separator />

      <form action={signInWithGoogle}>
        <Button type="submit" variant="outline" className="w-full">
          <Image src={googleIcon} className="mr-2 size-4" alt="" />
          Google アカウントでログイン
        </Button>
      </form>
    </div>
  )
}
