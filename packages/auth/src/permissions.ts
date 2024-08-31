import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['update'], 'Team')
    can(['update'], 'Team', {
      ownerId: { $eq: user.id },
    })
  },
  MANAGER(user, { can, cannot }) {
    can('manage', 'all')

    cannot(['delete'], 'Project')
    cannot(['update', 'delete'], 'Team')
    can(['update'], 'Team', {
      ownerId: { $eq: user.id },
    })
  },
  MEMBER(user, { can }) {
    can('get', 'User')
    // should user also be able to get/create another user project?
    can(['create', 'get'], 'Project')
    can(['update', 'delete'], 'Project', { ownerId: { $eq: user.id } })
  },
}
