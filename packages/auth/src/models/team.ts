import { z } from 'zod'

export const teamSchema = z.object({
  __typename: z.literal('Team').default('Team'),
  id: z.string(),
  ownerId: z.string(),
})

export type Team = z.infer<typeof teamSchema>
