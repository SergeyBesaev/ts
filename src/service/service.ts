import IRepo from '../repo/irepo'
import { Repo } from '../repo/repo'
import { User } from '../entity/user'
import { UserWithRolesDto } from '../dto/user.with.roles.dto'

export class Service {

    private readonly repo: Repo

    constructor(repo: IRepo) {
        this.repo = repo.repo
    }

    public async fetchAllUsers() {
        return await this.repo.getAllUsers()
    }

    public async saveUser(dto: UserWithRolesDto) {
        await this.repo.saveUserInDB(dto.user)

        if(dto.roles.size != 0) {
            await this.repo.saveRolesForUsers(dto.user.login, dto.roles)
        }

        return this.fetchUserByLogin(dto.user.login)
    }

    public async fetchUserByLogin(login: string) {
        const user: User = await this.repo.getUserByLogin(login)
        const roles = await this.repo.getRolesByUserLogin(login)
        return {
            user: user,
            roles: roles
        }

    }

    public async updateUser(login: string, dto: UserWithRolesDto) {
        await this.repo.updateUserByLogin(login, dto)
        return this.fetchUserByLogin(login)
    }

    public async deleteUserByLogin(login: string) {
        await this.repo.deleteUserDB(login)
        return this.fetchAllUsers()
    }

}
