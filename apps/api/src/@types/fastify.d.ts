import type { Member, Team } from '@prisma/client'

declare module 'fastify' {
  export interface FastifyRequest {
    getCurrentUserId(): Promise<string>
    getUserMembership(teamSlug: string): Promise<{
      team: Team
      membership: Member
    }>
  }
}
