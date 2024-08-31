import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

import { UnauthorizedError } from '../_errors/unauthorized-error'

export async function resetPassword(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/password/reset',
    {
      schema: {
        tags: ['auth'],
        summary: 'Reset password from code.',
        body: z.object({
          code: z.string(),
          newPassword: z.string().min(6),
        }),
        response: {
          204: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { code, newPassword } = request.body

      const token = await prisma.token.findUnique({
        where: { id: code },
      })

      if (!token) {
        throw new UnauthorizedError()
      }

      const passwordHash = await hash(newPassword, 6)

      await prisma.$transaction([
        prisma.user.update({
          where: {
            id: token.userId,
          },
          data: {
            passwordHash,
          },
        }),

        prisma.token.delete({
          where: {
            id: code,
          },
        }),
      ])

      return reply.status(204).send()
    },
  )
}
