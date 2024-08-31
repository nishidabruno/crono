import { env } from '@crono/env'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import { fastifyMultipart } from '@fastify/multipart'
import fastifySwagger from '@fastify/swagger'
import scalarApiReferece from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod'

import { errorHandler } from './error-handler'
import { authWithGoogle } from './routes/auth/auth-with-google'
import { authWithPassword } from './routes/auth/auth-with-password'
import { createAccount } from './routes/auth/create-account'
import { getProfile } from './routes/auth/get-profile'
import { requestPasswordRecovery } from './routes/auth/request-password-recovery'
import { resetPassword } from './routes/auth/reset-password'
import { acceptInvite } from './routes/invites/accept-invite'
import { createInvite } from './routes/invites/create-invite'
import { getInvite } from './routes/invites/get-invite'
import { getInvites } from './routes/invites/get-invites'
import { getPendingInvites } from './routes/invites/get-pending-invites'
import { rejectInvite } from './routes/invites/reject-invite'
import { revokeInvite } from './routes/invites/revoke-invite'
import { getMembers } from './routes/members/get-member'
import { removeMember } from './routes/members/remove-member'
import { updateMember } from './routes/members/update-member'
import { createProject } from './routes/projects/create-project'
import { deleteProject } from './routes/projects/delete-project'
import { getProject } from './routes/projects/get-project'
import { getProjects } from './routes/projects/get-projects'
import { updateProject } from './routes/projects/update-project'
import { chat } from './routes/rag/chat'
import { embedFile } from './routes/rag/embed_file'
import { createTeam } from './routes/teams/create-team'
import { getMembership } from './routes/teams/get-membership'
import { getTeam } from './routes/teams/get-team'
import { getTeams } from './routes/teams/get-teams'
import { shutdownTeam } from './routes/teams/shutdown-team'
import { updateTeam } from './routes/teams/update-team'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)
app.setErrorHandler(errorHandler)

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST'],
})
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})
app.register(fastifyMultipart, {
  limits: {
    // 10 MB
    fileSize: 20 * 1024 * 1024,
  },
})

// Docs
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Crono',
      description: 'An application to manage your cronogram.',
      version: '0.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})
app.register(scalarApiReferece, {
  routePrefix: '/docs',
  configuration: {},
})

// Routes
app.register(createAccount)
app.register(getProfile)
app.register(authWithPassword)
app.register(authWithGoogle)
app.register(requestPasswordRecovery)
app.register(resetPassword)
app.register(createTeam)
app.register(updateTeam)
app.register(getTeam)
app.register(getTeams)
app.register(shutdownTeam)
app.register(getMembership)
app.register(createInvite)
app.register(acceptInvite)
app.register(getInvite)
app.register(getInvites)
app.register(getPendingInvites)
app.register(rejectInvite)
app.register(revokeInvite)
app.register(getMembers)
app.register(removeMember)
app.register(updateMember)
app.register(createProject)
app.register(deleteProject)
app.register(getProject)
app.register(getProjects)
app.register(updateProject)
app.register(embedFile)
app.register(chat)

app.listen({ port: env.SERVER_PORT }).then(() => {
  console.log(`HTTP server is running on port ${env.SERVER_PORT}...`)
})
