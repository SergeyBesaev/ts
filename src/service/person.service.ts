import { UserRepo } from '../repo/user.repo'
import { UserWithRolesDTO } from '../dto/user.with.roles.DTO'
import Repos from '../repo/repos'

export class PersonService {

    private readonly userRepo: UserRepo

    constructor(repos: Repos) {
        this.userRepo = repos.userRepo
    }

    public async fetchUserWithRoles(login: string): Promise<UserWithRolesDTO>{
        const fetchUser = await this.userRepo.fetchUserByLogin(login)
        const fetchRoles = await this.userRepo.fetchRolesByUserLogin(login)

        return {
            user: fetchUser,
            roles: fetchRoles
        }
    }

    public async updateUser(dto: UserWithRolesDTO) {
        await this.validation(dto)

        await this.userRepo.updateUser(dto)
        return this.fetchUserWithRoles(dto.user.login)
    }

    public async deleteUserByLogin(login: string) {
        return this.userRepo.deleteUserByLogin(login)
    }

    public async saveUserWithRoles(dto: UserWithRolesDTO) {
        await this.validation(dto)

        await this.userRepo.saveUser(dto.user)
        await this.userRepo.saveRolesForUsers(dto.user, dto.roles)

        return this.fetchUserWithRoles(dto.user.login)
    }

    public async fetchAllUsers() {
        return await this.userRepo.fetchAllUsers()
    }

    private async validation (dto: UserWithRolesDTO) {
        const validChar = new RegExp(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/)
        const validNumChar = new RegExp(/(?=.{1,64})/)
        const validNumCharPassword = new RegExp(/(?=.{8,64})/)


        if (!dto.user.password.match(validChar)) {
            throw new Error('Password is not valid')
        }

        if(!dto.user.name.match(validNumChar)) {
            throw new Error('')
        }

        if (!dto.user.login.match(validNumChar)) {
            throw new Error('')
        }

        if (!dto.user.password.match(validNumCharPassword)) {
            throw new Error('The minimum number of characters is 8')
        }


    }
}
