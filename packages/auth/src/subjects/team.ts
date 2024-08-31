import { z } from 'zod'

import { teamSchema } from '../models/team'

export const teamSubject = z.tuple([
  z.union([z.literal('manage'), z.literal('update'), z.literal('delete')]),
  z.union([z.literal('Team'), teamSchema]),
])

export type TeamSubject = z.infer<typeof teamSubject>
