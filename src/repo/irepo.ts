import { UserRepo } from './user.repo'
import { RoleRepo } from './role.repo'

export default interface IRepo {
    userRepo: UserRepo
    roleRepo: RoleRepo
}
