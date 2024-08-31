import { api } from './api-client'

interface SignUpWithRequest {
  name: string
  email: string
  password: string
}

type SignUpResponse = never

export async function signUp({ name, email, password }: SignUpWithRequest) {
  const result = await api
    .post('users', {
      json: {
        name,
        email,
        password,
      },
    })
    .json<SignUpResponse>()

  return result
}
