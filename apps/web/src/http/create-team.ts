import { api } from './api-client'

interface CreateTeamWithRequest {
  teamName: string
}

export async function createTeam({ teamName }: CreateTeamWithRequest) {
  await api.post('teams', {
    json: {
      name: teamName,
    },
  })
}
