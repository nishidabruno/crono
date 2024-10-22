'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

// import { createProject } from '@/http/create-project'

const createProjectSchema = z.object({
  projectName: z.string().min(4, {
    message: 'チーム名を入力してください。',
  }),
})

export async function createProjectAction(data: FormData) {
  const result = createProjectSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { projectName } = result.data

  try {
    console.log('yeppp')
    await createProject({
      projectName,
    })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json<{ message: string }>()

      return { success: false, message, errors: null }
    }

    // Use sentry instead
    console.error(err)

    return {
      success: false,
      message:
        '予期しないエラーが発生しました。数分後にもう一度お試しください。',
      errors: null,
    }
  }

  return {
    success: true,
    message: 'Successfully saved the project.',
    errors: null,
  }
}
