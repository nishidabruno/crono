import { defineAbilityFor, projectSchema } from '@crono/auth'

const ability = defineAbilityFor({ role: 'MEMBER', id: 'user-1' })

const project = projectSchema.parse({ id: 'project-id', ownerId: 'user-1' })

console.log(ability.can('update', project))
