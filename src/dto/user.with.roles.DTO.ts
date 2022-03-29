import { Users } from '../entity/users'
import { Role } from '../entity/role'

export interface UserWithRolesDTO {
    user: Users
    roles: Set<Role>
}
