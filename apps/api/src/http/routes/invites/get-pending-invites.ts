import { roleSchema } from '@crono/auth'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'

import { BadRequestError } from '../_errors/bad-request-error'

export async function getPendingInvites(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .get(
      '/pending-invites',
      {
        schema: {
          tags: ['invites'],
          summary: 'Get all user pending invites.',
          security: [{ bearerAuth: [] }],
          response: {
            200: z.object({
              invites: z.array(
                z.object({
                  id: z.string().uuid(),
                  role: roleSchema,
                  email: z.string().email(),
                  createdAt: z.date(),
                  author: z
                    .object({
                      id: z.string().uuid(),
                      name: z.string().nullable(),
                    })
                    .nullable(),
                }),
              ),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()

        // Necessary?
        const user = await prisma.user.findUnique({
          where: {
            id: userId,
          },
        })
        if (!user) {
          throw new BadRequestError('User not found.')
        }

        const invites = await prisma.invite.findMany({
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            team: {
              select: {
                name: true,
              },
            },
          },
          where: {
            email: user.email,
          },
        })

        return reply.status(200).send({ invites })
      },
    )
}
