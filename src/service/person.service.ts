import { Person } from '../entity/person'
import { Client } from 'pg'

export class PersonService {

    constructor(private readonly dbClient: Client) {
    }

    public async getPerson(id: number): Promise<Person> {
        const qve = await this.dbClient.query<Person>({
            text: 'select * from person where id = $1',
            values: [id]
        })
        return qve.rows[0]
    }


}
