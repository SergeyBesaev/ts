import { User } from '../entity/user'
import { Role } from '../entity/role'

export interface UserWithRolesDto {
    user: User
    roles: Set<Role>
}
