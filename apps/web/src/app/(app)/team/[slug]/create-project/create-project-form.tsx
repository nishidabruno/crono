'use client'

import { AlertTriangle, Loader2, ThumbsUp } from 'lucide-react'

// import { useRouter } from 'next/navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useFormState } from '@/hooks/user-form-state'

import { createProjectAction } from './action'

export function CreateProjectForm() {
  // const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] =
    useFormState(createProjectAction)

  return (
    <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Could not create a new project.</AlertTitle>
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
        <Label>Project name</Label>
        <Input name="projectName" id="projectName" />

        {errors?.projectName && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.projectName[0]}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Create'}
      </Button>
    </form>
  )
}
