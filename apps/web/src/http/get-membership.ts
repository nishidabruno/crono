import { Role } from '@crono/auth'

import { api } from './api-client'

interface GetMembershipResponse {
  membership: {
    id: string
    role: Role
    userId: string
    teamId: string
  }
}

export async function getMembership(teamSlug: string) {
  const result = await api
    .get(`teams/${teamSlug}/membership`)
    .json<GetMembershipResponse>()

  return result
}
