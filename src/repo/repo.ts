import { Client } from 'pg'
import { User } from '../entity/user'
import { UserWithRolesDto } from '../dto/user.with.roles.dto'
import { Role } from '../entity/role'

export class Repo {

    constructor(private readonly dbClient: Client) {
    }

    public async getUserByLogin(login: string): Promise<User> {
        const result = await this.dbClient.query({
            text: 'select * from users where login = $1',
            values: [login]
        })

        return result.rows[0]
    }

    public async getRolesByUserLogin(login: string) {
        const result = await this.dbClient.query({
            text: 'select r.name from roles r left join roles_to_users ru on r.id = ru.id_role where ru.login_user = $1',
            values: [login]
        })

        return result.rows
    }

    public async getAllUsers() {
        const result = await this.dbClient.query({
            text: 'select * from users'
        })

        return result.rows
    }

    public async saveUserInDB(user: User) {
        await this.dbClient.query({
            text: 'insert into users (name, login, password) values ($1, $2, $3)',
            values: [user.name, user.login, user.password]
        })
    }


    public async updateUserByLogin(login: string, dto: UserWithRolesDto) {
        if (dto.roles.size != 0) {
            await this.deleteRolesByUser(login)
            await this.saveRolesForUsers(login, dto.roles)
        }
        await this.dbClient.query({
            text: 'update users set name = $1, password = $2 where login = $3',
            values: [dto.user.name, dto.user.password, login]
        })
    }

    public async deleteUserDB(login: string) {
        await this.dbClient.query({
            text: 'delete from users where login = $1',
            values: [login]
        })
    }

    public async saveRolesForUsers(login: string, roles: Set<Role>) {
        roles.forEach((role, roleAgain, roles) => {
            this.dbClient.query({
                text: 'insert into roles_to_users (login_user, id_role) values ($1, $2)',
                values: [login, role.id]
            })
        })
    }

    private async deleteRolesByUser(login: string) {
        await this.dbClient.query({
            text: 'delete * from roles_to_users where login_user = $1',
            values: [login]
        })
    }
}
