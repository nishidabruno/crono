import { teamSchema } from '@crono/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function updateTeam(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .put(
      '/teams/:slug',
      {
        schema: {
          tags: ['teams'],
          summary: 'Update team details',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
          }),
          response: {
            204: z.null(),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params

        const userId = await request.getCurrentUserId()
        const { team, membership } = await request.getUserMembership(slug)

        const { name } = request.body

        const authTeam = teamSchema.parse(team)

        const { cannot } = getUserPermissions(userId, membership.role)

        if (cannot('update', authTeam)) {
          throw new UnauthorizedError('User not allowed to update this team.')
        }

        await prisma.team.update({
          where: {
            id: team.id,
          },
          data: {
            name,
          },
        })

        return reply.status(204).send()
      },
    )
}
