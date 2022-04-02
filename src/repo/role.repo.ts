import { Client } from 'pg'

export class RoleRepo {

    constructor(private readonly dbClient: Client) {
    }

    public async getAllRolesFromDB() {
        const result =  await this.dbClient.query({
            text: 'select * from roles'
        })

        return result.rows
    }


}
