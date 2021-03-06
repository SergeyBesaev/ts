import { Client } from 'pg'
import { User } from '../entity/user'
import { UserWithRolesDto } from '../dto/user.with.roles.dto'
import { Role } from '../entity/role'

export class UserRepo {

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
        await this.validation(user)

        await this.dbClient.query({
            text: 'insert into users (name, login, password) values ($1, $2, $3)',
            values: [user.name, user.login, user.password]
        })
    }


    public async updateUserByLogin(login: string, dto: UserWithRolesDto) {
        await this.validation(dto.user)

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

    private async validation(user: User) {
        const nameAndLoginCheck = new RegExp(/(?=.{1,64})/)
        const password = new RegExp(/(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/)

        if(!user.name.match(nameAndLoginCheck)) {
            throw new Error('Field Name must be 8 characters or more')
        }

        if(!user.login.match(nameAndLoginCheck)) {
            throw new Error('Field Login must be 8 characters or more')
        }

        if(!user.password.match(password)) {
            throw new Error('Password is not valid')
        }

    }

    private async deleteRolesByUser(login: string) {
        await this.dbClient.query({
            text: 'delete * from roles_to_users where login_user = $1',
            values: [login]
        })
    }
}
