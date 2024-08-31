import { env } from '@crono/env'
import type { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import z from 'zod'

import { prisma } from '@/lib/prisma'

export async function authWithGoogle(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/sessions/google',
    {
      schema: {
        tags: ['auth'],
        summary: 'Authenticate with Google',
        body: z.object({
          code: z.string(),
        }),
        response: {
          201: z.object({
            token: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { code } = request.body

      const googleOAuthURL = new URL('https://oauth2.googleapis.com/token')
      googleOAuthURL.searchParams.set('grant_type', 'authorization_code')
      googleOAuthURL.searchParams.set('client_id', env.GOOGLE_OAUTH_CLIENT_ID)
      googleOAuthURL.searchParams.set(
        'redirect_uri',
        env.GOOGLE_OAUTH_CLIENT_REDIRECT_URI,
      )
      googleOAuthURL.searchParams.set(
        'client_secret',
        env.GOOGLE_OAUTH_CLIENT_SECRET,
      )
      googleOAuthURL.searchParams.set('code', code)

      const googleOAuthRequest = await fetch(googleOAuthURL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      })

      const response = await googleOAuthRequest.json()
      console.log(response)

      const { access_token: accessToken } = z
        .object({
          access_token: z.string(),
          token_type: z.literal('Bearer'),
          scope: z.string(),
        })
        .parse(response)

      const googleUserInfoRequest = await fetch(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      )

      const googleUserInfo = await googleUserInfoRequest.json()

      const {
        sub: googleId,
        name,
        email,
        picture,
      } = z
        .object({
          sub: z.string(),
          name: z.string(),
          picture: z.string().url(),
          email: z.string().email(),
        })
        .parse(googleUserInfo)

      let user = await prisma.user.findUnique({
        where: { email },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            avatarUrl: picture,
          },
        })
      }

      let account = await prisma.account.findUnique({
        where: {
          provider_userId: {
            provider: 'GOOGLE',
            userId: user.id,
          },
        },
      })

      if (!account) {
        account = await prisma.account.create({
          data: {
            provider: 'GOOGLE',
            providerAccountId: googleId,
            userId: user.id,
          },
        })
      }

      const token = await reply.jwtSign(
        { sub: user.id },
        {
          sign: {
            expiresIn: '7d',
          },
        },
      )

      return reply.status(200).send({ token })
    },
  )
}
