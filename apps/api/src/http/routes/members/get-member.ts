import { roleSchema } from '@crono/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function getMembers(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/teams/:slug/members/',
      {
        schema: {
          tags: ['members'],
          summary: 'Get all team members.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          response: {
            200: z.object({
              members: z.array(
                z.object({
                  id: z.string(),
                  userId: z.string(),
                  role: roleSchema,
                  name: z.string().nullable(),
                  email: z.string(),
                  avatarUrl: z.string().url().nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, team } =
          await request.getUserMembership(slug)

        // User is allowed to get all member details of the org he is in.
        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('get', 'User')) {
          throw new UnauthorizedError(
            'You are not allowed to see team members.',
          )
        }

        const members = await prisma.member.findMany({
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
              },
            },
          },
          where: {
            teamId: team.id,
          },
          orderBy: {
            role: 'asc',
          },
        })

        const membersWithRoles = members.map(
          ({ user: { id: userId, ...user }, ...member }) => {
            return {
              ...user,
              ...member,
              userId,
            }
          },
        )

        return reply.send({ members: membersWithRoles })
      },
    )
}
