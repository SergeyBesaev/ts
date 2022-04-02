import { UserService } from './user.service'
import { RoleService } from './role.service'

export default interface IService {
    userService: UserService
    roleService: RoleService
}
