'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { createTeam } from '@/http/create-team'

const createTeamSchema = z.object({
  teamName: z.string().min(4, {
    message: 'チーム名を入力してください。',
  }),
})

export async function createTeamAction(data: FormData) {
  const result = createTeamSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { teamName } = result.data

  try {
    console.log('yeppp')
    await createTeam({
      teamName,
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
    message: 'Successfully saved the team.',
    errors: null,
  }
}
