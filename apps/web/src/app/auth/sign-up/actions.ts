'use server'

import { HTTPError } from 'ky'
import { z } from 'zod'

import { signUp } from '@/http/sign-up'

const signInSchema = z
  .object({
    name: z.string().refine((value) => value.split(' ').length > 1, {
      message: '姓と名の入力してください。',
    }),
    email: z
      .string()
      .email({ message: '有効なメールアドレスを入力してください。' }),
    password: z.string().min(6, {
      message: 'パスワードは6文字以上で入力してください。',
    }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'パスワードが一致しません。',
    path: ['password_confirmation'],
  })

export async function signUpAction(data: FormData) {
  const result = signInSchema.safeParse(Object.fromEntries(data))

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors

    return { success: false, message: null, errors }
  }

  const { name, email, password } = result.data

  try {
    await signUp({
      name,
      email,
      password,
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
