'use client'

import { AlertTriangle, Loader2, ThumbsUp } from 'lucide-react'

// import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/user-form-state'

import { createTeamAction } from './actions'

export function CreateTeamForm() {
  // const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createTeamAction)

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>ログインできませんでした。</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {success === true && message && (
        <Alert variant="success">
          <ThumbsUp className="size-4" />
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}
      <div className="space-y-1">
        <Label>チーム名</Label>
        <Input name="teamName" id="teamName" />

        {errors?.teamName && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.teamName[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : 'チーム作成'}
      </Button>
    </form>
  )
}
