import { Client } from 'pg'
import { Users } from '../entity/users'
import { Role } from '../entity/role'
import { UserWithRolesDTO } from '../dto/user.with.roles.DTO'

export class UserRepo {

    constructor(private readonly dbClient: Client) {
    }

    public async fetchUserByLogin(login: string): Promise<Users> {
        const result = await this.dbClient.query<Users>({
            text: 'select * from users where login = $1',
            values: [login]
        })

        if (result.rows.length === 0) {
            throw new Error(`User with login ${login} not found`)
        }

        return result.rows[0]
    }

    public async fetchRolesByUserLogin(login: string): Promise<Set<Role>[]> {
        const result = await this.dbClient.query<Set<Role>>({
            text: 'select r.name from roles r left join roles_to_users ru on r.id = ru.id_role where ru.login_user = $1',
            values: [login]
        })
        return result.rows
    }

    public async fetchAllUsers(): Promise<Array<Users>> {
        const result = await this.dbClient.query({
            text: 'select * from users'
        })
        return result.rows
    }

    public async deleteUserByLogin(login: string) {
        const result = await this.dbClient.query<Users>({
            text: 'select * from users where login = $1',
            values: [login]
        })

        if (result.rows.length === 0) {
            throw new Error(`User with login ${login} not found`)
        }

        await this.dbClient.query({
            text: 'delete from users where login = $1',
            values: [login]
        })

        return this.fetchAllUsers()
    }

    public async saveUser(dto: Users) {
        await this.dbClient.query({
            text: 'insert into users (name, login, password) values ($1, $2, $3)',
            values: [dto.name, dto.login, dto.password]
        })
    }

    public async saveRolesForUsers(user: Users, roles: Set<Role>) {
        roles.forEach((role, roleAgain, roles) => {
            this.dbClient.query({
                text: 'insert into roles_to_users (login_user, id_role) values ($1, $2)',
                values: [user.login, role.id]
            })
        })

    }

    public async updateUser(dto: UserWithRolesDTO) {
        await this.dbClient.query({
            text: 'update users set name = $1, password = $2 where login = $3',
            values: [dto.user.name, dto.user.password, dto.user.login]
        })

        if(dto.roles.size != 0) {
            await this.updateRolesForUsers(dto)
        }

    }

    private async updateRolesForUsers(dto: UserWithRolesDTO) {
        await this.dbClient.query({
            text: 'delete from roles_to_users where login_user = $1',
            values: [dto.user.login]
        })

        dto.roles.forEach((role, roleAgain, roles) => {
            this.dbClient.query({
                text: 'insert into roles_to_users (login_user, id_role) values ($1, $2)',
                values: [dto.user.login, role.id]
            })
        })
    }
}


