import { teamSchema } from '@crono/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function shutdownTeam(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .delete(
      '/teams/:slug',
      {
        schema: {
          tags: ['teams'],
          summary: 'Shutdown team.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { team, membership } =
          await request.getUserMembership(slug)

        const authTeam = teamSchema.parse({
          id: userId,
          ownerId: team.ownerId,
        })

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('delete', authTeam)) {
          throw new UnauthorizedError(
            'User not allowed to shutdown this team.',
          )
        }

        await prisma.team.delete({
          where: {
            id: team.id,
          },
        })

        return reply.status(204).send()
      },
    )
}
