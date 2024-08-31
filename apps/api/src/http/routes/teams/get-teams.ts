import { roleSchema } from '@crono/auth'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

export async function getTeams(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/teams',
      {
        schema: {
          tags: ['teams'],
          summary: 'Get teams details where user is member.',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              teams: z.array(
                z.object({
                  id: z.string().uuid(),
                  name: z.string(),
                  slug: z.string(),
                  avatarUrl: z.string().nullable(),
                  role: roleSchema,
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        const teams = await prisma.team.findMany({
          select: {
            id: true,
            name: true,
            slug: true,
            avatarUrl: true,
            members: {
              select: {
                role: true,
              },
              where: {
                userId,
              },
            },
          },
          where: {
            members: {
              some: {
                userId,
              },
            },
          },
        })

        const teamsWithUserRole = teams.map(({ members, ...org }) => {
          return {
            ...org,
            role: members[0].role,
          }
        })

        return reply.status(200).send({
          teams: teamsWithUserRole,
        })
      },
    )
}
