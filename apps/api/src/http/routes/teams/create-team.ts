import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'

import { BadRequestError } from '../_errors/bad-request-error'

export async function createTeam(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/teams',
      {
        schema: {
          tags: ['teams'],
          summary: 'Create a new team.',
          security: [{ bearerAuth: [] }],
          body: z.object({
            name: z.string(),
          }),
          response: {
            201: z.object({
              teamId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const userId = await request.getCurrentUserId()
        const { name } = request.body

        const slug = createSlug(name)

        const sameSlug = await prisma.team.findUnique({
          where: {
            slug,
          },
        })

        if (sameSlug) {
          throw new BadRequestError(
            'Another team with same slug already exists.',
          )
        }

        const team = await prisma.team.create({
          data: {
            name,
            slug,
            ownerId: userId,
            members: {
              create: {
                userId,
                role: 'ADMIN',
              },
            },
          },
        })

        return reply.status(201).send({ teamId: team.id })
      },
    )
}
