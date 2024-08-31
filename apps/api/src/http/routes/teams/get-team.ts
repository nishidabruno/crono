import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'

export async function getTeam(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/teams/:slug',
      {
        schema: {
          tags: ['teams'],
          summary: 'Get details from an team where user is member.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              team: z.object({
                id: z.string().uuid(),
                name: z.string(),
                slug: z.string(),
                avatarUrl: z.string().nullable(),
                createdAt: z.date(),
                updatedAt: z.date(),
                ownerId: z.string(),
              }),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const { team } = await request.getUserMembership(slug)

        return reply.status(200).send({
          team,
        })
      },
    )
}
