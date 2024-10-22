import { api } from './api-client'

interface GetProjectsResponse {
  projects: {
    id: string
    name: string
    slug: string
    avatarUrl: string | null
    teamId: string
    ownerId: string
    owner: {
      id: string
      name: string
      avatarUrl: string | null
    }
  }[]
}

export async function getProjects(teamId: string) {
  const result = await api
    .get(`teams/${teamId}/projects`)
    .json<GetProjectsResponse>()

  return result
}
