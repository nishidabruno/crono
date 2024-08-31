'use server'

import { HTTPError } from 'ky'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { signInWithPassword } from '@/http/sign-in-with-password'

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: '有効なメールアドレスを入力してください。' }),
  password: z.string().min(6, {
    message: 'パスワードは6文字以上で入力してください。',
  }),
})

export async function signInWithEmailAndPassword(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { email, password } = result.data

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    })

    cookies().set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
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

  return { success: true, message: null, errors: null }
}
