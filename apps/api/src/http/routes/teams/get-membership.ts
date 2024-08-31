import { roleSchema } from '@crono/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'

export async function getMembership(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/teams/:slug/membership',
      {
        schema: {
          tags: ['teams'],
          summary: 'Get user membership on team',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              membership: z.object({
                id: z.string().uuid(),
                role: roleSchema,
                userId: z.string().uuid(),
                teamId: z.string().uuid(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { membership } = await request.getUserMembership(slug)

        return reply.status(200).send({
          membership: {
            id: membership.id,
            role: membership.role,
            teamId: membership.teamId,
            userId: membership.userId,
          },
        })
      },
    )
}
