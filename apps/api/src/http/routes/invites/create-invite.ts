import { roleSchema } from '@crono/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { BadRequestError } from '../_errors/bad-request-error'
import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createInvite(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/teams/:slug/invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Create an invite to a team.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            email: z.string(),
            role: roleSchema,
          }),
          response: {
            201: z.object({
              inviteId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, team } =
          await request.getUserMembership(slug)

        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('create', 'Invite')) {
          throw new UnauthorizedError(
            'You are not allowed to create new invites.',
          )
        }

        const { email, role } = request.body
        const inviteWithSameEmail = await prisma.invite.findUnique({
          where: {
            email_teamId: {
              email,
              teamId: team.id,
            },
          },
        })

        if (inviteWithSameEmail) {
          throw new BadRequestError(
            'Another invite with same e-mail already exists.',
          )
        }

        const memberWithSameEmail = await prisma.member.findFirst({
          where: {
            teamId: team.id,
            user: {
              email,
            },
          },
        })

        if (memberWithSameEmail) {
          throw new BadRequestError(
            'A member with this e-mail already belongs to your team',
          )
        }

        const invite = await prisma.invite.create({
          data: {
            teamId: team.id,
            email,
            role,
            authorId: userId,
          },
        })

        return reply.status(201).send({ inviteId: invite.id })
      },
    )
}
