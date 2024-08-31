import { api } from './api-client'

interface GetTeamsResponse {
  teams: {
    id: string
    name: string | null
    slug: string
    avatarUrl: string | null
  }[]
}

export async function getTeams() {
  const result = await api.get('teams').json<GetTeamsResponse>()

  return result
}
