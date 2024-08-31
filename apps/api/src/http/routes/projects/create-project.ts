import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { auth } from '@/http/middlewares/auth'
import { prisma } from '@/lib/prisma'
import { createSlug } from '@/utils/create-slug'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function createProject(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .register(auth)
    .post(
      '/teams/:slug/projects',
      {
        schema: {
          tags: ['projects'],
          summary: 'Create a new project.',
          security: [{ bearerAuth: [] }],
          params: z.object({
            slug: z.string(),
          }),
          body: z.object({
            name: z.string(),
            description: z.string(),
          }),
          response: {
            201: z.object({
              projectId: z.string().uuid(),
            }),
          },
        },
      },
      async (request, reply) => {
        const { slug } = request.params
        const userId = await request.getCurrentUserId()
        const { membership, team } =
          await request.getUserMembership(slug)

        // Currently all users are allowed to create a project.
        const { cannot } = getUserPermissions(userId, membership.role)
        if (cannot('create', 'Project')) {
          throw new UnauthorizedError(
            'You are not allowed to create a new project.',
          )
        }

        const { name, description } = request.body

        const project = await prisma.project.create({
          data: {
            name,
            slug: createSlug(name),
            description,
            teamId: team.id,
            ownerId: userId,
          },
        })

        return reply.status(201).send({ projectId: project.id })
      },
    )
}
