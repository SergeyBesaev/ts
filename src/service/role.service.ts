import IRepo from '../repo/irepo'
import { RoleRepo } from '../repo/role.repo'

export class RoleService {

    private readonly repo: RoleRepo

    constructor(repo: IRepo) {
        this.repo = repo.roleRepo
    }

    public async fetchAllRoles() {
        return await this.repo.getAllRolesFromDB()
    }

}
